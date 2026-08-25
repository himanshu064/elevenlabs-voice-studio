import type { ReactNode } from "react";

/**
 * A small section title with an optional leading icon and a muted "meta"
 * suffix, e.g. `✨ Emotion · voice_settings`.
 */
export function SectionHeading({
  icon,
  title,
  meta,
  className,
}: {
  icon?: ReactNode;
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-1.5 text-sm font-medium ${className ?? ""}`}
    >
      {icon}
      {title}
      {meta && <span className="text-muted-foreground">· {meta}</span>}
    </p>
  );
}
