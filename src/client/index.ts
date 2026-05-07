import type { HiggsFieldConfig } from "../types/index";
import { HttpClient } from "./http";
import { AssetService } from "./services/asset";
import { ClerkService } from "./services/clerk";
import { CmsService } from "./services/cms";
import { CommunityService } from "./services/community";
import { FolderService } from "./services/folder";
import { GenerationService } from "./services/generation";
import { JobService } from "./services/job";
import { MiscService } from "./services/misc";
import { NotificationService } from "./services/notification";
import { ScoreService } from "./services/score";
import { SubscriptionService } from "./services/subscription";
import { UserService } from "./services/user";
import { WorkspaceService } from "./services/workspace";

export class HiggsFieldClient {
  public readonly user: UserService;
  public readonly workspace: WorkspaceService;
  public readonly subscription: SubscriptionService;
  public readonly asset: AssetService;
  public readonly job: JobService;
  public readonly folder: FolderService;
  public readonly community: CommunityService;
  public readonly notification: NotificationService;
  public readonly cms: CmsService;
  public readonly clerk: ClerkService;
  public readonly score: ScoreService;
  public readonly misc: MiscService;
  public readonly generation: GenerationService;

  constructor(config: HiggsFieldConfig) {
    const http = new HttpClient(config);

    this.user = new UserService(http);
    this.workspace = new WorkspaceService(http);
    this.subscription = new SubscriptionService(http);
    this.asset = new AssetService(http);
    this.job = new JobService(http);
    this.folder = new FolderService(http);
    this.community = new CommunityService(http);
    this.notification = new NotificationService(http);
    this.cms = new CmsService(http);
    this.clerk = new ClerkService(http);
    this.score = new ScoreService(http);
    this.misc = new MiscService(http);
    this.generation = new GenerationService(http);
  }
}

export type { ClerkSessionConfig, HiggsFieldConfig, RequestOptions } from "../types/index";
export { HiggsFieldError } from "../types/index";
export { HttpClient } from "./http";
export type { AssetCategory } from "./services/asset";
export type { JobSetType } from "./services/job";
