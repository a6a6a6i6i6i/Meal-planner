import { useState, useEffect, useRef } from "react";
import { X, SlidersHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MealPicker from "./MealPicker";
import IngredientAdjustDialog from "./IngredientAdjustDialog";
import { computeEntryMacros } from "@/lib/planner";
import type { Meal, MealEntry, SlotKey, IngredientOverride } from "@/types";

const SLOT_LABELS: Record<SlotKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};

interface MealSlotProps {
  slot: SlotKey;
  entries: MealEntry[];
  meals: Meal[];
  colIndex?: number;
  onAdd: (entry: MealEntry) => void;
  onUpdateEntry: (index: number, entry: MealEntry | null) => void;
}

export default function MealSlot({ slot, entries, meals, colIndex = 0, onAdd, onUpdateEntry }: MealSlotProps) {
  // Rows present at first mount shouldn't glow as "just filled" — only
  // ones added afterward, in this session, should.
  const hasMountedRef = useRef(false);
  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {SLOT_LABELS[slot]}
      </div>

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <MealEntryRow
              key={index}
              entry={entry}
              meals={meals}
              skipInitialGlow={!hasMountedRef.current}
              onRemove={() => onUpdateEntry(index, null)}
              onChange={(next) => onUpdateEntry(index, next)}
            />
          ))}
        </div>
      )}

      <MealPicker
        meals={meals}
        selectedId={null}
        placeholder={entries.length > 0 ? "Add another…" : undefined}
        onSelect={(id) => onAdd({ mealId: id, servings: 1 })}
      />
    </div>
  );
}

interface MealEntryRowProps {
  entry: MealEntry;
  meals: Meal[];
  skipInitialGlow?: boolean;
  onRemove: () => void;
  onChange: (entry: MealEntry) => void;
}

function MealEntryRow({ entry, meals, skipInitialGlow, onRemove, onChange }: MealEntryRowProps) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [justFilled, setJustFilled] = useState(!skipInitialGlow);

  useEffect(() => {
    if (!justFilled) return;
    const t = setTimeout(() => setJustFilled(false), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meal = meals.find((m) => m.id === entry.mealId);
  const deleted = !meal;
  const hasIngredients = meal && meal.ingredients?.length > 0;

  function handleServingsChange(raw: string) {
    const val = parseFloat(raw);
    if (isNaN(val) || val <= 0) {
      onRemove();
    } else {
      onChange({ ...entry, servings: val });
    }
  }

  function handleOverrideSave(overrides: IngredientOverride[]) {
    onChange({ ...entry, ingredientOverrides: overrides });
  }

  const entryMacros = meal ? computeEntryMacros(meal, entry) : null;
  const entryKcal = entryMacros ? Math.round(entryMacros.calories) : 0;

  if (deleted) {
    return (
      <div className="slot-content-in flex items-center justify-between gap-1 text-xs bg-destructive/10 rounded-lg px-2 py-1.5" style={{ color: 'hsl(0 84% 35%)' }}>
        <span>Meal removed from library</span>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onRemove} aria-label="Remove entry" style={{ color: 'hsl(0 84% 35%)' }}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`slot-content-in space-y-1.5 ${justFilled ? "slot-fill-glow" : ""}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold truncate flex-1 leading-snug">{meal.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground active:scale-90 transition-transform duration-100"
              aria-label="Meal entry options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hasIngredients && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setTimeout(() => setAdjustOpen(true), 0);
                }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                Adjust portions
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasIngredients ? (
        <>
          <div className="text-[10px] text-muted-foreground leading-snug">
            {meal.ingredients.map((ing) => {
              const override = entry.ingredientOverrides?.find((o) => o.ingredientId === ing.ingredientId);
              const g = override ? override.grams : ing.defaultGrams;
              return `${ing.name} ${g}g`;
            }).join(" · ")}
          </div>
          <IngredientAdjustDialog
            open={adjustOpen}
            onOpenChange={setAdjustOpen}
            mealName={meal.name}
            ingredients={meal.ingredients}
            entry={entry}
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
            value={entry.servings}
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
        selectedId={entry.mealId}
        onSelect={(id) => onChange({ mealId: id, servings: 1 })}
      />
    </div>
  );
}
