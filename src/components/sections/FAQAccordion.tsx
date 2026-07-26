"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FAQ } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQ[];
  /** Two balanced columns on large screens, matching the mockups. */
  columns?: 1 | 2;
  className?: string;
}

/**
 * Native <button> + aria-expanded/aria-controls. Fully keyboard operable:
 * Tab to move between questions, Enter/Space to toggle.
 */
export function FAQAccordion({ items, columns = 2, className }: FAQAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "md:grid-cols-2 md:gap-x-4",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div
            key={item.question}
            className={cn(
              "card h-fit transition-colors",
              isOpen && "border-line-strong",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
              >
                <span className="font-display text-sm font-medium text-ink sm:text-base">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform",
                    isOpen && "rotate-45 border-cobalt text-cobalt",
                  )}
                >
                  <Icon name="Plus" className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="border-t border-line-subtle px-4 py-4 text-sm leading-relaxed text-slate sm:px-5">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
