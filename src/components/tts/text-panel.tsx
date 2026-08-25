"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PAUSE_TAG = ' <break time="1.0s" /> ';

/**
 * The main text input: label + live character count, the textarea, an
 * "Insert pause" helper that injects a <break> tag at the cursor, and a
 * syntax tip for pacing/emotion tags.
 */
export function TextPanel({
  value,
  onChange,
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  function insertPause() {
    const el = textRef.current;
    if (!el) {
      onChange(value + PAUSE_TAG);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + PAUSE_TAG + value.slice(end));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor="tts-text">Text to speak</Label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length} / {maxLength}
        </span>
      </div>

      <Textarea
        id="tts-text"
        ref={textRef}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="resize-y text-sm leading-relaxed"
        placeholder="Type something to synthesize…"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertPause}
          title="Insert a pause tag at the cursor (pacing control)"
        >
          <Plus className="size-3.5" /> Insert pause
        </Button>
        <span className="text-xs text-muted-foreground">
          Tip: use{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">
            &lt;break time=&quot;1.0s&quot; /&gt;
          </code>{" "}
          for pacing, and v3 tags like{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">
            [whispers]
          </code>
          .
        </span>
      </div>
    </div>
  );
}
