export interface Ingredient {
  ingredientId: string;
  name: string;
  defaultGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface IngredientDef {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  lastUsedGrams: number;
}

export interface IngredientOverride {
  ingredientId: string;
  grams: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
}

export interface MealEntry {
  mealId: string;
  servings: number;
  ingredientOverrides?: IngredientOverride[];
}

export interface DayPlan {
  breakfast: MealEntry | null;
  lunch: MealEntry | null;
  snack: MealEntry | null;
  dinner: MealEntry | null;
}

export interface WeekGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeekPlan {
  weekKey: string;
  goals: WeekGoals;
  days: Record<string, DayPlan>;
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SwapSuggestion {
  slot: SlotKey;
  replaceMealId: string;
  suggestMealId: string;
  scoreBefore: number;
  scoreAfter: number;
  calDelta: number;
  proteinDelta: number;
  servings: number;
}

export type SlotKey = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export const SLOT_KEYS: SlotKey[] = ['breakfast', 'lunch', 'snack', 'dinner'];
export const DEFAULT_GOALS: WeekGoals = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
