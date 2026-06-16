import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MealCard from "./MealCard";
import MealForm from "./MealForm";
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meal Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meals.length} meal{meals.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add meal
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm">No meals yet.</p>
          <p className="text-muted-foreground text-sm">Add your first meal to get started.</p>
          <Button className="mt-4" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add meal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
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
