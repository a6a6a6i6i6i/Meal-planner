export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  mealId: string;
  servings: number;
}

export interface DayPlan {
  breakfast: MealEntry | null;
  lunch: MealEntry | null;
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

export type SlotKey = 'breakfast' | 'lunch' | 'dinner';
export const SLOT_KEYS: SlotKey[] = ['breakfast', 'lunch', 'dinner'];
export const DEFAULT_GOALS: WeekGoals = { calories: 2000, protein: 150, carbs: 200, fat: 65 };
