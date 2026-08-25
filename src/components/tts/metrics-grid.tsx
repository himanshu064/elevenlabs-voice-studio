import { Clock, FileAudio, Hash, Timer } from "lucide-react";
import type { TtsMetrics } from "@/lib/types";
import { formatBytes, formatSeconds } from "@/lib/format";
import { StatCard } from "@/components/shared/stat-card";

/** Timing/size stats for the last generation. TTFB (latency) is highlighted. */
export function MetricsGrid({ metrics }: { metrics: TtsMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatCard
        icon={<Timer className="size-3.5" />}
        label="Time to first audio"
        value={`${Math.round(metrics.ttfbMs)} ms`}
        highlight
      />
      <StatCard
        icon={<Clock className="size-3.5" />}
        label="Total time"
        value={formatSeconds(metrics.totalMs)}
      />
      <StatCard
        icon={<FileAudio className="size-3.5" />}
        label="Audio size"
        value={formatBytes(metrics.bytes)}
      />
      <StatCard
        icon={<Hash className="size-3.5" />}
        label="Characters"
        value={`${metrics.chars}`}
      />
    </div>
  );
}
