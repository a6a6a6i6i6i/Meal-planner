import MacroBar from "./MacroBar";
import type { MacroTotals, WeekGoals } from "@/types";

interface DayTotalsProps {
  totals: MacroTotals;
  goals: WeekGoals;
}

export default function DayTotals({ totals, goals }: DayTotalsProps) {
  const calOver = totals.calories > goals.calories;

  return (
    <div className="mt-2 pt-2 border-t space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span>Total</span>
        <span className={calOver ? "text-destructive" : "text-foreground"}>
          {Math.round(totals.calories)} / {goals.calories} kcal
        </span>
      </div>
      <MacroBar label="Protein" actual={totals.protein} target={goals.protein} color="blue" />
      <MacroBar label="Fat" actual={totals.fat} target={goals.fat} color="red" />
      <MacroBar label="Carbs" actual={totals.carbs} target={goals.carbs} color="yellow" />
    </div>
  );
}
