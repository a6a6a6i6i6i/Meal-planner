import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Ingredient, IngredientOverride, MealEntry } from "@/types";

interface IngredientAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealName: string;
  ingredients: Ingredient[];
  entry: MealEntry;
  onSave: (overrides: IngredientOverride[]) => void;
}

export default function IngredientAdjustDialog({
  open,
  onOpenChange,
  mealName,
  ingredients,
  entry,
  onSave,
}: IngredientAdjustDialogProps) {
  const getGrams = () =>
    ingredients.map((ing) => {
      const override = entry.ingredientOverrides?.find((o) => o.ingredientId === ing.ingredientId);
      return override ? override.grams : ing.defaultGrams;
    });

  const [grams, setGrams] = useState<number[]>(getGrams);

  useEffect(() => {
    if (open) setGrams(getGrams());
  }, [open]);

  function setGram(index: number, val: string) {
    const n = parseFloat(val);
    setGrams((prev) => {
      const next = [...prev];
      next[index] = n;
      return next;
    });
  }

  function handleSave() {
    const overrides: IngredientOverride[] = ingredients.map((ing, i) => ({
      ingredientId: ing.ingredientId,
      grams: isNaN(grams[i]) || grams[i] <= 0 ? ing.defaultGrams : grams[i],
    }));
    onSave(overrides);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust — {mealName}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Override ingredient grams for this day only.
        </p>
        <div className="space-y-3">
          {ingredients.map((ing, i) => {
            const g = isNaN(grams[i]) || grams[i] <= 0 ? ing.defaultGrams : grams[i];
            const kcal = Math.round((ing.caloriesPer100g * g) / 100);
            return (
              <div key={ing.ingredientId} className="flex items-center gap-3">
                <span className="flex-1 text-sm truncate">{ing.name}</span>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={isNaN(grams[i]) ? "" : grams[i]}
                  onChange={(e) => setGram(i, e.target.value)}
                  className="w-20 h-8 text-xs"
                  aria-label={`${ing.name} grams`}
                />
                <span className="text-[10px] text-muted-foreground w-4">g</span>
                <span className="text-[10px] text-muted-foreground w-14 text-right">
                  {kcal} kcal
                </span>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
