import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WeekHeader from "./WeekHeader";
import DayColumn from "./DayColumn";
import { getWeekDates, formatDayKey } from "@/lib/weekKeys";
import { SLOT_KEYS } from "@/types";
import type { Meal, MealEntry, SlotKey, WeekPlan, WeekGoals } from "@/types";

const NUDGE_KEY = "meal-planner-week-nudge-dismissed";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(
    () => localStorage.getItem(NUDGE_KEY) === "1"
  );

  const emptyDay = { breakfast: null, lunch: null, snack: null, dinner: null };

  const isWeekEmpty = dates.every((date) => {
    const day = weekPlan.days[formatDayKey(date)];
    return !day || SLOT_KEYS.every((slot) => day[slot] === null);
  });

  // Scroll today's column into view on mobile when week changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth + 1) return;
    const todayEl = container.querySelector('[data-today="true"]') as HTMLElement | null;
    if (todayEl) {
      container.scrollLeft = todayEl.offsetLeft - container.offsetLeft;
    }
  }, [weekKey]);

  function dismissNudge() {
    localStorage.setItem(NUDGE_KEY, "1");
    setNudgeDismissed(true);
  }

  const showNudge = meals.length > 0 && isWeekEmpty && !nudgeDismissed;

  if (meals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <WeekHeader
          weekKey={weekKey}
          goals={weekPlan.goals}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
          onUpdateGoals={onUpdateGoals}
        />
        <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-4">
          <div className="text-5xl mb-6 select-none" aria-hidden>📋</div>
          <h2
            className="text-2xl font-[500] tracking-[-0.02em] leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)', fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            Build your meal library first
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs text-pretty leading-relaxed mb-8">
            Add your go-to meals once, then slot them into any week in seconds. Planning a full week takes under 2 minutes.
          </p>
          <Button asChild>
            <Link to="/library">
              <BookOpen className="h-4 w-4" />
              Go to Meal Library
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4 opacity-70">Takes about 2 minutes to add your regulars</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <WeekHeader
        weekKey={weekKey}
        goals={weekPlan.goals}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onUpdateGoals={onUpdateGoals}
      />

      {showNudge && (
        <div className="flex items-center gap-3 mb-5 rounded-xl bg-surface-soft border border-border px-4 py-3 text-sm text-foreground">
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
          <span className="text-pretty">Select any slot below to start filling your week</span>
          <button
            onClick={dismissNudge}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors duration-100 p-0.5"
            aria-label="Dismiss tip"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        key={weekKey}
        className={`
          flex overflow-x-auto snap-x snap-mandatory pb-6 gap-3 sm:gap-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        `}
      >
        {dates.map((date, i) => {
          const dayKey = formatDayKey(date);
          const dayPlan = weekPlan.days[dayKey] ?? emptyDay;
          return (
            <DayColumn
              key={dayKey}
              date={date}
              dayPlan={dayPlan}
              goals={weekPlan.goals}
              meals={meals}
              colIndex={i}
              onUpdateSlot={(slot, entry) => onUpdateDaySlot(dayKey, slot, entry)}
            />
          );
        })}
      </div>
    </div>
  );
}
