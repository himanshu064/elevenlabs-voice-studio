import { AudioWaveform } from "lucide-react";
import type { Voice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Splits "Bella - Professional, Bright, Warm" into name + descriptor. */
function splitName(name: string): { primary: string; descriptor: string } {
  const [primary, ...rest] = name.split(" - ");
  return { primary: primary ?? name, descriptor: rest.join(" - ") };
}

/** Dropdown of the account's voices, with loading/error fallbacks. */
export function VoiceSelector({
  voices,
  value,
  onChange,
  loading,
  error,
}: {
  voices: Voice[];
  value: string;
  onChange: (voiceId: string) => void;
  loading?: boolean;
  error?: string | null;
}) {
  const selectedName = voices.find((v) => v.voiceId === value)?.name;

  return (
    <div>
      <Label className="mb-2 flex items-center gap-1.5">
        <AudioWaveform className="size-3.5" /> Voice
      </Label>

      {error ? (
        <p className="text-xs text-amber-500">{error}</p>
      ) : (
        <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue>
              {() =>
                selectedName
                  ? splitName(selectedName).primary
                  : loading
                    ? "Loading voices…"
                    : "Select a voice"
              }
            </SelectValue>
          </SelectTrigger>

          {/* Open as a normal dropdown below the trigger, not over it. */}
          <SelectContent
            align="start"
            sideOffset={6}
            alignItemWithTrigger={false}
            className="max-h-72 w-(--anchor-width)"
          >
            {voices.map((voice) => {
              const { primary, descriptor } = splitName(voice.name);
              return (
                <SelectItem
                  key={voice.voiceId}
                  value={voice.voiceId}
                  className="py-2"
                >
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{primary}</span>
                    {descriptor && (
                      <span className="text-muted-foreground"> · {descriptor}</span>
                    )}
                  </span>
                  {voice.category && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 capitalize"
                    >
                      {voice.category}
                    </Badge>
                  )}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
