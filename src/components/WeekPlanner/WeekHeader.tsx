import { useState, useEffect, useRef } from "react";
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

function GoalPill({
  dotColor,
  label,
  pillIndex,
  animating,
}: {
  dotColor: string;
  label: string;
  pillIndex: number;
  animating: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card text-xs font-semibold text-foreground ${animating ? "goal-pill-pop" : ""}`}
      style={{ ["--pill-i" as string]: pillIndex }}
    >
      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      {label}
    </span>
  );
}

export default function WeekHeader({ weekKey, goals, onPrevWeek, onNextWeek, onUpdateGoals }: WeekHeaderProps) {
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [pillsAnimating, setPillsAnimating] = useState(false);
  const prevGoals = useRef(JSON.stringify(goals));

  useEffect(() => {
    const current = JSON.stringify(goals);
    if (prevGoals.current !== current) {
      prevGoals.current = current;
      setPillsAnimating(true);
      const t = setTimeout(() => setPillsAnimating(false), 700);
      return () => clearTimeout(t);
    }
  }, [goals]);

  const dates = getWeekDates(weekKey);
  const monday = dates[0];
  const sunday = dates[6];

  const label = monday.getMonth() === sunday.getMonth()
    ? `${format(monday, "MMM d")}–${format(sunday, "d, yyyy")}`
    : `${format(monday, "MMM d")} – ${format(sunday, "MMM d, yyyy")}`;

  const pills = [
    { dotColor: "#e8b94a", label: `${goals.calories} kcal` },
    { dotColor: "#ff4d8b", label: `${goals.protein}g protein` },
    { dotColor: "#a4d4c5", label: `${goals.fat}g fat`     },
    { dotColor: "#ffb084", label: `${goals.carbs}g carbs`  },
  ];

  return (
    <div className="planner-header-enter flex flex-wrap items-center justify-between gap-4 py-6 border-b border-border mb-8">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onPrevWeek} aria-label="Previous week"
          className="active:scale-90 transition-transform duration-100">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center min-w-[240px]">
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
            Week {weekKey.split("-W")[1]}
          </div>
          <div className="text-sm font-medium text-foreground">{label}</div>
        </div>
        <Button variant="outline" size="icon" onClick={onNextWeek} aria-label="Next week"
          className="active:scale-90 transition-transform duration-100">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {pills.map((pill, i) => (
          <GoalPill key={pill.label} dotColor={pill.dotColor} label={pill.label} pillIndex={i} animating={pillsAnimating} />
        ))}
        <Button variant="outline" size="sm" onClick={() => setGoalsOpen(true)}
          className="active:scale-95 transition-transform duration-100">
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
