import type { HttpClient } from "../http";

export type JobSetType =
  | "text2image_soul"
  | "text2image_soul_v2"
  | "soul_cinematic"
  | "text2image"
  | "text2image_gpt"
  | "flux_kontext"
  | "canvas"
  | "canvas_soul"
  | "wan2_2_image"
  | "seedream"
  | "nano_banana"
  | "nano_banana_animal"
  | "keyframes_faceswap"
  | "reve"
  | "nano_banana_2"
  | "nano_banana_flash"
  | "qwen_camera_control"
  | "viral_transform_image"
  | "flux_2"
  | "game_dump"
  | "nano_banana_2_ai_stylist"
  | "ai_influencer"
  | "kling_omni_image"
  | "z_image"
  | "headshot"
  | "outpaint"
  | "seedream_v4_5"
  | "seedream_v5_lite"
  | "nano_banana_2_relight"
  | "nano_banana_2_upscale"
  | "nano_banana_2_shots"
  | "nano_banana_2_zooms"
  | "cinematic_studio_image"
  | "cinematic_studio_2_5"
  | "cinematic_studio_2_5_edit"
  | "cinematic_studio_image_grid"
  | "cinematic_studio_image_3d"
  | "cinematic_studio_image_3d_recomposition"
  | "cinematic_studio_3_0_image_edit"
  | "cinematic_studio_3_0"
  | "cinematic_studio_3_0_beta"
  | "cinematic_studio_video"
  | "cinematic_studio_video_v2"
  | "soul_cast"
  | "soul_location"
  | "soul_cinematic"
  | "soul_cinema_studio"
  | "cinematic_studio_soul_cast"
  | "cinematic_studio_soul_location"
  | "topaz_image"
  | "image_auto"
  | "openai_hazel"
  | "openai_hazel_mini"
  | "character_swap_v2"
  | "nano_banana_2_skin_enhancer"
  | "dubbing_lipsync"
  | "voice_change_merge"
  | "hf_fnf_video"
  | "next_shots"
  | "nano_banana_2_relight";

export class JobService {
  constructor(private http: HttpClient) {}

  getAccessible(jobSetTypes: JobSetType[], size = 20) {
    return this.http.request<unknown>("fnf", "GET", "/jobs/accessible", {
      params: { job_set_type: jobSetTypes, size },
    });
  }
}
