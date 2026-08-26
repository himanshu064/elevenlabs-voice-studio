import { NextRequest, NextResponse } from "next/server";
import { getElevenLabsClient, hasApiKey } from "@/lib/elevenlabs";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_VOICE_ID,
  DEFAULT_VOICE_SETTINGS,
  MAX_TEXT_LENGTH,
  OUTPUT_FORMAT,
} from "@/lib/constants";
import type { VoiceSettings } from "@/lib/types";

// Streaming audio needs the Node.js runtime, not Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TtsBody = {
  text?: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: Partial<VoiceSettings>;
};

export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not set on the server. See README." },
      { status: 500 },
    );
  }

  let body: TtsBody;
  try {
    body = (await req.json()) as TtsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json(
      { error: "Please enter some text to synthesize." },
      { status: 400 },
    );
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      {
        error: `Text is too long for this demo (max ${MAX_TEXT_LENGTH} characters).`,
      },
      { status: 400 },
    );
  }

  const voiceId = body.voiceId || DEFAULT_VOICE_ID;
  const modelId = body.modelId || DEFAULT_MODEL_ID;
  const settings = { ...DEFAULT_VOICE_SETTINGS, ...body.voiceSettings };

  // Force text normalization so numbers, dates, and currency are spoken
  // correctly ("1234" -> "twelve thirty-four", "$50" -> "fifty dollars").
  // On the streaming endpoint the default 'auto' mode often skips this to save
  // latency, which is why raw digits get mispronounced. v3 doesn't accept 'on'
  // (only 'auto'/'off'), so fall back to 'auto' for it.
  const applyTextNormalization = modelId.includes("v3") ? "auto" : "on";

  try {
    const client = getElevenLabsClient();

    // Use the streaming endpoint so audio starts arriving as it's generated -
    // this is what makes the "time to first audio" latency metric meaningful.
    const audioStream = await client.textToSpeech.stream(voiceId, {
      text,
      modelId,
      outputFormat: OUTPUT_FORMAT,
      applyTextNormalization,
      voiceSettings: {
        stability: settings.stability,
        similarityBoost: settings.similarityBoost,
        style: settings.style,
        useSpeakerBoost: settings.useSpeakerBoost,
        speed: settings.speed,
      },
    });

    return new Response(audioStream as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Speech generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
