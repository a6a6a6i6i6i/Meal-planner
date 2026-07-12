import { useState, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  getISOWeekKey,
  getWeekDates,
  formatDayKey,
  getPrevWeekKey,
  getNextWeekKey,
} from "@/lib/weekKeys";
import type { Meal, MealEntry, WeekGoals, WeekPlan, DayPlan, SlotKey } from "@/types";
import { DEFAULT_GOALS, SLOT_KEYS } from "@/types";

function buildEmptyDayPlan(): DayPlan {
  return { breakfast: [], lunch: [], snack: [], dinner: [] };
}

// Older saved data stored one MealEntry (or null) per slot instead of an
// array. Normalize on read so every slot is always MealEntry[].
function normalizeDayPlan(day: unknown): DayPlan {
  const raw = (day ?? {}) as Record<string, unknown>;
  const normalized = {} as DayPlan;
  for (const slot of SLOT_KEYS) {
    const v = raw[slot];
    if (Array.isArray(v)) normalized[slot] = v as MealEntry[];
    else if (v && typeof v === "object") normalized[slot] = [v as MealEntry];
    else normalized[slot] = [];
  }
  return normalized;
}

function normalizeWeekPlan(wp: WeekPlan): WeekPlan {
  const days: Record<string, DayPlan> = {};
  for (const [key, day] of Object.entries(wp.days)) {
    days[key] = normalizeDayPlan(day);
  }
  return { ...wp, days };
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
  const [weekKey, setWeekKey] = useState<string>(getISOWeekKey(new Date()));
  const [rawWeekPlan, setWeekPlan] = useLocalStorage<WeekPlan>(
    `meal-planner:week:${weekKey}`,
    buildDefaultWeekPlan(weekKey)
  );
  const weekPlan = useMemo(() => normalizeWeekPlan(rawWeekPlan), [rawWeekPlan]);

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

  function duplicateMeal(id: string) {
    const source = meals.find((m) => m.id === id);
    if (!source) return;
    const copy: Meal = { ...source, id: crypto.randomUUID(), name: `${source.name} (copy)` };
    setMeals((prev) => [...prev, copy]);
  }

  function goToPrevWeek() {
    setWeekKey((k) => getPrevWeekKey(k));
  }

  function goToNextWeek() {
    setWeekKey((k) => getNextWeekKey(k));
  }

  function updateDaySlot(dayKey: string, slot: SlotKey, index: number, entry: MealEntry | null) {
    setWeekPlan((prev) => {
      const day = normalizeDayPlan(prev.days[dayKey]);
      const current = day[slot];
      let next: MealEntry[];
      if (entry === null) {
        next = current.filter((_, i) => i !== index);
      } else if (index >= current.length) {
        next = [...current, entry];
      } else {
        next = current.map((e, i) => (i === index ? entry : e));
      }
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayKey]: { ...day, [slot]: next },
        },
      };
    });
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
    duplicateMeal,
    goToPrevWeek,
    goToNextWeek,
    updateDaySlot,
    updateGoals,
  };
}
