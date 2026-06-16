import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MealPicker from "./MealPicker";
import type { Meal, MealEntry, SlotKey } from "@/types";

const SLOT_LABELS: Record<SlotKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

interface MealSlotProps {
  slot: SlotKey;
  entry: MealEntry | null;
  meals: Meal[];
  onUpdate: (entry: MealEntry | null) => void;
}

export default function MealSlot({ slot, entry, meals, onUpdate }: MealSlotProps) {
  const meal = entry ? meals.find((m) => m.id === entry.mealId) : null;
  const deleted = entry && !meal;

  function handleServingsChange(raw: string) {
    const val = parseFloat(raw);
    if (!entry) return;
    if (isNaN(val) || val <= 0) {
      onUpdate(null);
    } else {
      onUpdate({ ...entry, servings: val });
    }
  }

  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {SLOT_LABELS[slot]}
      </div>

      {deleted ? (
        <div className="flex items-center justify-between gap-1 text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
          <span>Meal deleted</span>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onUpdate(null)} aria-label="Clear slot">
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : meal ? (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium truncate flex-1">{meal.name}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => onUpdate(null)} aria-label="Remove meal">
                  <X className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">×</span>
            <input
              type="number"
              min={0.25}
              max={10}
              step={0.25}
              value={entry!.servings}
              onChange={(e) => handleServingsChange(e.target.value)}
              onBlur={(e) => handleServingsChange(e.target.value)}
              className="w-14 h-6 text-xs border rounded px-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Servings"
            />
            <span className="text-[10px] text-muted-foreground">serving{entry!.servings !== 1 ? "s" : ""}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {Math.round(meal.calories * entry!.servings)} kcal
          </div>
          <MealPicker meals={meals} selectedId={entry!.mealId} onSelect={(id) => onUpdate({ mealId: id, servings: entry!.servings })} />
        </div>
      ) : (
        <MealPicker meals={meals} selectedId={null} onSelect={(id) => onUpdate({ mealId: id, servings: 1 })} />
      )}
    </div>
  );
}
