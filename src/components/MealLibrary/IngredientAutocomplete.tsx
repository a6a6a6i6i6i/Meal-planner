import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { IngredientDef } from "@/types";

interface IngredientAutocompleteProps {
  inputId: string;
  value: string;
  library: IngredientDef[];
  onChange: (name: string) => void;
  onPick: (def: IngredientDef) => void;
}

export default function IngredientAutocomplete({
  inputId,
  value,
  library,
  onChange,
  onPick,
}: IngredientAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return library
      .filter((d) => {
        const n = d.name.toLowerCase();
        return n.includes(q) && n !== q;
      })
      .slice(0, 6);
  }, [value, library]);

  const showList = open && matches.length > 0;

  function pick(def: IngredientDef) {
    setOpen(false);
    onPick(def);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(matches[highlighted]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <Input
        id={inputId}
        placeholder="e.g. Milk"
        className="h-8 text-xs"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul
          role="listbox"
          className="absolute z-50 top-full left-0 mt-1 w-full min-w-56 bg-popover text-popover-foreground border border-border rounded-md shadow-md max-h-52 overflow-auto py-1"
        >
          {matches.map((d, i) => (
            <li key={d.id} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                className={`w-full text-left px-3 py-1.5 text-xs flex items-baseline justify-between gap-2 ${
                  i === highlighted ? "bg-accent text-accent-foreground" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(d);
                }}
                onMouseEnter={() => setHighlighted(i)}
              >
                <span className="font-medium truncate">{d.name}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {Math.round(d.caloriesPer100g)} kcal · P
                  {Math.round(d.proteinPer100g)} /100g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
