import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export default function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors px-4 py-1.5 rounded-full",
      isActive
        ? "bg-surface-card text-foreground"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <div className="flex items-center gap-2 mr-4">
          <UtensilsCrossed className="h-5 w-5 text-foreground" />
          <span
            className="text-[1.1rem] font-[500] leading-none tracking-[-0.01em] [font-family:var(--font-display)] [font-optical-sizing:auto]"
          >Meal Planner</span>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Planner
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            Meal Library
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
