export interface ClerkSessionConfig {
  sessionId: string;
  clientToken: string;
}

export interface HiggsFieldConfig {
  token?: string;
  clerk?: ClerkSessionConfig;
  datadome?: string;
  baseUrl?: string;
  timeout?: number;
}

export class HiggsFieldError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`HiggsField API error: ${status} ${statusText}`);
    this.name = "HiggsFieldError";
  }
}

export interface RequestOptions {
  params?: Record<string, string | string[] | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}
