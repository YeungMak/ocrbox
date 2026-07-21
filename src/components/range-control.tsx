type RangeControlProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export default function RangeControl({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: RangeControlProps) {
  return (
    <label className="space-y-3" htmlFor={id}>
      <span className="flex items-center justify-between text-sm text-zinc-200">
        <span>{label}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-amber-100">
          {value.toFixed(1)}
        </span>
      </span>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-950/80 accent-amber-300"
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}
