import Nav from "@/components/Nav";
import MealLibrary from "@/components/MealLibrary/MealLibrary";
import { useMealPlanner } from "@/hooks/useMealPlanner";
import { useIngredientLibrary } from "@/hooks/useIngredientLibrary";

export default function MealLibraryPage() {
  const { meals, addMeal, updateMeal, deleteMeal, duplicateMeal } = useMealPlanner();
  const { ingredients: ingredientLibrary, upsertMany } = useIngredientLibrary(meals);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <MealLibrary
          meals={meals}
          ingredientLibrary={ingredientLibrary}
          onAdd={(data) => {
            addMeal(data);
            upsertMany(data.ingredients);
          }}
          onUpdate={(id, data) => {
            updateMeal(id, data);
            upsertMany(data.ingredients);
          }}
          onDelete={deleteMeal}
          onDuplicate={duplicateMeal}
        />
      </main>
    </div>
  );
}
