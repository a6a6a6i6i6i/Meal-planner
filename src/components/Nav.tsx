import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export default function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-foreground px-3 py-2 rounded-md",
      isActive
        ? "text-foreground bg-accent"
        : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <div className="flex items-center gap-2 mr-2">
          <UtensilsCrossed className="h-5 w-5" />
          <span className="font-semibold text-sm">Meal Planner</span>
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
