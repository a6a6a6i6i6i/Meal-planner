import { memo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
  cardIndex: number;
  onEdit: () => void;
  onDelete: () => void;
}

const MealCard = memo(function MealCard({ meal, cardIndex, onEdit, onDelete }: MealCardProps) {
  const hasIngredients = meal.ingredients?.length > 0;
  const [exiting, setExiting] = useState(false);

  const handleDelete = () => {
    setExiting(true);
    setTimeout(onDelete, 160);
  };

  const staggerIndex = Math.min(cardIndex, 7);

  return (
    <div
      className={`
        border border-border rounded-2xl p-5 bg-background flex flex-col gap-4
        transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:-translate-y-1 hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.08)]
        ${exiting ? "meal-card-exit" : "meal-card-enter"}
      `}
      style={{ ["--card-i" as string]: staggerIndex }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm leading-snug tracking-tight">{meal.name}</h3>
          {hasIngredients && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? "s" : ""}
              {" · "}
              {meal.ingredients.map((i) => `${i.name} ${i.defaultGrams}g`).join(", ")}
            </p>
          )}
        </div>
        <div className="flex gap-0.5 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground active:scale-90 transition-transform duration-100"
                onClick={onEdit}
                aria-label="Edit meal"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive active:scale-90 transition-transform duration-100"
                onClick={handleDelete}
                aria-label="Delete meal"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: "kcal",    value: Math.round(meal.calories),       bg: "bg-brand-ochre/25" },
          { label: "protein", value: `${Math.round(meal.protein)}g`, bg: "bg-brand-pink/15"  },
          { label: "fat",     value: `${Math.round(meal.fat)}g`,     bg: "bg-brand-mint/30"  },
          { label: "carbs",   value: `${Math.round(meal.carbs)}g`,   bg: "bg-brand-peach/25" },
        ].map(({ label, value, bg }) => (
          <div key={label} className={`${bg} rounded-lg py-2 px-1`}>
            <div className="text-xs font-semibold text-foreground">{value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default MealCard;
