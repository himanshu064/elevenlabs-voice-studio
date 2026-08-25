import { NextResponse } from "next/server";
import { getElevenLabsClient, hasApiKey } from "@/lib/elevenlabs";
import type { ApiModel } from "@/lib/types";

export const runtime = "nodejs";
// Models change rarely; cache for 5 minutes.
export const revalidate = 300;

export async function GET() {
  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  try {
    const client = getElevenLabsClient();
    const result = await client.models.list();

    // Only expose models that can actually synthesize speech.
    const models: ApiModel[] = (result ?? [])
      .filter((m) => m.canDoTextToSpeech)
      .map((m) => ({
        modelId: m.modelId,
        name: m.name ?? m.modelId,
        description: m.description ?? "",
        canUseStyle: m.canUseStyle ?? false,
        canUseSpeakerBoost: m.canUseSpeakerBoost ?? false,
        languageCount: m.languages?.length ?? 0,
      }));

    return NextResponse.json({ models });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load models.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
