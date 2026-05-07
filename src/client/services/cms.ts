import type { HttpClient } from "../http";

export class CmsService {
  constructor(private http: HttpClient) {}

  getNotices() {
    return this.http.request<unknown>("cms", "GET", "/notices");
  }

  getCameraSettings() {
    return this.http.request<unknown>("cms", "GET", "/camera-settings");
  }
}
