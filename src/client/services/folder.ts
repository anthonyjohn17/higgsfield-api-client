import type { HttpClient } from "../http";

export class FolderService {
  constructor(private http: HttpClient) {}

  list(size = 20, accessMode?: string, workspaceId?: string) {
    return this.http.request<unknown>("fnf", "GET", "/folders", {
      params: { size, access_mode: accessMode, workspace_id: workspaceId },
    });
  }

  getPinned() {
    return this.http.request<unknown>("fnf", "GET", "/folders/pinned");
  }

  getAccessible(size = 20, onlyUnpinned = true) {
    return this.http.request<unknown>("fnf", "GET", "/folders/accessible", {
      params: { size, only_unpinned: onlyUnpinned },
    });
  }
}
