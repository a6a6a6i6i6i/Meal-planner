import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const isIdle = useIdleTimer(10_000);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
      <div className="meal-library-header-enter flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-[52px] font-[500] leading-none"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em', fontOpticalSizing: 'auto' } as React.CSSProperties}
          >Meal Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} saved
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

      {meals.length === 0 ? (
        <div className="empty-state-breathe border border-dashed border-border rounded-3xl p-16 text-center bg-surface-soft/50">
          <p className="text-muted-foreground text-sm font-medium">No meals yet.</p>
          <p className="text-muted-foreground text-sm mt-1">Add your first meal to get started.</p>
          <Button className="mt-6 active:scale-95 transition-transform duration-100" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add meal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {meals.map((meal, i) => (
            <MealCard
              key={meal.id}
              meal={meal}
              cardIndex={i}
              onEdit={() => setEditing(meal)}
              onDelete={() => {
                onDelete(meal.id);
                toast.success(`"${meal.name}" removed from library`);
              }}
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
