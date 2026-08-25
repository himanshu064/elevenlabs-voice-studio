"use client";

import { useEffect, useState } from "react";
import type { Voice } from "@/lib/types";

type UseVoicesResult = {
  voices: Voice[];
  loading: boolean;
  error: string | null;
};

/**
 * Fetches the account's voices from `/api/voices` once on mount.
 * Keeps voice-loading concerns out of the presentational components.
 */
export function useVoices(): UseVoicesResult {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/voices");
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error ?? "Could not load voices.");
          return;
        }
        setVoices(data.voices ?? []);
      } catch {
        if (!cancelled) setError("Could not reach the voices endpoint.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { voices, loading, error };
}
