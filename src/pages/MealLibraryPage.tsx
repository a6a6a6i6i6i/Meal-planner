import Nav from "@/components/Nav";
import MealLibrary from "@/components/MealLibrary/MealLibrary";
import { useMealPlanner } from "@/hooks/useMealPlanner";

export default function MealLibraryPage() {
  const { meals, addMeal, updateMeal, deleteMeal, duplicateMeal } = useMealPlanner();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <MealLibrary
          meals={meals}
          onAdd={addMeal}
          onUpdate={updateMeal}
          onDelete={deleteMeal}
          onDuplicate={duplicateMeal}
        />
      </main>
    </div>
  );
}
