"use client";

import { useEffect, useState } from "react";

/**
 * Mirrors the OS-level reduced-motion setting for JS-driven effects.
 * CSS transitions/animations are already blanket-disabled in globals.css;
 * this covers the effects that can't be stopped by CSS alone (IntersectionObserver
 * reveals, pointer-driven transforms, the View Transitions API).
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
