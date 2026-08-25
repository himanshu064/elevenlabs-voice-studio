import { MODELS } from "@/lib/constants";
import type { ApiModel, ModelInfo, StudioModel } from "@/lib/types";

/**
 * Derives display metadata for a live model that isn't in our curated list, so
 * account-specific / newly-released models still render sensibly.
 */
function deriveMeta(model: ApiModel): ModelInfo {
  return {
    id: model.modelId,
    name: model.name || model.modelId,
    blurb: model.description || "Additional model available on your account.",
    latency: "standard",
    quality: "good",
    expressive: false,
  };
}

/**
 * Merges the curated model metadata (badges, blurbs) with the live list from
 * the account:
 *  - curated models are annotated with real `available` status,
 *  - any live model we don't have curated copy for is appended,
 *  - order keeps curated models first, extras after.
 *
 * When `live` is empty (e.g. the models endpoint failed), curated models are
 * treated as available so the demo stays usable.
 */
export function mergeModels(live: ApiModel[]): StudioModel[] {
  const liveById = new Map(live.map((m) => [m.modelId, m]));
  const hasLive = live.length > 0;

  const curated: StudioModel[] = MODELS.map((meta) => ({
    ...meta,
    available: hasLive ? liveById.has(meta.id) : true,
  }));

  const curatedIds = new Set(MODELS.map((m) => m.id));
  const extras: StudioModel[] = live
    .filter((m) => !curatedIds.has(m.modelId))
    .map((m) => ({ ...deriveMeta(m), available: true }));

  return [...curated, ...extras];
}
