import "server-only";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * Server-side ElevenLabs client. The API key is read from the environment and
 * NEVER exposed to the browser - every ElevenLabs call goes through a Route
 * Handler, not the client.
 */
export function getElevenLabsClient(): ElevenLabsClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Add it to .env.local (see README)."
    );
  }
  return new ElevenLabsClient({ apiKey });
}

export function hasApiKey(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY);
}
