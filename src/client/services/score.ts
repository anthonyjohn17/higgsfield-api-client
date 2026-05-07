import type { HttpClient } from "../http";

export class ScoreService {
  constructor(private http: HttpClient) {}

  getKarmaTasks() {
    return this.http.request<unknown>("fnfScore", "GET", "/v1/karma/tasks");
  }
}
