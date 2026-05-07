import type { HttpClient } from "../http";

export class SubscriptionService {
  constructor(private http: HttpClient) {}

  getPlans(planVariant?: string) {
    return this.http.request<unknown>("fnf", "GET", "/subscriptions/plans", {
      params: { plan_variant: planVariant },
    });
  }

  compare(planVariant?: string) {
    return this.http.request<unknown>("fnf", "GET", "/subscriptions/compare", {
      params: { plan_variant: planVariant },
    });
  }

  change(body: unknown) {
    return this.http.request<unknown>("fnf", "POST", "/subscriptions/change", { body });
  }
}
