"use client";

import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticWrapProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Wraps a single interactive child (a button, typically) with the magnetic
 * pointer-follow effect. Kept as an opt-in wrapper rather than baked into
 * <Button> itself — this is the one moment of pointer delight the brief
 * calls for, not a default every CTA on the site should carry.
 */
export function MagneticWrap({ children, className, strength }: MagneticWrapProps) {
  const ref = useMagnetic<HTMLSpanElement>(strength);
  return (
    <span ref={ref} className={cn("magnetic inline-flex", className)}>
      {children}
    </span>
  );
}
