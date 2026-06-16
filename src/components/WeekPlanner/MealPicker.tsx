import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Meal } from "@/types";

interface MealPickerProps {
  meals: Meal[];
  selectedId: string | null;
  onSelect: (mealId: string) => void;
}

export default function MealPicker({ meals, selectedId, onSelect }: MealPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = meals.find((m) => m.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal h-8 text-xs px-2"
        >
          <span className="truncate">
            {selected ? selected.name : "Pick a meal…"}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search meals…" className="h-9" />
          <CommandList>
            <CommandEmpty>
              {meals.length === 0
                ? "No meals in library yet."
                : "No meals found."}
            </CommandEmpty>
            <CommandGroup>
              {meals.map((meal) => (
                <CommandItem
                  key={meal.id}
                  value={meal.name}
                  onSelect={() => {
                    onSelect(meal.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === meal.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div className="text-xs font-medium">{meal.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {meal.calories} kcal · {meal.protein}g P
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
