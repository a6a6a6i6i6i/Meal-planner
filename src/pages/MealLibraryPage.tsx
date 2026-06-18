import { useEffect } from "react";
import Nav from "@/components/Nav";
import MealLibrary from "@/components/MealLibrary/MealLibrary";
import { useMealPlanner } from "@/hooks/useMealPlanner";

export default function MealLibraryPage() {
  const { meals, addMeal, updateMeal, deleteMeal } = useMealPlanner();

  useEffect(() => { document.title = "Meal Planner · Library"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main id="main-content">
        <MealLibrary
          meals={meals}
          onAdd={addMeal}
          onUpdate={updateMeal}
          onDelete={deleteMeal}
        />
      </main>
    </div>
  );
}
