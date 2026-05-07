import type { HttpClient } from "../http";

export class NotificationService {
  constructor(private http: HttpClient) {}

  getStream() {
    return this.http.request<Response>("notification", "GET", "/notifications/stream");
  }

  list(limit = 20) {
    return this.http.request<unknown>("notification", "GET", "/notifications", {
      params: { limit },
    });
  }

  getOffers() {
    return this.http.request<unknown>("fnf", "GET", "/notification/offers");
  }
}
