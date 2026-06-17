import MacroBar from "./MacroBar";
import type { MacroTotals, WeekGoals } from "@/types";

interface DayTotalsProps {
  totals: MacroTotals;
  goals: WeekGoals;
}

export default function DayTotals({ totals, goals }: DayTotalsProps) {
  const calOver = totals.calories > goals.calories;

  return (
    <div className="mt-1 pt-2 border-t border-border space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Total</span>
        <span className={`text-sm font-bold ${calOver ? "text-destructive" : "text-foreground"}`}>
          {Math.round(totals.calories)}<span className="text-[10px] font-normal text-muted-foreground"> / {goals.calories}</span>
        </span>
      </div>
      <MacroBar label="Protein" actual={totals.protein} target={goals.protein} color="protein" />
      <MacroBar label="Fat"     actual={totals.fat}     target={goals.fat}     color="fat" />
      <MacroBar label="Carbs"   actual={totals.carbs}   target={goals.carbs}   color="carbs" />
    </div>
  );
}
