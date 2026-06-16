import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function WeekHeader({ weekKey, goals, onPrevWeek, onNextWeek, onUpdateGoals }: WeekHeaderProps) {
  const [goalsOpen, setGoalsOpen] = useState(false);
  const dates = getWeekDates(weekKey);
  const monday = dates[0];
  const sunday = dates[6];

  const label = monday.getMonth() === sunday.getMonth()
    ? `${format(monday, "MMM d")}–${format(sunday, "d, yyyy")}`
    : `${format(monday, "MMM d")} – ${format(sunday, "MMM d, yyyy")}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevWeek} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center min-w-[160px]">
          <div className="text-xs text-muted-foreground">{weekKey}</div>
          <div className="font-semibold text-sm">{label}</div>
        </div>
        <Button variant="outline" size="icon" onClick={onNextWeek} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{goals.calories} kcal</Badge>
        <Badge variant="secondary">{goals.protein}g protein</Badge>
        <Badge variant="secondary">{goals.carbs}g carbs</Badge>
        <Badge variant="secondary">{goals.fat}g fat</Badge>
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
