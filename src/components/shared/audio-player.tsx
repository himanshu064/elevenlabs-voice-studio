"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/format";

type AudioPlayerProps = {
  src: string;
  autoPlay?: boolean;
  downloadName?: string;
};

/**
 * A compact audio player built from shadcn primitives (Button + Slider) and
 * lucide icons - play/pause, seekable progress, elapsed/total time, mute, and
 * download. Autoplays when `src` changes.
 */
export function AudioPlayer({
  src,
  autoPlay = false,
  downloadName = "speech.mp3",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  // Reset + autoplay whenever the clip changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(0);
    setDuration(0);
    if (autoPlay) {
      audio.play().catch(() => {
        /* autoplay may be blocked; controls still work */
      });
    }
  }, [src, autoPlay]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />

      <Button
        type="button"
        size="icon"
        variant="default"
        className="size-9 shrink-0 rounded-full"
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 translate-x-px" />
        )}
      </Button>

      <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatTime(current)}
      </span>

      <Slider
        className="flex-1"
        min={0}
        max={duration || 1}
        step={0.01}
        value={Math.min(current, duration || 0)}
        onValueChange={(v) => seek(Array.isArray(v) ? v[0] : v)}
        aria-label="Seek"
      />

      <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatTime(duration)}
      </span>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8 shrink-0 text-muted-foreground"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        className="size-8 shrink-0 text-muted-foreground"
        render={
          <a href={src} download={downloadName} aria-label="Download audio" />
        }
      >
        <Download className="size-4" />
      </Button>
    </div>
  );
}
