import { Gauge } from "lucide-react";
import type { VoiceSettings } from "@/lib/types";
import { LabeledSlider } from "@/components/shared/labeled-slider";
import { SectionHeading } from "@/components/shared/section-heading";
import type { VoiceSettingChange } from "@/components/tts/emotion-controls";

/** Pacing control - maps to the `speed` field of `voice_settings`. */
export function PacingControls({
  settings,
  onChange,
}: {
  settings: VoiceSettings;
  onChange: VoiceSettingChange;
}) {
  return (
    <div>
      <SectionHeading
        icon={<Gauge className="size-3.5" />}
        title="Pacing"
        meta="speed"
        className="mb-3"
      />
      <LabeledSlider
        label="Speed"
        hint="0.7 slower … 1.2 faster"
        min={0.7}
        max={1.2}
        step={0.05}
        value={settings.speed}
        onChange={(v) => onChange("speed", v)}
      />
    </div>
  );
}
