import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { SEED_MEALS } from "@/lib/seedMeals";
import {
  getISOWeekKey,
  getWeekDates,
  formatDayKey,
  getPrevWeekKey,
  getNextWeekKey,
} from "@/lib/weekKeys";
import type { Meal, MealEntry, WeekGoals, WeekPlan, SlotKey } from "@/types";
import { DEFAULT_GOALS } from "@/types";

function buildEmptyDayPlan() {
  return { breakfast: null, lunch: null, dinner: null };
}

function buildDefaultWeekPlan(weekKey: string): WeekPlan {
  const prevKey = getPrevWeekKey(weekKey);
  let goals: WeekGoals = DEFAULT_GOALS;
  try {
    const raw = localStorage.getItem(`meal-planner:week:${prevKey}`);
    if (raw) {
      const prev: WeekPlan = JSON.parse(raw);
      if (prev.goals) goals = prev.goals;
    }
  } catch {
    // fallback
  }

  const days: Record<string, ReturnType<typeof buildEmptyDayPlan>> = {};
  for (const date of getWeekDates(weekKey)) {
    days[formatDayKey(date)] = buildEmptyDayPlan();
  }

  return { weekKey, goals, days };
}

export function useMealPlanner() {
  const [meals, setMeals] = useLocalStorage<Meal[]>("meal-planner:meals", []);
  const [seeded, setSeeded] = useLocalStorage<boolean>(
    "meal-planner:seeded-v1",
    false
  );

  // One-time import of meals derived from MacroFactor logs.
  // Merges by id so user-created meals are never touched or duplicated.
  useEffect(() => {
    if (seeded) return;
    setMeals((prev) => {
      const existing = new Set(prev.map((m) => m.id));
      return [...prev, ...SEED_MEALS.filter((m) => !existing.has(m.id))];
    });
    setSeeded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeded]);
  const [weekKey, setWeekKey] = useState<string>(getISOWeekKey(new Date()));
  const [weekPlan, setWeekPlan] = useLocalStorage<WeekPlan>(
    `meal-planner:week:${weekKey}`,
    buildDefaultWeekPlan(weekKey)
  );

  function addMeal(data: Omit<Meal, "id">) {
    const meal: Meal = { ...data, id: crypto.randomUUID() };
    setMeals((prev) => [...prev, meal]);
  }

  function updateMeal(id: string, data: Omit<Meal, "id">) {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...data, id } : m)));
  }

  function deleteMeal(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }

  function goToPrevWeek() {
    setWeekKey((k) => getPrevWeekKey(k));
  }

  function goToNextWeek() {
    setWeekKey((k) => getNextWeekKey(k));
  }

  function ensureDayExists(dayKey: string) {
    if (!weekPlan.days[dayKey]) {
      setWeekPlan((prev) => ({
        ...prev,
        days: { ...prev.days, [dayKey]: buildEmptyDayPlan() },
      }));
    }
  }

  function updateDaySlot(dayKey: string, slot: SlotKey, entry: MealEntry | null) {
    ensureDayExists(dayKey);
    setWeekPlan((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayKey]: { ...prev.days[dayKey], [slot]: entry },
      },
    }));
  }

  function updateGoals(goals: WeekGoals) {
    setWeekPlan((prev) => ({ ...prev, goals }));
  }

  return {
    meals,
    weekKey,
    weekPlan,
    addMeal,
    updateMeal,
    deleteMeal,
    goToPrevWeek,
    goToNextWeek,
    updateDaySlot,
    updateGoals,
  };
}
