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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:bg-background focus:border focus:border-border focus:rounded-md focus:shadow-sm"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 mr-2 sm:mr-4">
          <UtensilsCrossed className="h-5 w-5 text-foreground shrink-0" />
          <span
            className="hidden sm:inline text-[1.1rem] font-[500] leading-none tracking-[-0.01em] [font-family:var(--font-display)] [font-optical-sizing:auto]"
          >Meal Planner</span>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Planner
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            <span className="sm:hidden">Library</span>
            <span className="hidden sm:inline">Meal Library</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
