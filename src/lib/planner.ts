import type { DayPlan, Meal, MealEntry, MacroTotals, WeekGoals, SwapSuggestion, SlotKey } from "@/types";
import { SLOT_KEYS } from "@/types";

export function computeEntryMacros(meal: Meal, entry: MealEntry): MacroTotals {
  const ingredients = meal.ingredients;
  if (ingredients && ingredients.length > 0) {
    const totals: MacroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const ing of ingredients) {
      const override = entry.ingredientOverrides?.find((o) => o.ingredientId === ing.ingredientId);
      const grams = override && override.grams > 0 ? override.grams : ing.defaultGrams;
      const f = grams / 100;
      totals.calories += (isNaN(ing.caloriesPer100g) ? 0 : ing.caloriesPer100g) * f;
      totals.protein += (isNaN(ing.proteinPer100g) ? 0 : ing.proteinPer100g) * f;
      totals.carbs += (isNaN(ing.carbsPer100g) ? 0 : ing.carbsPer100g) * f;
      totals.fat += (isNaN(ing.fatPer100g) ? 0 : ing.fatPer100g) * f;
    }
    return totals;
  }
  const s = isNaN(entry.servings) || entry.servings <= 0 ? 0 : entry.servings;
  return {
    calories: meal.calories * s,
    protein: meal.protein * s,
    carbs: meal.carbs * s,
    fat: meal.fat * s,
  };
}

export function calculateDayTotals(dayPlan: DayPlan, meals: Meal[]): MacroTotals {
  const totals: MacroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const slot of SLOT_KEYS) {
    const entry = dayPlan[slot];
    if (!entry) continue;
    const meal = meals.find((m) => m.id === entry.mealId);
    if (!meal) continue;
    const m = computeEntryMacros(meal, entry);
    totals.calories += m.calories;
    totals.protein += m.protein;
    totals.carbs += m.carbs;
    totals.fat += m.fat;
  }
  return totals;
}

export function deviationScore(totals: MacroTotals, goals: WeekGoals): number {
  let score = 0;
  const keys: (keyof MacroTotals)[] = ["calories", "protein", "carbs", "fat"];
  for (const key of keys) {
    const target = goals[key];
    if (target === 0) continue;
    score += Math.abs(totals[key] - target) / target;
  }
  return score;
}

export function findBestSwap(
  dayPlan: DayPlan,
  meals: Meal[],
  goals: WeekGoals
): SwapSuggestion | null {
  const baselineTotals = calculateDayTotals(dayPlan, meals);
  const baseline = deviationScore(baselineTotals, goals);

  let bestScore = baseline;
  let bestSwap: SwapSuggestion | null = null;

  for (const slot of SLOT_KEYS) {
    const entry = dayPlan[slot];
    if (!entry) continue;
    const currentMeal = meals.find((m) => m.id === entry.mealId);
    if (!currentMeal) continue;

    const otherUsed = new Set(
      SLOT_KEYS.filter((s) => s !== slot)
        .map((s) => dayPlan[s]?.mealId)
        .filter(Boolean)
    );

    for (const candidate of meals) {
      if (candidate.id === entry.mealId) continue;
      if (otherUsed.has(candidate.id)) continue;

      const candidateEntry: MealEntry = { mealId: candidate.id, servings: 1 };
      const hypothetical: DayPlan = { ...dayPlan, [slot]: candidateEntry };
      const hypotheticalTotals = calculateDayTotals(hypothetical, meals);
      const score = deviationScore(hypotheticalTotals, goals);

      if (score < bestScore) {
        bestScore = score;
        const currentMacros = computeEntryMacros(currentMeal, entry);
        const candidateMacros = computeEntryMacros(candidate, candidateEntry);
        bestSwap = {
          slot,
          replaceMealId: entry.mealId,
          suggestMealId: candidate.id,
          scoreBefore: baseline,
          scoreAfter: score,
          calDelta: candidateMacros.calories - currentMacros.calories,
          proteinDelta: candidateMacros.protein - currentMacros.protein,
          servings: entry.servings,
        };
      }
    }
  }

  if (!bestSwap || bestSwap.scoreAfter >= baseline * 0.85) return null;
  return bestSwap;
}
