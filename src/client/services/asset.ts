import type { HttpClient } from "../http";

export type AssetCategory = "all" | "image" | "video" | "upscale" | "lipsync";

export class AssetService {
  constructor(private http: HttpClient) {}

  list(size = 20, category: AssetCategory = "all") {
    return this.http.request<unknown>("fnf", "GET", "/assets", {
      params: { size, category },
    });
  }

  getFavourites(size = 1001) {
    return this.http.request<unknown>("fnf", "GET", "/assets/favourites", {
      params: { size },
    });
  }

  getLikedBy(jobIds: string[]) {
    return this.http.request<unknown>("fnf", "GET", "/assets/liked-by", {
      params: { job_id: jobIds },
    });
  }
}
