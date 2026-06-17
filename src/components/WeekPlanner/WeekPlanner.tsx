import WeekHeader from "./WeekHeader";
import DayColumn from "./DayColumn";
import { getWeekDates, formatDayKey } from "@/lib/weekKeys";
import { SLOT_KEYS } from "@/types";
import type { Meal, MealEntry, SlotKey, WeekPlan, WeekGoals } from "@/types";

interface WeekPlannerProps {
  weekKey: string;
  weekPlan: WeekPlan;
  meals: Meal[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onUpdateDaySlot: (dayKey: string, slot: SlotKey, entry: MealEntry | null) => void;
  onUpdateGoals: (goals: WeekGoals) => void;
}

export default function WeekPlanner({
  weekKey,
  weekPlan,
  meals,
  onPrevWeek,
  onNextWeek,
  onUpdateDaySlot,
  onUpdateGoals,
}: WeekPlannerProps) {
  const dates = getWeekDates(weekKey);

  const emptyDay = { breakfast: null, lunch: null, dinner: null };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <WeekHeader
        weekKey={weekKey}
        goals={weekPlan.goals}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onUpdateGoals={onUpdateGoals}
      />

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-7 gap-3 min-w-[1100px]">
          {dates.map((date) => {
            const dayKey = formatDayKey(date);
            const dayPlan = weekPlan.days[dayKey] ?? emptyDay;
            return (
              <DayColumn
                key={dayKey}
                date={date}
                dayPlan={dayPlan}
                goals={weekPlan.goals}
                meals={meals}
                onUpdateSlot={(slot, entry) => onUpdateDaySlot(dayKey, slot, entry)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
