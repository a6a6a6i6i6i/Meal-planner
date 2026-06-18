import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-[400] tracking-[-0.03em] [font-family:var(--font-display)] [font-optical-sizing:auto]">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
