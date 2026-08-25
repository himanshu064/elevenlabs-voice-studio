/** Formatting helpers shared across the UI. */

/** Seconds → `m:ss` (e.g. 75 → "1:15"). */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/** Bytes → a compact KB/MB string. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Milliseconds → seconds string with 2 decimals (e.g. 1560 → "1.56 s"). */
export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)} s`;
}
