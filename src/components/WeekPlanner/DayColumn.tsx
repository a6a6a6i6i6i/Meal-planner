import { useState } from "react";
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
  colIndex: number;
  onUpdateSlot: (slot: SlotKey, entry: MealEntry | null) => void;
}

export default function DayColumn({ date, dayPlan, goals, meals, colIndex, onUpdateSlot }: DayColumnProps) {
  const totals = calculateDayTotals(dayPlan, meals);
  const swap = findBestSwap(dayPlan, meals, goals);
  const [swapFlashed, setSwapFlashed] = useState(false);

  const isToday = format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

  function handleSwapAccept() {
    if (!swap) return;
    const currentEntry = dayPlan[swap.slot];
    if (!currentEntry) return;
    onUpdateSlot(swap.slot, { mealId: swap.suggestMealId, servings: swap.servings });
    setSwapFlashed(true);
    setTimeout(() => setSwapFlashed(false), 600);
  }

  return (
    <div
      className={`day-col-enter min-w-[150px] flex flex-col gap-3 p-4 rounded-2xl border ${
        isToday
          ? `today-col-pulse border-brand-peach/60 border-t-[3px] border-t-brand-ochre bg-brand-peach/10`
          : "border-border bg-background"
      } ${swapFlashed ? "swap-col-flash" : ""}`}
      style={{ ["--col-i" as string]: colIndex }}
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
            colIndex={colIndex}
            onUpdate={(entry) => onUpdateSlot(slot, entry)}
          />
        ))}
      </div>

      <DayTotals totals={totals} goals={goals} colIndex={colIndex} />

      <SwapSuggestion
        suggestion={swap}
        meals={meals}
        onAccept={handleSwapAccept}
      />
    </div>
  );
}
