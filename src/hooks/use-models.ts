"use client";

import { useEffect, useState } from "react";
import type { ApiModel, StudioModel } from "@/lib/types";
import { mergeModels } from "@/lib/models";

type UseModelsResult = {
  models: StudioModel[];
  loading: boolean;
  error: string | null;
};

/**
 * Fetches the account's live models from `/api/models` and merges them with the
 * curated metadata. On failure it falls back to the curated list (all treated
 * as available) so the studio stays usable.
 */
export function useModels(): UseModelsResult {
  const [models, setModels] = useState<StudioModel[]>(() => mergeModels([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/models");
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error ?? "Could not load models.");
          return; // keep the curated fallback
        }
        setModels(mergeModels((data.models ?? []) as ApiModel[]));
      } catch {
        if (!cancelled) setError("Could not reach the models endpoint.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { models, loading, error };
}
