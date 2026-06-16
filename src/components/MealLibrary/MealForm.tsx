import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Meal } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
  protein: z.number({ invalid_type_error: "Required" }).nonnegative(),
  carbs: z.number({ invalid_type_error: "Required" }).nonnegative(),
  fat: z.number({ invalid_type_error: "Required" }).nonnegative(),
});

type FormData = z.infer<typeof schema>;

interface MealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Meal;
  onSave: (data: FormData) => void;
}

export default function MealForm({ open, onOpenChange, initial, onSave }: MealFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
  });

  function onSubmit(data: FormData) {
    onSave(data);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Meal" : "Add Meal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Meal name</Label>
            <Input id="name" placeholder="e.g. Oatmeal" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input id="calories" type="number" min={0} step={1} {...register("calories", { valueAsNumber: true })} />
              {errors.calories && <p className="text-xs text-destructive">{errors.calories.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" min={0} step={0.1} {...register("protein", { valueAsNumber: true })} />
              {errors.protein && <p className="text-xs text-destructive">{errors.protein.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" min={0} step={0.1} {...register("carbs", { valueAsNumber: true })} />
              {errors.carbs && <p className="text-xs text-destructive">{errors.carbs.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" min={0} step={0.1} {...register("fat", { valueAsNumber: true })} />
              {errors.fat && <p className="text-xs text-destructive">{errors.fat.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save changes" : "Add meal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
