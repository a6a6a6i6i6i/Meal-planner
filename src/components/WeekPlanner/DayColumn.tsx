import { format } from "date-fns";
import MealSlot from "./MealSlot";
import DayTotals from "./DayTotals";
import SwapSuggestion from "./SwapSuggestion";
import { calculateDayTotals, findBestSwap } from "@/lib/planner";
import { SLOT_KEYS } from "@/types";
import type { DayPlan, Meal, MealEntry, SlotKey, WeekGoals } from "@/types";

interface DayColumnProps {
  date: Date;
  dayPlan: DayPlan;
  goals: WeekGoals;
  meals: Meal[];
  onUpdateSlot: (slot: SlotKey, entry: MealEntry | null) => void;
}

export default function DayColumn({ date, dayPlan, goals, meals, onUpdateSlot }: DayColumnProps) {
  const totals = calculateDayTotals(dayPlan, meals);
  const swap = findBestSwap(dayPlan, meals, goals);

  const isToday = format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

  return (
    <div className={`min-w-[150px] flex flex-col gap-2 p-2 rounded-lg border ${isToday ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="text-center pb-1 border-b">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{format(date, "EEE")}</div>
        <div className={`text-sm font-semibold ${isToday ? "text-primary" : ""}`}>{format(date, "d")}</div>
      </div>

      <div className="space-y-3 flex-1">
        {SLOT_KEYS.map((slot) => (
          <MealSlot
            key={slot}
            slot={slot}
            entry={dayPlan[slot]}
            meals={meals}
            onUpdate={(entry) => onUpdateSlot(slot, entry)}
          />
        ))}
      </div>

      <DayTotals totals={totals} goals={goals} />

      <SwapSuggestion
        suggestion={swap}
        meals={meals}
        onAccept={() => {
          if (!swap) return;
          const currentEntry = dayPlan[swap.slot];
          if (!currentEntry) return;
          onUpdateSlot(swap.slot, { mealId: swap.suggestMealId, servings: swap.servings });
        }}
      />
    </div>
  );
}
