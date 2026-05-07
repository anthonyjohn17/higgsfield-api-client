import type { HttpClient } from "../http";

export class UserService {
  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.request<unknown>("fnf", "GET", "/user");
  }

  getMeta() {
    return this.http.request<unknown>("fnf", "GET", "/user/meta");
  }

  getProfile() {
    return this.http.request<unknown>("fnf", "GET", "/user/profile");
  }

  getSettings() {
    return this.http.request<unknown>("fnf", "GET", "/user/settings");
  }

  getPersonalPromo() {
    return this.http.request<unknown>("fnf", "GET", "/user/personal-promo");
  }

  getFreeGens() {
    return this.http.request<unknown>("fnf", "GET", "/user/free-gens/v2");
  }

  getPublications(username: string, limit = 50) {
    return this.http.request<unknown>("fnf", "GET", `/user/${username}/v2/publications`, {
      params: { limit },
    });
  }
}
