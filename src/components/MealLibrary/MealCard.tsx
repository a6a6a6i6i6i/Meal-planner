import { MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function MealCard({ meal, onEdit, onDuplicate, onDelete }: MealCardProps) {
  const hasIngredients = meal.ingredients?.length > 0;

  return (
    <div className="border rounded-lg p-4 bg-card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-medium text-sm leading-tight">{meal.name}</h3>
          {hasIngredients && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? "s" : ""}
              {" · "}
              {meal.ingredients.map((i) => `${i.name} ${i.defaultGrams}g`).join(", ")}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Meal options">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-3.5 w-3.5 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "kcal", value: Math.round(meal.calories) },
          { label: "protein", value: `${meal.protein}g` },
          { label: "fat", value: `${meal.fat}g` },
          { label: "carbs", value: `${meal.carbs}g` },
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
