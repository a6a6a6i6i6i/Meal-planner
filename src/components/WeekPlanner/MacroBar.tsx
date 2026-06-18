interface MacroBarProps {
  label: string;
  actual: number;
  target: number;
  color: "protein" | "fat" | "carbs";
  colIndex?: number;
}

const colorMap: Record<"protein" | "fat" | "carbs", string> = {
  protein: "bg-brand-pink",
  fat:     "bg-brand-mint",
  carbs:   "bg-brand-ochre",
};

export default function MacroBar({ label, actual, target, color, colIndex = 0 }: MacroBarProps) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
  const over = target > 0 && actual > target;

  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className={over ? "text-destructive font-medium" : ""}>
          {Math.round(actual)}g / {target}g
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-surface-card overflow-hidden"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(actual)}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div
          className={`macro-bar-fill h-full rounded-full transition-[width] duration-500 ${over ? "bg-destructive" : colorMap[color]} ${pct >= 100 && !over ? "macro-bar-complete" : ""}`}
          style={{
            width: `${pct}%`,
            ["--col-i" as string]: colIndex,
          }}
        />
      </div>
    </div>
  );
}
