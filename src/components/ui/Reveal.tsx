"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms — pass index * 80 for a list. */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}

/**
 * Scroll-triggered reveal. IntersectionObserver + a CSS class toggle rather
 * than `animation-timeline: view()`, since that CSS-native path still isn't
 * supported in Safari or Firefox stable — this is the reliable cross-browser
 * version of the same idea, at ~30 lines and zero dependencies.
 *
 * Fires once (unobserves after reveal) so scrolling back up doesn't re-hide
 * content — a page shouldn't make the visitor wait for their own copy twice.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
