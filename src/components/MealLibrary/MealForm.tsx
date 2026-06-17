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
  caloriesPer100g: z.number({ invalid_type_error: "Required" }).nonnegative(),
  proteinPer100g: z.number({ invalid_type_error: "Required" }).nonnegative(),
  fatPer100g: z.number({ invalid_type_error: "Required" }).nonnegative(),
  carbsPer100g: z.number({ invalid_type_error: "Required" }).nonnegative(),
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

function sumIngredients(ingredients: FormData["ingredients"]) {
  return ingredients.reduce(
    (acc, ing) => {
      const g = isNaN(ing.defaultGrams) || ing.defaultGrams <= 0 ? 0 : ing.defaultGrams;
      const f = g / 100;
      return {
        calories: acc.calories + (isNaN(ing.caloriesPer100g) ? 0 : ing.caloriesPer100g) * f,
        protein: acc.protein + (isNaN(ing.proteinPer100g) ? 0 : ing.proteinPer100g) * f,
        fat: acc.fat + (isNaN(ing.fatPer100g) ? 0 : ing.fatPer100g) * f,
        carbs: acc.carbs + (isNaN(ing.carbsPer100g) ? 0 : ing.carbsPer100g) * f,
      };
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
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
      ingredients: initial?.ingredients ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });
  const watchedIngredients = watch("ingredients");
  const hasIngredients = fields.length > 0;
  const computed = hasIngredients ? sumIngredients(watchedIngredients) : null;

  function onSubmit(data: FormData) {
    const macros =
      data.ingredients.length > 0
        ? sumIngredients(data.ingredients)
        : { calories: data.calories, protein: data.protein, fat: data.fat, carbs: data.carbs };

    onSave({ name: data.name, ...macros, ingredients: data.ingredients });
    reset();
    onOpenChange(false);
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Meal" : "Add Meal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Meal name</Label>
            <Input id="name" placeholder="e.g. Pasta with Ragù" {...register("name")} />
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
                onClick={() =>
                  append({
                    ingredientId: crypto.randomUUID(),
                    name: "",
                    defaultGrams: 100,
                    caloriesPer100g: 0,
                    proteinPer100g: 0,
                    fatPer100g: 0,
                    carbsPer100g: 0,
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add ingredient
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No ingredients — enter macros directly below, or add ingredients to compute them automatically.
              </p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-3 space-y-2">
                <input type="hidden" {...register(`ingredients.${index}.ingredientId`)} />
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={`ing-name-${index}`} className="text-xs">Name</Label>
                    <Input
                      id={`ing-name-${index}`}
                      placeholder="e.g. Pasta"
                      className="h-8 text-xs"
                      {...register(`ingredients.${index}.name`)}
                    />
                    {errors.ingredients?.[index]?.name && (
                      <p className="text-xs text-destructive">{errors.ingredients[index].name?.message}</p>
                    )}
                  </div>
                  <div className="w-24 space-y-1">
                    <Label htmlFor={`ing-grams-${index}`} className="text-xs">Default g</Label>
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
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { key: "caloriesPer100g", label: "kcal/100g" },
                      { key: "proteinPer100g", label: "P /100g" },
                      { key: "fatPer100g", label: "F /100g" },
                      { key: "carbsPer100g", label: "C /100g" },
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
            ))}
          </div>

          {hasIngredients && computed ? (
            <div className="rounded-md bg-muted p-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Computed totals at default grams</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "kcal", value: Math.round(computed.calories) },
                  { label: "protein", value: `${Math.round(computed.protein * 10) / 10}g` },
                  { label: "fat", value: `${Math.round(computed.fat * 10) / 10}g` },
                  { label: "carbs", value: `${Math.round(computed.carbs * 10) / 10}g` },
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
