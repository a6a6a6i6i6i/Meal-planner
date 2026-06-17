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
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-muted-foreground">Total</span>
        <span className={calOver ? "text-destructive" : "text-foreground"}>
          {Math.round(totals.calories)} / {goals.calories} kcal
        </span>
      </div>
      <MacroBar label="Protein" actual={totals.protein} target={goals.protein} color="protein" />
      <MacroBar label="Fat"     actual={totals.fat}     target={goals.fat}     color="fat" />
      <MacroBar label="Carbs"   actual={totals.carbs}   target={goals.carbs}   color="carbs" />
    </div>
  );
}
