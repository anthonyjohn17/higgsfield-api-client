import type { HttpClient } from "../http";
import type { JobSetType } from "./job";

export interface GenerateOptions {
  prompt: string;
  count?: number;
  aspectRatio?: string;
  imageSize?: string;
}

export class GenerationService {
  constructor(private http: HttpClient) {}

  async generate(jobSetType: JobSetType | string, options: GenerateOptions) {
    const route = jobSetType.replace(/_/g, "-");
    return this.http.request<unknown>("fnf", "POST", `/jobs/${route}`, {
      body: {
        prompt: options.prompt,
        count: options.count ?? 1,
        aspect_ratio: options.aspectRatio ?? "3:4",
        image_size: options.imageSize ?? "1k",
      },
    });
  }

  async getJobStatus(jobId: string) {
    return this.http.request<unknown>("fnf", "GET", `/jobs/${jobId}/status`);
  }

  async getJob(jobId: string) {
    return this.http.request<unknown>("fnf", "GET", `/jobs/${jobId}`);
  }

  async waitForCompletion(jobId: string, pollIntervalMs = 3000, maxAttempts = 60): Promise<unknown> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = (await this.getJobStatus(jobId)) as Record<string, unknown>;
      const state = (status.status ?? status.state ?? "") as string;
      if (state === "completed" || state === "done" || state === "success") {
        return this.getJob(jobId);
      }
      if (state === "failed" || state === "error") {
        throw new Error(`Job ${jobId} failed: ${JSON.stringify(status)}`);
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
    throw new Error(`Job ${jobId} timed out after ${maxAttempts} attempts`);
  }
}
