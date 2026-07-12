import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMealPlanner } from "@/hooks/useMealPlanner";
import { useIngredientLibrary } from "@/hooks/useIngredientLibrary";
import type { IngredientDef } from "@/types";

type Draft = Omit<IngredientDef, "id">;

const EMPTY_DRAFT: Draft = {
  name: "",
  caloriesPer100g: 0,
  proteinPer100g: 0,
  fatPer100g: 0,
  carbsPer100g: 0,
  lastUsedGrams: 100,
};

interface IngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: IngredientDef;
  onSave: (data: Draft) => void;
}

function IngredientDialog({ open, onOpenChange, initial, onSave }: IngredientDialogProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  useEffect(() => {
    if (open) {
      setDraft(initial ? { ...initial } : EMPTY_DRAFT);
    }
  }, [open, initial]);

  function setNum(key: keyof Draft, value: string) {
    setDraft((d) => ({ ...d, [key]: value === "" ? 0 : Number(value) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    onSave({ ...draft, name: draft.name.trim() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit ingredient" : "Add ingredient"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="ing-def-name">Name</Label>
            <Input
              id="ing-def-name"
              autoFocus
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Macros per 100g</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {(
                [
                  { key: "caloriesPer100g", label: "Calories (kcal)" },
                  { key: "proteinPer100g", label: "Protein (g)" },
                  { key: "fatPer100g", label: "Fat (g)" },
                  { key: "carbsPer100g", label: "Carbs (g)" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`ing-def-${key}`} className="text-xs">{label}</Label>
                  <Input
                    id={`ing-def-${key}`}
                    type="number"
                    min={0}
                    step={0.1}
                    value={draft[key]}
                    onChange={(e) => setNum(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ing-def-grams" className="text-xs">
              Default amount when picked (g/ml)
            </Label>
            <Input
              id="ing-def-grams"
              type="number"
              min={1}
              step={1}
              className="w-32"
              value={draft.lastUsedGrams}
              onChange={(e) => setNum("lastUsedGrams", e.target.value)}
            />
          </div>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.name.trim()}>
              {initial ? "Save changes" : "Add ingredient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function IngredientsPage() {
  const { meals } = useMealPlanner();
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } =
    useIngredientLibrary(meals);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IngredientDef | null>(null);

  useEffect(() => { document.title = "Meal Planner · Ingredients"; }, []);

  const sorted = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
  const filtered = search.trim()
    ? sorted.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  function handleDelete(def: IngredientDef) {
    deleteIngredient(def.id);
    toast(`"${def.name}" removed`, {
      action: {
        label: "Undo",
        onClick: () => {
          addIngredient({
            name: def.name,
            caloriesPer100g: def.caloriesPer100g,
            proteinPer100g: def.proteinPer100g,
            fatPer100g: def.fatPer100g,
            carbsPer100g: def.carbsPer100g,
            lastUsedGrams: def.lastUsedGrams,
          });
        },
      },
      duration: 5000,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main id="main-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-[clamp(2rem,8vw,3.25rem)] font-[500] leading-none"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em', fontOpticalSizing: 'auto' } as React.CSSProperties}
              >Ingredients</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} · reusable in any meal
              </p>
            </div>
            <Button
              className="active:scale-95 transition-transform duration-100"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add ingredient
            </Button>
          </div>

          {ingredients.length > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients…"
                className="pl-9"
              />
            </div>
          )}

          {ingredients.length === 0 ? (
            <div className="border border-dashed border-border rounded-3xl py-16 px-8 text-center bg-surface-soft/50">
              <div className="text-5xl mb-6 select-none" aria-hidden>🧂</div>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                No ingredients yet. They're added automatically when you save meals
                with ingredients — or add one manually.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              No ingredients match <span className="font-medium text-foreground">"{search}"</span>
            </div>
          ) : (
            <div className="border border-border rounded-2xl bg-background overflow-hidden">
              <div className="grid grid-cols-[1fr_repeat(4,3.5rem)_4rem_5rem] gap-2 items-center px-4 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border bg-surface-soft/50">
                <span>Name</span>
                <span className="text-right leading-tight">kcal<br /><span className="text-[8px] normal-case tracking-normal opacity-70">/100g</span></span>
                <span className="text-right leading-tight">protein<br /><span className="text-[8px] normal-case tracking-normal opacity-70">/100g</span></span>
                <span className="text-right leading-tight">fat<br /><span className="text-[8px] normal-case tracking-normal opacity-70">/100g</span></span>
                <span className="text-right leading-tight">carbs<br /><span className="text-[8px] normal-case tracking-normal opacity-70">/100g</span></span>
                <span className="text-right">default</span>
                <span />
              </div>
              <p className="sr-only">Macro values are per 100g</p>
              {filtered.map((def) => (
                <div
                  key={def.id}
                  className="grid grid-cols-[1fr_repeat(4,3.5rem)_4rem_5rem] gap-2 items-center px-4 py-2 text-xs border-b border-border last:border-b-0 hover:bg-surface-soft/40 transition-colors"
                >
                  <span className="font-medium truncate">{def.name}</span>
                  <span className="text-right tabular-nums">{Math.round(def.caloriesPer100g)}</span>
                  <span className="text-right tabular-nums">{Math.round(def.proteinPer100g * 10) / 10}g</span>
                  <span className="text-right tabular-nums">{Math.round(def.fatPer100g * 10) / 10}g</span>
                  <span className="text-right tabular-nums">{Math.round(def.carbsPer100g * 10) / 10}g</span>
                  <span className="text-right tabular-nums text-muted-foreground">{Math.round(def.lastUsedGrams)}g</span>
                  <span className="flex justify-end gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditing(def)}
                          aria-label={`Edit ${def.name}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(def)}
                          aria-label={`Delete ${def.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground mt-4">
            Per-100g values. "Default" is the amount pre-filled when you pick the
            ingredient in a meal — it updates to the last amount you used. Edits here
            don't change meals that already use an ingredient.
          </p>

          <IngredientDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            onSave={(data) => {
              addIngredient(data);
              toast.success(`"${data.name}" added`);
            }}
          />
          {editing && (
            <IngredientDialog
              open={!!editing}
              onOpenChange={(v) => { if (!v) setEditing(null); }}
              initial={editing}
              onSave={(data) => {
                updateIngredient(editing.id, data);
                setEditing(null);
                toast.success(`"${data.name}" updated`);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
