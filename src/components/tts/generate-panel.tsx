import { AudioLines, Loader2, Sparkles, Wand2 } from "lucide-react";
import type { TtsMetrics } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/shared/audio-player";
import { MetricsGrid } from "@/components/tts/metrics-grid";

/**
 * Generate action + result surface: a prominent gradient CTA, an inline error,
 * the audio player for the produced clip, the metrics grid, and an elegant
 * empty/loading state so the panel always has presence.
 */
export function GeneratePanel({
  onGenerate,
  disabled,
  loading,
  error,
  audioUrl,
  metrics,
  audioTagWarning = false,
  onSwitchToExpressive,
}: {
  onGenerate: () => void;
  disabled: boolean;
  loading: boolean;
  error: string | null;
  audioUrl: string | null;
  metrics: TtsMetrics | null;
  /** Text contains audio tags but a non-expressive model is selected. */
  audioTagWarning?: boolean;
  onSwitchToExpressive?: () => void;
}) {
  const showPlaceholder = !audioUrl && !error;

  return (
    <div className="flex flex-col gap-4">
      {audioTagWarning && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-600 dark:text-amber-400">
          <Wand2 className="size-3.5 shrink-0" />
          <span className="min-w-0 flex-1">
            Audio tags like{" "}
            <code className="font-mono">[laughs]</code> only work on{" "}
            <span className="font-medium">Eleven v3</span>. The current model
            will read them literally.
          </span>
          {onSwitchToExpressive && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
              onClick={onSwitchToExpressive}
            >
              Switch to v3
            </Button>
          )}
        </div>
      )}

      <Button
        type="button"
        size="lg"
        onClick={onGenerate}
        disabled={disabled || loading}
        className="h-11 w-full bg-linear-to-r from-violet-600 to-sky-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:opacity-90 disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Generating…
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Generate speech
          </>
        )}
      </Button>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
          {error}
        </p>
      )}

      {audioUrl && (
        <div className="flex flex-col gap-3">
          <AudioPlayer src={audioUrl} autoPlay />
          {metrics && <MetricsGrid metrics={metrics} />}
        </div>
      )}

      {showPlaceholder && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/30 py-10 text-center">
          <span
            className={`flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <AudioLines className="size-5" />
          </span>
          <p className="max-w-xs text-xs text-muted-foreground">
            {loading
              ? "Synthesizing your audio…"
              : "Your generated audio and latency metrics will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
