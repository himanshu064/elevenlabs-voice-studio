"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TtsMetrics, TtsRequest } from "@/lib/types";

type UseTtsResult = {
  generate: (request: TtsRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  audioUrl: string | null;
  metrics: TtsMetrics | null;
};

/**
 * Owns a single text-to-speech generation: POSTs to `/api/tts`, reads the
 * streamed audio while timing the first byte (TTFB) and total duration, and
 * exposes the resulting object URL + metrics. Revokes stale object URLs to
 * avoid memory leaks.
 */
export function useTts(): UseTtsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<TtsMetrics | null>(null);

  // Track the current object URL so we can revoke it on replace/unmount.
  const objectUrlRef = useRef<string | null>(null);

  const setClip = useCallback((url: string | null) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = url;
    setAudioUrl(url);
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const generate = useCallback(
    async (request: TtsRequest) => {
      setError(null);
      setMetrics(null);
      setLoading(true);
      setClip(null);

      const startedAt = performance.now();
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!res.ok || !res.body) {
          throw new Error(await readError(res));
        }

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let ttfbMs = 0;
        let bytes = 0;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            if (ttfbMs === 0) ttfbMs = performance.now() - startedAt;
            chunks.push(value);
            bytes += value.byteLength;
          }
        }

        const totalMs = performance.now() - startedAt;
        const blob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
        setClip(URL.createObjectURL(blob));
        setMetrics({ ttfbMs, totalMs, bytes, chars: request.text.length });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [setClip]
  );

  return { generate, loading, error, audioUrl, metrics };
}

/** Best-effort extraction of a server error message. */
async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.error) return data.error as string;
  } catch {
    /* non-JSON error body */
  }
  return `Request failed (${res.status}).`;
}
