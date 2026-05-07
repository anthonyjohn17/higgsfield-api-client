import type { HttpClient } from "../http";

export class ClerkService {
  constructor(private http: HttpClient) {}

  getEnvironment() {
    return this.http.request<unknown>("clerk", "GET", "/v1/environment");
  }

  getClient() {
    return this.http.request<unknown>("clerk", "GET", "/v1/client");
  }

  getMe() {
    return this.http.request<unknown>("clerk", "GET", "/v1/me");
  }

  createSessionToken(sessionId: string) {
    return this.http.request<unknown>("clerk", "POST", `/v1/client/sessions/${sessionId}/tokens`);
  }
}
