import type { HiggsFieldConfig, RequestOptions } from "../types/index";
import { HiggsFieldError } from "../types/index";

const SERVICE_BASES: Record<string, string> = {
  fnf: "https://fnf.higgsfield.ai",
  community: "https://community.higgsfield.ai",
  notification: "https://notification.higgsfield.ai",
  cms: "https://cms.higgsfield.ai",
  clerk: "https://clerk.higgsfield.ai",
  fnfScore: "https://fnf-score.higgsfield.ai",
};

const CLERK_API_VERSION = "2025-11-10";

function decodeJwtPayload(token: string): { exp?: number; sid?: string; sub?: string } {
  try {
    const part = token.split(".")[1];
    if (!part) return {};
    const padded = part + "=".repeat((4 - (part.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return {};
  }
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private token: string | undefined;
  private clerkSessionId: string | undefined;
  private clerkClientToken: string | undefined;
  private datadome: string | undefined;
  private tokenExpiry = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: HiggsFieldConfig) {
    this.baseUrl = config.baseUrl ?? "https://fnf.higgsfield.ai";
    this.timeout = config.timeout ?? 30000;
    this.datadome = config.datadome;

    if (config.clerk) {
      this.clerkSessionId = config.clerk.sessionId;
      this.clerkClientToken = config.clerk.clientToken;
      this.token = undefined;
    } else if (config.token) {
      this.token = config.token;
      const payload = decodeJwtPayload(config.token);
      this.tokenExpiry = (payload.exp ?? 0) * 1000;
    } else {
      throw new Error("Provide either `token` or `clerk` config");
    }
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        if (!this.clerkSessionId || !this.clerkClientToken) {
          throw new Error("Clerk session config required for auto-refresh");
        }

        const url = `https://clerk.higgsfield.ai/v1/client/sessions/${this.clerkSessionId}/tokens?__clerk_api_version=${CLERK_API_VERSION}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.clerkClientToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new HiggsFieldError(response.status, response.statusText, await response.text().catch(() => null));
        }

        const data = (await response.json()) as { jwt?: string };
        if (!data.jwt) {
          throw new Error("No JWT in Clerk token response");
        }

        this.token = data.jwt;
        const payload = decodeJwtPayload(data.jwt);
        this.tokenExpiry = (payload.exp ?? 0) * 1000;

        return this.token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async getToken(): Promise<string> {
    const bufferMs = 10_000;
    if (this.token && Date.now() < this.tokenExpiry - bufferMs) {
      return this.token;
    }

    if (this.clerkSessionId) {
      return this.refreshToken();
    }

    if (!this.token) {
      throw new Error("No token available. Provide `clerk` config for auto-refresh or a fresh `token`.");
    }

    return this.token;
  }

  private buildUrl(
    service: string,
    path: string,
    params?: Record<string, string | string[] | number | boolean | undefined>,
  ): string {
    const base = SERVICE_BASES[service] ?? this.baseUrl;
    const url = new URL(path, base);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const v of value) url.searchParams.append(key, String(v));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private cookies(): Record<string, string> {
    if (!this.datadome) return {};
    return { Cookie: `datadome=${this.datadome}` };
  }

  async request<T>(service: string, method: string, path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(service, path, options?.params);
    const token = await this.getToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...this.cookies(),
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 401 && this.clerkSessionId) {
        this.tokenExpiry = 0;
        const retryToken = await this.refreshToken();
        clearTimeout(timeoutId);

        const retryController = new AbortController();
        const retryTimeoutId = setTimeout(() => retryController.abort(), options?.timeout ?? this.timeout);

        try {
          const retryResponse = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${retryToken}`,
              "Content-Type": "application/json",
              ...this.cookies(),
              ...options?.headers,
            },
            body: options?.body ? JSON.stringify(options.body) : undefined,
            signal: retryController.signal,
          });

          if (!retryResponse.ok) {
            let body: unknown;
            try {
              body = await retryResponse.json();
            } catch {
              body = await retryResponse.text().catch(() => null);
            }
            throw new HiggsFieldError(retryResponse.status, retryResponse.statusText, body);
          }

          const ct = retryResponse.headers.get("content-type");
          if (ct?.includes("application/json")) return retryResponse.json() as Promise<T>;
          return retryResponse as unknown as T;
        } finally {
          clearTimeout(retryTimeoutId);
        }
      }

      if (!response.ok) {
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          body = await response.text().catch(() => null);
        }
        throw new HiggsFieldError(response.status, response.statusText, body);
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response.json() as Promise<T>;
      }
      if (contentType?.includes("text/event-stream")) {
        return response as unknown as T;
      }
      return response as unknown as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
