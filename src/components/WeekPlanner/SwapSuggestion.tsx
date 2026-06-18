import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Meal, SwapSuggestion as SwapSuggestionType } from "@/types";

interface SwapSuggestionProps {
  suggestion: SwapSuggestionType | null;
  meals: Meal[];
  onAccept: () => void;
}

export default function SwapSuggestion({ suggestion, meals, onAccept }: SwapSuggestionProps) {
  if (!suggestion) return null;

  const from = meals.find((m) => m.id === suggestion.replaceMealId);
  const to = meals.find((m) => m.id === suggestion.suggestMealId);
  if (!from || !to) return null;

  const calDelta = Math.round(suggestion.calDelta);
  const proteinDelta = Math.round(suggestion.proteinDelta * 10) / 10;

  return (
    <div className="swap-appear mt-1 rounded-2xl bg-brand-lavender/15 border border-brand-lavender/30 p-2.5 space-y-1.5">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'hsl(256 50% 38%)' }}>
        <Lightbulb className="h-3 w-3" />
        Swap suggestion
      </div>
      <div className="flex items-center gap-1 text-[10px] text-foreground/70">
        <span className="font-medium truncate max-w-[60px]">{from.name}</span>
        <ArrowRight className="h-3 w-3 shrink-0" style={{ color: 'hsl(256 50% 38%)' }} />
        <span className="font-medium truncate max-w-[60px]">{to.name}</span>
      </div>
      <div className="text-[10px] text-muted-foreground">
        {calDelta < 0 ? `saves ${Math.abs(calDelta)} kcal` : `+${calDelta} kcal`}
        {proteinDelta !== 0 && ` · ${proteinDelta > 0 ? "+" : ""}${proteinDelta}g protein`}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-full text-[10px] px-2 active:scale-95 transition-transform duration-100"
        style={{ borderColor: 'hsl(256 50% 38% / 0.4)', color: 'hsl(256 50% 38%)', backgroundColor: 'hsl(256 67% 79% / 0.12)' }}
        onClick={onAccept}
      >
        Apply swap
      </Button>
    </div>
  );
}
