import type { HttpClient } from "../http";

export class CommunityService {
  constructor(private http: HttpClient) {}

  getComments(publicationId: string, limit = 20) {
    return this.http.request<unknown>("community", "GET", `/publications/${publicationId}/comments`, {
      params: { limit },
    });
  }

  getProfilePublications(username: string, offset?: number) {
    return this.http.request<unknown>("community", "GET", `/profiles/${username}/publications`, {
      params: { offset },
    });
  }

  getProfileSubscriptionsInfo(username: string) {
    return this.http.request<unknown>("community", "GET", `/profiles/${username}/subscriptions-info`);
  }

  getUserActiveSubscriptions(userId: string) {
    return this.http.request<unknown>("community", "GET", `/users/${userId}/subscriptions/active`);
  }

  updatePresence() {
    return this.http.request<unknown>("community", "POST", "/presence");
  }
}
