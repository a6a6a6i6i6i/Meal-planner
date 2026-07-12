import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Ingredient, IngredientDef, Meal } from "@/types";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

/**
 * One-time rename of legacy count-suffixed ingredient names to clean
 * single-portion names (e.g. "Almonds (10)" -> "Almonds"). Keyed by
 * normalized old name.
 */
const PORTION_RENAMES: Record<string, string> = {
  "scrambled eggs (2 large)": "Scrambled egg",
  "avocado (1/2)": "Avocado",
  "almonds (10)": "Almonds",
  "banana (1 medium)": "Banana",
};

function defFromIngredient(ing: Ingredient, id?: string): IngredientDef {
  return {
    id: id ?? crypto.randomUUID(),
    name: ing.name.trim(),
    caloriesPer100g: ing.caloriesPer100g,
    proteinPer100g: ing.proteinPer100g,
    carbsPer100g: ing.carbsPer100g,
    fatPer100g: ing.fatPer100g,
    lastUsedGrams: ing.defaultGrams,
  };
}

/**
 * Reusable ingredient library persisted in localStorage.
 * Bootstrapped once from the ingredients of all existing meals,
 * then kept up to date via upsertMany whenever a meal is saved.
 */
export function useIngredientLibrary(meals: Meal[]) {
  const [ingredients, setIngredients] = useLocalStorage<IngredientDef[]>(
    "meal-planner:ingredients",
    []
  );
  const [bootstrapped, setBootstrapped] = useLocalStorage<boolean>(
    "meal-planner:ingredients-bootstrapped-v1",
    false
  );
  const [portionMigrated, setPortionMigrated] = useLocalStorage<boolean>(
    "meal-planner:ingredients-portion-migration-v1",
    false
  );

  useEffect(() => {
    if (bootstrapped || meals.length === 0) return;
    const byName = new Map<string, IngredientDef>();
    for (const meal of meals) {
      for (const ing of meal.ingredients ?? []) {
        const key = normalize(ing.name);
        if (!key) continue;
        byName.set(key, defFromIngredient(ing, byName.get(key)?.id));
      }
    }
    const derived = [...byName.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setIngredients((prev) => (prev.length > 0 ? prev : derived));
    setBootstrapped(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapped, meals]);

  // One-time: rename legacy count-suffixed ingredients to single-portion names.
  useEffect(() => {
    if (portionMigrated) return;
    setIngredients((prev) => {
      let changed = false;
      const out: IngredientDef[] = [];
      for (const def of prev) {
        const target = PORTION_RENAMES[normalize(def.name)];
        if (!target) {
          out.push(def);
          continue;
        }
        changed = true;
        // If a def with the new name already exists, drop this legacy one.
        const existsAlready =
          out.some((d) => normalize(d.name) === normalize(target)) ||
          prev.some(
            (d) => d.id !== def.id && normalize(d.name) === normalize(target)
          );
        if (existsAlready) continue;
        out.push({ ...def, name: target });
      }
      return changed ? out : prev;
    });
    setPortionMigrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portionMigrated]);

  /** Upsert (by name) every ingredient used in a just-saved meal. */
  function upsertMany(used: Ingredient[]) {
    if (used.length === 0) return;
    setIngredients((prev) => {
      const next = [...prev];
      for (const ing of used) {
        const key = normalize(ing.name);
        if (!key) continue;
        const i = next.findIndex((d) => normalize(d.name) === key);
        if (i >= 0) next[i] = defFromIngredient(ing, next[i].id);
        else next.push(defFromIngredient(ing));
      }
      return next;
    });
  }

  function addIngredient(data: Omit<IngredientDef, "id">) {
    setIngredients((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
  }

  function updateIngredient(id: string, data: Omit<IngredientDef, "id">) {
    setIngredients((prev) =>
      prev.map((d) => (d.id === id ? { ...data, id } : d))
    );
  }

  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((d) => d.id !== id));
  }

  return { ingredients, upsertMany, addIngredient, updateIngredient, deleteIngredient };
}
