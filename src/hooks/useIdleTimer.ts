import { useState, useEffect, useRef } from "react";

export function useIdleTimer(ms: number): boolean {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), ms);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ms]);

  return idle;
}
