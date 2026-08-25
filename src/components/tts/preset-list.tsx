import { PRESETS } from "@/lib/constants";
import type { Preset } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * Chips that load a ready-made prompt + voice settings demonstrating a
 * particular emotion/pacing effect.
 */
export function PresetList({
  onSelect,
}: {
  onSelect: (preset: Preset) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Presets</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={() => onSelect(preset)}
            title={preset.description}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
