import type { HttpClient } from "../http";

export class WorkspaceService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces");
  }

  listAccessible() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/accessible");
  }

  getDetails() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/details");
  }

  getNotice() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/notice");
  }

  getWallet() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/wallet");
  }

  getSettings() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/settings");
  }

  getUnlimActivations() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/unlim-activations");
  }

  getSubscription() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/subscription");
  }

  getPlans() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/plans");
  }

  comparePlans() {
    return this.http.request<unknown>("fnf", "GET", "/workspaces/plans/compare");
  }

  setContext(body: unknown) {
    return this.http.request<unknown>("fnf", "POST", "/workspaces/context", { body });
  }
}
