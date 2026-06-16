import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm leading-tight">{meal.name}</h3>
        <div className="flex gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit} aria-label="Edit meal">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete} aria-label="Delete meal">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "kcal", value: Math.round(meal.calories) },
          { label: "protein", value: `${meal.protein}g` },
          { label: "carbs", value: `${meal.carbs}g` },
          { label: "fat", value: `${meal.fat}g` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted rounded-md py-1.5 px-1">
            <div className="text-xs font-semibold text-foreground">{value}</div>
            <div className="text-[10px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
