"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Pulls an element a few pixels toward the cursor while hovered — a "magnetic"
 * button. Pure pointermove + CSS transform, no animation library: the effect
 * is a handful of multiplications, which is exactly the case the brief calls
 * out as not needing a JS animation dependency.
 *
 * `strength` is the fraction of the pointer offset the element travels;
 * keep it small (0.2–0.35) so the element still tracks the cursor, not chases it.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;
    // Touch devices have no hover-tracking cursor to magnetize toward.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onPointerMove(event: PointerEvent) {
      const rect = node!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      node!.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    }

    function onPointerLeave() {
      node!.style.transform = "translate(0, 0)";
    }

    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerleave", onPointerLeave);
    return () => {
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [strength, reducedMotion]);

  return ref;
}
