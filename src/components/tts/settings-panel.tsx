import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Voice, VoiceSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VoiceSelector } from "@/components/tts/voice-selector";
import {
  EmotionControls,
  type VoiceSettingChange,
} from "@/components/tts/emotion-controls";
import { PacingControls } from "@/components/tts/pacing-controls";

/**
 * The right-hand sidebar: voice picker + emotion + pacing controls, a reset
 * action, and a contextual hint when an expressive (v3) model is selected.
 */
export function SettingsPanel({
  voices,
  voicesLoading,
  voicesError,
  voiceId,
  onVoiceChange,
  settings,
  onSettingChange,
  onReset,
  isExpressiveModel,
}: {
  voices: Voice[];
  voicesLoading: boolean;
  voicesError: string | null;
  voiceId: string;
  onVoiceChange: (voiceId: string) => void;
  settings: VoiceSettings;
  onSettingChange: VoiceSettingChange;
  onReset: () => void;
  isExpressiveModel: boolean;
}) {
  return (
    <Card className="h-fit [--card-spacing:--spacing(6)] lg:sticky lg:top-20">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold tracking-tight">
            Voice &amp; delivery
          </span>
        </div>

        <Separator />

        <VoiceSelector
          voices={voices}
          value={voiceId}
          onChange={onVoiceChange}
          loading={voicesLoading}
          error={voicesError}
        />

        <Separator />

        <EmotionControls settings={settings} onChange={onSettingChange} />

        <Separator />

        <PacingControls settings={settings} onChange={onSettingChange} />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground"
          onClick={onReset}
        >
          <RotateCcw className="size-3.5" /> Reset emotion &amp; pacing
        </Button>

        {isExpressiveModel && (
          <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
            v3 is selected - lean on inline audio tags (e.g.{" "}
            <code className="font-mono">[excited]</code>,{" "}
            <code className="font-mono">[whispers]</code>) for emotion.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
