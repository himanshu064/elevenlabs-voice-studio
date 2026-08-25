import type { ReactNode } from "react";

/**
 * A compact metric tile: small icon + label on top, large value beneath.
 * `highlight` draws attention to the hero stat (used for latency/TTFB).
 */
export function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-border/60 bg-muted/30"
      }`}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span className={highlight ? "text-emerald-500" : ""}>{icon}</span>
        {label}
      </p>
      <p
        className={`mt-1.5 text-xl font-semibold tracking-tight tabular-nums ${
          highlight ? "text-emerald-500 dark:text-emerald-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
