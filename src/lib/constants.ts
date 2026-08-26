/**
 * Client-safe constants (no SDK / secret imports). Shared between the UI and
 * the API routes.
 *
 * The four things this demo is built to showcase - voice quality, emotion,
 * pacing, latency - map onto the data defined here.
 */
import type { ModelInfo, Preset, VoiceSettings } from "@/lib/types";

/** LATENCY: the model is the single biggest latency lever in ElevenLabs. */
export const MODELS: ModelInfo[] = [
  {
    id: "eleven_multilingual_v2",
    name: "Multilingual v2",
    blurb: "Highest fidelity, most stable. Best for narration & quality demos.",
    latency: "standard",
    quality: "highest",
  },
  {
    id: "eleven_turbo_v2_5",
    name: "Turbo v2.5",
    blurb: "Balanced - near-flagship quality at much lower latency.",
    latency: "low",
    quality: "high",
  },
  {
    id: "eleven_flash_v2_5",
    name: "Flash v2.5",
    blurb: "Ultra-low latency (~75ms). Best for real-time / conversational.",
    latency: "lowest",
    quality: "good",
  },
  {
    id: "eleven_v3",
    name: "Eleven v3 (expressive)",
    blurb: "Most emotional. Understands inline audio tags like [whispers].",
    latency: "standard",
    quality: "highest",
    expressive: true,
  },
];

export const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

/** A safe, always-available stock voice (Rachel) as the default. */
export const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.0,
  useSpeakerBoost: true,
  speed: 1.0,
};

/** Ready-made prompts that demonstrate emotion & pacing at a click. */
export const PRESETS: Preset[] = [
  {
    label: "Neutral narration",
    description: "Even, professional read - high stability.",
    text: "Welcome to the ElevenLabs voice studio. This demo lets you shape voice quality, emotion, pacing, and latency in real time.",
    settings: { stability: 0.7, style: 0.1, speed: 1.0 },
    modelId: "eleven_multilingual_v2",
  },
  {
    label: "Excited announcement",
    description: "Low stability + high style for energy.",
    text: "Huge news - we just shipped it! I honestly can't wait for you to try this. It is going to change everything!",
    settings: { stability: 0.3, style: 0.6, speed: 1.05 },
    modelId: "eleven_multilingual_v2",
  },
  {
    label: "Calm & soothing",
    description: "High stability, slower pacing.",
    text: "Take a slow, deep breath in... and gently let it go. There is nothing you need to do right now but rest.",
    settings: { stability: 0.85, style: 0.0, speed: 0.85 },
    modelId: "eleven_multilingual_v2",
  },
  {
    label: "Dramatic with pauses",
    description: "Uses <break> tags to control pacing.",
    text: 'She opened the door. <break time="1.2s" /> And there, in the dark, <break time="0.8s" /> was exactly what she feared.',
    settings: { stability: 0.4, style: 0.5, speed: 0.95 },
    modelId: "eleven_multilingual_v2",
  },
  {
    label: "Expressive (v3 audio tags)",
    description: "v3 model with inline emotion tags.",
    text: "[whispers] I have to tell you a secret. [pause] [excited] We won the pitch! [laughs] I can't believe it actually worked!",
    settings: { stability: 0.4, style: 0.4, speed: 1.0 },
    modelId: "eleven_v3",
  },
];

export const OUTPUT_FORMAT = "mp3_44100_128";

/** Hard cap on input length for this demo. */
export const MAX_TEXT_LENGTH = 5000;

/**
 * The `eleven_v3` model id used to interpret inline audio tags. Presets and the
 * audio-tag warning route to this when tags are detected.
 */
export const EXPRESSIVE_MODEL_ID = "eleven_v3";

/**
 * Inline audio tags (e.g. `[laughs]`, `[whispers]`) are an eleven_v3-only
 * feature. Other models read them literally, so we detect them to warn the user
 * when a non-expressive model is selected.
 */
export const AUDIO_TAG_PATTERN =
  /\[(laughs?|laughing|whispers?|whispering|excited|sighs?|sarcastic|curious|crying|shouts?|shouting|angry|nervous|happy|sad|pause|gulps?|snorts?|giggles?|chuckles?|exhales?|clears throat|sings?|singing)\b[^\]]*\]/i;

/** True when the text contains an inline audio tag that only v3 understands. */
export function hasAudioTags(text: string): boolean {
  return AUDIO_TAG_PATTERN.test(text);
}
