import { Slider } from "@/components/ui/slider";

/**
 * A labeled range control: title + live value on one row, the slider beneath,
 * and a hint line under it. Wraps the shadcn Slider and normalises its
 * array/number value into a single number.
 */
export function LabeledSlider({
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value.toFixed(2)}
        </span>
      </div>
      <Slider
        className="mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        aria-label={label}
      />
      {hint && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
