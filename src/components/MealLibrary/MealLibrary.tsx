import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MealCard from "./MealCard";
import MealForm from "./MealForm";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import type { Meal } from "@/types";

interface MealLibraryProps {
  meals: Meal[];
  onAdd: (data: Omit<Meal, "id">) => void;
  onUpdate: (id: string, data: Omit<Meal, "id">) => void;
  onDelete: (id: string) => void;
}

export default function MealLibrary({ meals, onAdd, onUpdate, onDelete }: MealLibraryProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [search, setSearch] = useState("");
  const isIdle = useIdleTimer(10_000);

  const filteredMeals = search.trim()
    ? meals.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : meals;

  function handleDelete(meal: Meal) {
    onDelete(meal.id);
    toast(`"${meal.name}" removed`, {
      action: {
        label: "Undo",
        onClick: () => {
          onAdd({
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            fat: meal.fat,
            carbs: meal.carbs,
            ingredients: meal.ingredients,
          });
        },
      },
      duration: 5000,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-10">
      <div className="meal-library-header-enter flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-[clamp(2rem,8vw,3.25rem)] font-[500] leading-none"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em', fontOpticalSizing: 'auto' } as React.CSSProperties}
          >Meal Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {meals.length} meal{meals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className={`btn-shimmer-wrapper ${isIdle ? "is-idle" : ""}`}>
          <Button
            className="active:scale-95 transition-transform duration-100"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add meal
          </Button>
        </span>
      </div>

      {meals.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meals…"
            className="pl-9"
          />
        </div>
      )}

      {meals.length === 0 ? (
        <div className="empty-state-breathe border border-dashed border-border rounded-3xl py-20 px-8 text-center bg-surface-soft/50">
          <div className="text-5xl mb-6 select-none" aria-hidden>🥗</div>
          <h2
            className="text-2xl font-[500] tracking-[-0.02em] leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)', fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            Your meal library is empty
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto text-pretty leading-relaxed">
            Add your go-to meals here. Once they're in, planning any week takes under 2 minutes.
          </p>
          <p className="text-xs text-muted-foreground mt-3 opacity-70">
            Start with 5–8 regulars — breakfast staples, easy lunches, favourite dinners.
          </p>
          <Button className="mt-8 active:scale-95 transition-transform duration-100" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add your first meal
          </Button>
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          No meals match <span className="font-medium text-foreground">"{search}"</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMeals.map((meal, i) => (
            <MealCard
              key={meal.id}
              meal={meal}
              cardIndex={i}
              onEdit={() => setEditing(meal)}
              onDelete={() => handleDelete(meal)}
            />
          ))}
        </div>
      )}

      <MealForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={(data) => {
          onAdd(data);
          toast.success(`"${data.name}" added to library`);
        }}
      />

      {editing && (
        <MealForm
          open={!!editing}
          onOpenChange={(v) => { if (!v) setEditing(null); }}
          initial={editing}
          onSave={(data) => {
            onUpdate(editing.id, data);
            setEditing(null);
            toast.success(`"${data.name}" updated`);
          }}
        />
      )}
    </div>
  );
}
