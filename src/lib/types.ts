/**
 * Shared domain types for the TTS studio.
 *
 * These are framework-agnostic and safe to import from both client components
 * and server route handlers.
 */

/** A single ElevenLabs model, annotated for the UI. */
export type ModelInfo = {
  id: string;
  name: string;
  /** One-line pitch shown in the UI. */
  blurb: string;
  /** Rough latency character, used for the badge. */
  latency: "lowest" | "low" | "standard";
  /** Rough quality character, used for the badge. */
  quality: "highest" | "high" | "good";
  /** Does this model lean on v3 audio tags for emotion? */
  expressive?: boolean;
};

/**
 * A model as returned by our `/api/models` route (a trimmed-down shape of the
 * ElevenLabs `Model`). These are the models the account can actually use.
 */
export type ApiModel = {
  modelId: string;
  name: string;
  description: string;
  canUseStyle: boolean;
  canUseSpeakerBoost: boolean;
  languageCount: number;
};

/**
 * A model as consumed by the UI: curated metadata (badges, blurb) merged with
 * live availability from the account.
 */
export type StudioModel = ModelInfo & {
  /** Is this model actually available on the account right now? */
  available: boolean;
};

/**
 * Maps directly onto ElevenLabs `voice_settings`. Drives the emotion and
 * pacing controls.
 */
export type VoiceSettings = {
  /** Lower = more expressive/variable; higher = more consistent. */
  stability: number;
  /** How closely to match the original voice timbre. */
  similarityBoost: number;
  /** Style exaggeration - pushes emotional delivery. */
  style: number;
  /** Boosts similarity to the speaker at a small latency cost. */
  useSpeakerBoost: boolean;
  /** PACING: 0.7 (slower) … 1.2 (faster). 1.0 = natural. */
  speed: number;
};

/** A ready-made prompt that demonstrates a particular emotion/pacing effect. */
export type Preset = {
  label: string;
  description: string;
  text: string;
  settings: Partial<VoiceSettings>;
  /** Recommended model for the effect. */
  modelId?: string;
};

/** A voice as returned by our `/api/voices` route (a trimmed-down shape). */
export type Voice = {
  voiceId: string;
  name: string;
  category: string;
  previewUrl: string | null;
  labels: Record<string, string>;
};

/** Timing/size stats captured for a single generation. */
export type TtsMetrics = {
  /** Time to first audio byte from the server (ms). */
  ttfbMs: number;
  /** Total time until the stream completed (ms). */
  totalMs: number;
  /** Total audio payload size (bytes). */
  bytes: number;
  /** Character count of the synthesized text. */
  chars: number;
};

/** Request body accepted by the `/api/tts` route. */
export type TtsRequest = {
  text: string;
  voiceId: string;
  modelId: string;
  voiceSettings: VoiceSettings;
};
