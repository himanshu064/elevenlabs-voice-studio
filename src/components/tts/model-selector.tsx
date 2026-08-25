import { Check } from "lucide-react";
import type { StudioModel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * Full-width grid of selectable model cards, driven by the account's live model
 * list merged with curated metadata. Cards are uniform height with clamped
 * blurbs; the selected card gets a branded ring + check. Models the account
 * can't use are disabled with an "unavailable" badge.
 */
export function ModelSelector({
  models,
  value,
  onChange,
  loading = false,
}: {
  models: StudioModel[];
  value: string;
  onChange: (modelId: string) => void;
  loading?: boolean;
}) {
  return (
    <section>
      <SectionHeading
        title="Model"
        meta={loading ? "checking availability…" : "latency vs quality"}
        className="mb-3"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {models.map((model) => {
          const selected = value === model.id;
          const disabled = !model.available;
          return (
            <button
              key={model.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(model.id)}
              aria-pressed={selected}
              title={disabled ? "Not available on this account" : undefined}
              className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-4 text-left transition ${
                disabled
                  ? "cursor-not-allowed border-border/60 opacity-50"
                  : selected
                    ? "border-violet-500/60 bg-accent/60 ring-2 ring-violet-500/40"
                    : "border-border/60 bg-card hover:border-border hover:bg-accent/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold tracking-tight">
                  {model.name}
                </span>
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full transition ${
                    selected
                      ? "bg-linear-to-br from-violet-500 to-sky-500 text-white"
                      : "border border-border/70 text-transparent"
                  }`}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {disabled ? (
                  <Badge variant="destructive">unavailable</Badge>
                ) : (
                  <>
                    <Badge variant="latency">{model.latency} latency</Badge>
                    <Badge variant="quality">{model.quality}</Badge>
                  </>
                )}
              </div>

              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {model.blurb}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
