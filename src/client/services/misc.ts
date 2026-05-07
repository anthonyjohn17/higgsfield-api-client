import type { HttpClient } from "../http";

export class MiscService {
  constructor(private http: HttpClient) {}

  getAccess() {
    return this.http.request<unknown>("fnf", "GET", "/access");
  }

  getTours() {
    return this.http.request<unknown>("fnf", "GET", "/tours");
  }

  getPersonaStatus() {
    return this.http.request<unknown>("fnf", "GET", "/persona/status");
  }

  getFreeGenSelector() {
    return this.http.request<unknown>("fnf", "GET", "/free-gen-selector");
  }

  getConcurrentBoostCreditsState() {
    return this.http.request<unknown>("fnf", "GET", "/concurrent-boost-credits/state");
  }

  getReferral() {
    return this.http.request<unknown>("fnf", "GET", "/referral");
  }

  getAutoTopUpSettings() {
    return this.http.request<unknown>("fnf", "GET", "/auto-top-ups/settings");
  }

  getGifts(size = 20, type = "inbound", activated = false) {
    return this.http.request<unknown>("fnf", "GET", "/gifts", {
      params: { size, type, activated },
    });
  }

  getGiftPackages() {
    return this.http.request<unknown>("fnf", "GET", "/gifts/packages");
  }

  getReferenceElements(size = 10, filter = "image") {
    return this.http.request<unknown>("fnf", "GET", "/reference-elements", {
      params: { size, filter },
    });
  }

  getVoiceReferences(size = 33) {
    return this.http.request<unknown>("fnf", "GET", "/reference-elements/voices", {
      params: { size },
    });
  }

  getCustomReferences(size = 30) {
    return this.http.request<unknown>("fnf", "GET", "/custom-references/v2", {
      params: { size },
    });
  }

  getCommunityPublications(size = 20, model?: string) {
    return this.http.request<unknown>("fnf", "GET", "/publications/community/approved", {
      params: { size, model, approved: true },
    });
  }

  getPhotoDumpPacks(version = "v2") {
    return this.http.request<unknown>("fnf", "GET", "/photo-dump/packs", {
      params: { version },
    });
  }

  getSoulPresets(size = 20) {
    return this.http.request<unknown>("fnf", "GET", "/soul-v2/presets", {
      params: { size },
    });
  }

  getSoulCustomPresets(size = 20) {
    return this.http.request<unknown>("fnf", "GET", "/soul-v2/custom-presets", {
      params: { size },
    });
  }

  getNpsFeedback() {
    return this.http.request<unknown>("fnf", "GET", "/feedback/nps");
  }
}
