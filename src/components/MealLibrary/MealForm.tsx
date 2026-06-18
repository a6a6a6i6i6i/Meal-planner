import { useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Meal } from "@/types";

const ingredientSchema = z.object({
  ingredientId: z.string(),
  name: z.string().min(1, "Required"),
  defaultGrams: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
  // These represent macros FOR the default grams, not per 100g
  calories: z.number({ invalid_type_error: "Required" }).nonnegative(),
  protein: z.number({ invalid_type_error: "Required" }).nonnegative(),
  fat: z.number({ invalid_type_error: "Required" }).nonnegative(),
  carbs: z.number({ invalid_type_error: "Required" }).nonnegative(),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.number({ invalid_type_error: "Required" }).nonnegative().default(0),
  protein: z.number({ invalid_type_error: "Required" }).nonnegative().default(0),
  fat: z.number({ invalid_type_error: "Required" }).nonnegative().default(0),
  carbs: z.number({ invalid_type_error: "Required" }).nonnegative().default(0),
  ingredients: z.array(ingredientSchema).default([]),
});

type FormData = z.infer<typeof schema>;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function sumIngredients(ingredients: FormData["ingredients"]) {
  return ingredients.reduce(
    (acc, ing) => ({
      calories: acc.calories + (isNaN(ing.calories) ? 0 : ing.calories),
      protein: acc.protein + (isNaN(ing.protein) ? 0 : ing.protein),
      fat: acc.fat + (isNaN(ing.fat) ? 0 : ing.fat),
      carbs: acc.carbs + (isNaN(ing.carbs) ? 0 : ing.carbs),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

// Convert stored per-100g values → values for the given default grams
function fromPer100g(per100g: number, defaultGrams: number) {
  return round1((per100g * defaultGrams) / 100);
}

// Convert form values (for default grams) → per-100g for storage
function toPer100g(value: number, defaultGrams: number) {
  if (!defaultGrams || defaultGrams <= 0) return 0;
  return (value / defaultGrams) * 100;
}

interface MealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Meal;
  onSave: (data: Omit<Meal, "id">) => void;
}

export default function MealForm({ open, onOpenChange, initial, onSave }: MealFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      calories: initial?.calories ?? 0,
      protein: initial?.protein ?? 0,
      fat: initial?.fat ?? 0,
      carbs: initial?.carbs ?? 0,
      ingredients: initial?.ingredients?.map((ing) => ({
        ingredientId: ing.ingredientId,
        name: ing.name,
        defaultGrams: ing.defaultGrams,
        calories: fromPer100g(ing.caloriesPer100g, ing.defaultGrams),
        protein: fromPer100g(ing.proteinPer100g, ing.defaultGrams),
        fat: fromPer100g(ing.fatPer100g, ing.defaultGrams),
        carbs: fromPer100g(ing.carbsPer100g, ing.defaultGrams),
      })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });
  const watchedIngredients = watch("ingredients");
  const hasIngredients = fields.length > 0;
  const computed = hasIngredients ? sumIngredients(watchedIngredients) : null;

  // Auto-scale macro inputs when defaultGrams changes
  const prevGramsRef = useRef<string>("");
  const gramsStr = JSON.stringify(watchedIngredients.map((i) => i.defaultGrams));
  useEffect(() => {
    if (!prevGramsRef.current) {
      prevGramsRef.current = gramsStr;
      return;
    }
    const prev: number[] = JSON.parse(prevGramsRef.current);
    watchedIngredients.forEach((ing, i) => {
      const oldG = prev[i];
      const newG = isNaN(ing.defaultGrams) ? 0 : ing.defaultGrams;
      if (oldG !== undefined && oldG > 0 && newG > 0 && oldG !== newG) {
        const scale = newG / oldG;
        setValue(`ingredients.${i}.calories`, round1((isNaN(ing.calories) ? 0 : ing.calories) * scale));
        setValue(`ingredients.${i}.protein`, round1((isNaN(ing.protein) ? 0 : ing.protein) * scale));
        setValue(`ingredients.${i}.fat`, round1((isNaN(ing.fat) ? 0 : ing.fat) * scale));
        setValue(`ingredients.${i}.carbs`, round1((isNaN(ing.carbs) ? 0 : ing.carbs) * scale));
      }
    });
    prevGramsRef.current = gramsStr;
  }, [gramsStr]);

  function onSubmit(data: FormData) {
    const ingredientsForStorage = data.ingredients.map((ing) => ({
      ingredientId: ing.ingredientId,
      name: ing.name,
      defaultGrams: ing.defaultGrams,
      caloriesPer100g: toPer100g(isNaN(ing.calories) ? 0 : ing.calories, ing.defaultGrams),
      proteinPer100g: toPer100g(isNaN(ing.protein) ? 0 : ing.protein, ing.defaultGrams),
      fatPer100g: toPer100g(isNaN(ing.fat) ? 0 : ing.fat, ing.defaultGrams),
      carbsPer100g: toPer100g(isNaN(ing.carbs) ? 0 : ing.carbs, ing.defaultGrams),
    }));

    const macros =
      data.ingredients.length > 0
        ? sumIngredients(data.ingredients)
        : { calories: data.calories, protein: data.protein, fat: data.fat, carbs: data.carbs };

    onSave({ name: data.name, ...macros, ingredients: ingredientsForStorage });
    reset();
    prevGramsRef.current = "";
    onOpenChange(false);
  }

  function handleClose(v: boolean) {
    if (!v) {
      reset();
      prevGramsRef.current = "";
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit meal" : "Add meal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Meal name</Label>
            <Input id="name" placeholder="e.g. Pasta with Ragù" autoFocus {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Ingredients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  append({
                    ingredientId: crypto.randomUUID(),
                    name: "",
                    defaultGrams: 100,
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carbs: 0,
                  });
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add ingredient
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No ingredients yet. Enter macros directly below, or add ingredients to calculate them.
              </p>
            )}

            {fields.map((field, index) => {
              const grams = watchedIngredients[index]?.defaultGrams;
              const gramsLabel = !isNaN(grams) && grams > 0 ? `${grams}g` : "…g";
              return (
                <div key={field.id} className="border rounded-lg p-3 space-y-2">
                  <input type="hidden" {...register(`ingredients.${index}.ingredientId`)} />
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`ing-name-${index}`} className="text-xs">Name</Label>
                      <Input
                        id={`ing-name-${index}`}
                        placeholder="e.g. Milk"
                        className="h-8 text-xs"
                        {...register(`ingredients.${index}.name`)}
                      />
                      {errors.ingredients?.[index]?.name && (
                        <p className="text-xs text-destructive">{errors.ingredients[index].name?.message}</p>
                      )}
                    </div>
                    <div className="w-24 space-y-1">
                      <Label htmlFor={`ing-grams-${index}`} className="text-xs">Amount (g/ml)</Label>
                      <Input
                        id={`ing-grams-${index}`}
                        type="number"
                        min={0}
                        step={1}
                        className="h-8 text-xs"
                        {...register(`ingredients.${index}.defaultGrams`, { valueAsNumber: true })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => remove(index)}
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Per {gramsLabel}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        { key: "calories", label: "kcal" },
                        { key: "protein", label: "protein" },
                        { key: "fat", label: "fat" },
                        { key: "carbs", label: "carbs" },
                      ] as const
                    ).map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`ing-${key}-${index}`} className="text-[10px] text-muted-foreground">
                          {label}
                        </Label>
                        <Input
                          id={`ing-${key}-${index}`}
                          type="number"
                          min={0}
                          step={0.1}
                          className="h-8 text-xs"
                          {...register(`ingredients.${index}.${key}`, { valueAsNumber: true })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {hasIngredients && computed ? (
            <div className="rounded-md bg-muted p-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Total at default amounts</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "kcal", value: Math.round(computed.calories) },
                  { label: "protein", value: `${round1(computed.protein)}g` },
                  { label: "fat", value: `${round1(computed.fat)}g` },
                  { label: "carbs", value: `${round1(computed.carbs)}g` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-background rounded-md py-1.5">
                    <div className="text-xs font-semibold">{value}</div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Macros per serving</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "calories", label: "Calories (kcal)" },
                      { id: "protein", label: "Protein (g)" },
                      { id: "fat", label: "Fat (g)" },
                      { id: "carbs", label: "Carbs (g)" },
                    ] as const
                  ).map(({ id, label }) => (
                    <div key={id} className="space-y-1">
                      <Label htmlFor={id} className="text-xs">{label}</Label>
                      <Input
                        id={id}
                        type="number"
                        min={0}
                        step={id === "calories" ? 1 : 0.1}
                        {...register(id, { valueAsNumber: true })}
                      />
                      {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save changes" : "Add meal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
