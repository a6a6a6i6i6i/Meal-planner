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
    <div
      className={`min-w-[150px] flex flex-col gap-2 p-3 rounded-2xl border ${
        isToday
          ? "border-brand-peach/60 border-t-[3px] border-t-brand-ochre bg-brand-peach/10"
          : "border-border bg-background"
      }`}
    >
      <div className="text-center pb-2 border-b border-border">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-1">
          {format(date, "EEE")}
        </div>
        {isToday ? (
          <div className="h-8 w-8 rounded-full bg-brand-ochre flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-white">{format(date, "d")}</span>
          </div>
        ) : (
          <div className="text-base font-semibold text-foreground">{format(date, "d")}</div>
        )}
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
