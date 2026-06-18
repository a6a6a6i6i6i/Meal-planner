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
import type { WeekGoals } from "@/types";

const schema = z.object({
  calories: z.number({ invalid_type_error: "Required" }).positive(),
  protein: z.number({ invalid_type_error: "Required" }).nonnegative(),
  carbs: z.number({ invalid_type_error: "Required" }).nonnegative(),
  fat: z.number({ invalid_type_error: "Required" }).nonnegative(),
});

type FormData = z.infer<typeof schema>;

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: WeekGoals;
  onSave: (goals: WeekGoals) => void;
}

export default function GoalsDialog({ open, onOpenChange, goals, onSave }: GoalsDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: goals,
  });

  function onSubmit(data: FormData) {
    onSave(data);
    onOpenChange(false);
  }

  const fields: { id: keyof FormData; label: string; unit: string }[] = [
    { id: "calories", label: "Calories", unit: "kcal/day" },
    { id: "protein",  label: "Protein",  unit: "g/day"    },
    { id: "fat",      label: "Fat",      unit: "g/day"    },
    { id: "carbs",    label: "Carbs",    unit: "g/day"    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Daily goals</DialogTitle>
          <p className="text-xs text-muted-foreground">These targets apply to each day of the week.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {fields.map(({ id, label, unit }, i) => (
            <div
              key={id}
              className="goals-field-enter space-y-1"
              style={{ ["--field-i" as string]: i }}
            >
              <Label htmlFor={id}>
                {label} <span className="text-muted-foreground font-normal">({unit})</span>
              </Label>
              <Input
                id={id}
                type="number"
                min={0}
                step={id === "calories" ? 1 : 0.1}
                className="transition-shadow duration-150 focus:ring-2 focus:ring-brand-ochre/40"
                {...register(id, { valueAsNumber: true })}
              />
              {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
            </div>
          ))}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="active:scale-95 transition-transform duration-100"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="active:scale-95 transition-transform duration-100"
            >
              Save goals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
