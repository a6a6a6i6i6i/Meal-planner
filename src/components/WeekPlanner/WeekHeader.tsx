import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalsDialog from "./GoalsDialog";
import { getWeekDates } from "@/lib/weekKeys";
import type { WeekGoals } from "@/types";

interface WeekHeaderProps {
  weekKey: string;
  goals: WeekGoals;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onUpdateGoals: (goals: WeekGoals) => void;
}

function GoalPill({ dotColor, label }: { dotColor: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card text-xs font-semibold text-foreground">
      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      {label}
    </span>
  );
}

export default function WeekHeader({ weekKey, goals, onPrevWeek, onNextWeek, onUpdateGoals }: WeekHeaderProps) {
  const [goalsOpen, setGoalsOpen] = useState(false);
  const dates = getWeekDates(weekKey);
  const monday = dates[0];
  const sunday = dates[6];

  const label = monday.getMonth() === sunday.getMonth()
    ? `${format(monday, "MMM d")}–${format(sunday, "d, yyyy")}`
    : `${format(monday, "MMM d")} – ${format(sunday, "MMM d, yyyy")}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-border mb-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onPrevWeek} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center min-w-[240px]">
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
            {weekKey}
          </div>
          <div className="text-[40px] font-medium tracking-tight leading-none">{label}</div>
        </div>
        <Button variant="outline" size="icon" onClick={onNextWeek} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <GoalPill dotColor="#e8b94a" label={`${goals.calories} kcal`} />
        <GoalPill dotColor="#ff4d8b" label={`${goals.protein}g protein`} />
        <GoalPill dotColor="#a4d4c5" label={`${goals.fat}g fat`} />
        <GoalPill dotColor="#ffb084" label={`${goals.carbs}g carbs`} />
        <Button variant="outline" size="sm" onClick={() => setGoalsOpen(true)}>
          <Settings2 className="h-3.5 w-3.5" />
          Edit goals
        </Button>
      </div>

      <GoalsDialog
        open={goalsOpen}
        onOpenChange={setGoalsOpen}
        goals={goals}
        onSave={onUpdateGoals}
      />
    </div>
  );
}
