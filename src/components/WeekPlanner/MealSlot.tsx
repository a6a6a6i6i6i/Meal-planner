import { useState, useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MealPicker from "./MealPicker";
import IngredientAdjustDialog from "./IngredientAdjustDialog";
import { computeEntryMacros } from "@/lib/planner";
import type { Meal, MealEntry, SlotKey, IngredientOverride } from "@/types";

const SLOT_LABELS: Record<SlotKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

interface MealSlotProps {
  slot: SlotKey;
  entry: MealEntry | null;
  meals: Meal[];
  colIndex?: number;
  onUpdate: (entry: MealEntry | null) => void;
}

export default function MealSlot({ slot, entry, meals, colIndex = 0, onUpdate }: MealSlotProps) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [justFilled, setJustFilled] = useState(false);
  const prevMealId = useRef<string | null>(entry?.mealId ?? null);

  useEffect(() => {
    if (!prevMealId.current && entry?.mealId) {
      setJustFilled(true);
      const t = setTimeout(() => setJustFilled(false), 700);
      return () => clearTimeout(t);
    }
    prevMealId.current = entry?.mealId ?? null;
  }, [entry?.mealId]);

  const meal = entry ? meals.find((m) => m.id === entry.mealId) : null;
  const deleted = entry && !meal;
  const hasIngredients = meal && meal.ingredients?.length > 0;

  function handleServingsChange(raw: string) {
    const val = parseFloat(raw);
    if (!entry) return;
    if (isNaN(val) || val <= 0) {
      onUpdate(null);
    } else {
      onUpdate({ ...entry, servings: val });
    }
  }

  function handleOverrideSave(overrides: IngredientOverride[]) {
    if (!entry) return;
    onUpdate({ ...entry, ingredientOverrides: overrides });
  }

  const entryMacros = meal && entry ? computeEntryMacros(meal, entry) : null;
  const entryKcal = entryMacros ? Math.round(entryMacros.calories) : 0;

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {SLOT_LABELS[slot]}
      </div>

      {deleted ? (
        <div className="slot-content-in flex items-center justify-between gap-1 text-xs text-destructive bg-destructive/10 rounded-lg px-2 py-1.5">
          <span>Meal removed from library</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdate(null)} aria-label="Clear slot">
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : meal ? (
        <div key={meal.id} className={`slot-content-in space-y-1.5 ${justFilled ? "slot-fill-glow" : ""}`}>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold truncate flex-1 leading-snug">{meal.name}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground active:scale-90 transition-transform duration-100"
                  onClick={() => onUpdate(null)}
                  aria-label="Remove meal"
                >
                  <X className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </div>

          {hasIngredients ? (
            <>
              <div className="text-[10px] text-muted-foreground leading-snug">
                {meal.ingredients.map((ing) => {
                  const override = entry!.ingredientOverrides?.find((o) => o.ingredientId === ing.ingredientId);
                  const g = override ? override.grams : ing.defaultGrams;
                  return `${ing.name} ${g}g`;
                }).join(" · ")}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-full text-[10px] px-2 gap-1 active:scale-95 transition-transform duration-100"
                onClick={() => setAdjustOpen(true)}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Adjust portions
              </Button>
              <IngredientAdjustDialog
                open={adjustOpen}
                onOpenChange={setAdjustOpen}
                mealName={meal.name}
                ingredients={meal.ingredients}
                entry={entry!}
                onSave={handleOverrideSave}
              />
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Servings</span>
              <input
                type="number"
                min={0.25}
                max={10}
                step={0.25}
                value={entry!.servings}
                onChange={(e) => handleServingsChange(e.target.value)}
                onBlur={(e) => handleServingsChange(e.target.value)}
                className="w-14 h-9 text-xs border border-border rounded-md px-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring transition-shadow duration-150"
                aria-label="Number of servings"
              />
            </div>
          )}

          {entryMacros && (
            <div className="text-[10px] text-muted-foreground leading-snug">
              {entryKcal} kcal
              {" · "}P {Math.round(entryMacros.protein)}g
              {" · "}F {Math.round(entryMacros.fat)}g
              {" · "}C {Math.round(entryMacros.carbs)}g
            </div>
          )}
          <MealPicker
            meals={meals}
            selectedId={entry!.mealId}
            onSelect={(id) => onUpdate({ mealId: id, servings: 1 })}
          />
        </div>
      ) : (
        <MealPicker meals={meals} selectedId={null} onSelect={(id) => onUpdate({ mealId: id, servings: 1 })} />
      )}
    </div>
  );
}
