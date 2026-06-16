import Nav from "@/components/Nav";
import WeekPlanner from "@/components/WeekPlanner/WeekPlanner";
import { useMealPlanner } from "@/hooks/useMealPlanner";

export default function WeekPlannerPage() {
  const { meals, weekKey, weekPlan, goToPrevWeek, goToNextWeek, updateDaySlot, updateGoals } =
    useMealPlanner();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="py-4">
        <WeekPlanner
          weekKey={weekKey}
          weekPlan={weekPlan}
          meals={meals}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onUpdateDaySlot={updateDaySlot}
          onUpdateGoals={updateGoals}
        />
      </main>
    </div>
  );
}
