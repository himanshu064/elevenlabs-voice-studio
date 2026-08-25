import { Sparkles } from "lucide-react";
import type { VoiceSettings } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LabeledSlider } from "@/components/shared/labeled-slider";
import { SectionHeading } from "@/components/shared/section-heading";

export type VoiceSettingChange = <K extends keyof VoiceSettings>(
  key: K,
  value: VoiceSettings[K]
) => void;

/** Emotion controls mapped to ElevenLabs `voice_settings`. */
export function EmotionControls({
  settings,
  onChange,
}: {
  settings: VoiceSettings;
  onChange: VoiceSettingChange;
}) {
  return (
    <div>
      <SectionHeading
        icon={<Sparkles className="size-3.5" />}
        title="Emotion"
        meta="voice_settings"
        className="mb-3"
      />

      <LabeledSlider
        label="Stability"
        hint="Lower = more expressive / variable"
        min={0}
        max={1}
        step={0.05}
        value={settings.stability}
        onChange={(v) => onChange("stability", v)}
      />
      <LabeledSlider
        label="Similarity"
        hint="Fidelity to the original voice"
        min={0}
        max={1}
        step={0.05}
        value={settings.similarityBoost}
        onChange={(v) => onChange("similarityBoost", v)}
      />
      <LabeledSlider
        label="Style"
        hint="Emotional exaggeration"
        min={0}
        max={1}
        step={0.05}
        value={settings.style}
        onChange={(v) => onChange("style", v)}
      />

      <div className="mt-1 flex items-center gap-2">
        <Switch
          id="speaker-boost"
          checked={settings.useSpeakerBoost}
          onCheckedChange={(c: boolean) => onChange("useSpeakerBoost", c)}
        />
        <Label htmlFor="speaker-boost" className="text-xs font-normal">
          Speaker boost
        </Label>
      </div>
    </div>
  );
}
