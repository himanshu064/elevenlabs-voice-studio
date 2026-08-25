import { NextResponse } from "next/server";
import { getElevenLabsClient, hasApiKey } from "@/lib/elevenlabs";

export const runtime = "nodejs";
// Voices rarely change; cache for a minute to keep the dropdown snappy.
export const revalidate = 60;

export async function GET() {
  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  try {
    const client = getElevenLabsClient();
    const result = await client.voices.search();

    const voices = (result.voices ?? []).map((v) => ({
      voiceId: v.voiceId,
      name: v.name ?? "Unnamed",
      category: v.category ?? "generated",
      previewUrl: v.previewUrl ?? null,
      labels: v.labels ?? {},
    }));

    return NextResponse.json({ voices });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load voices.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
