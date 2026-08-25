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
          /* A ruled register of questions rather than a stack of cards. The
             open row inks its number block solid, so the open state is a mark
             on the sheet instead of a border-colour change nobody notices. */
          <div
            key={item.question}
            className={cn(
              "h-fit border-t-rule transition-colors duration-200",
              isOpen ? "border-revision" : "border-graphite",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="group flex w-full items-start gap-4 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "tally mt-0.5 flex h-6 w-7 shrink-0 items-center justify-center font-mono tabular-nums transition-colors duration-200",
                    isOpen
                      ? "bg-revision text-white"
                      : "bg-sheet-deep text-graphite group-hover:bg-graphite group-hover:text-sheet",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 font-display text-base font-bold uppercase leading-tight text-graphite sm:text-lg">
                  {item.question}
                </span>

                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border border-graphite text-graphite transition-transform duration-200",
                    isOpen && "rotate-45 bg-graphite text-sheet",
                  )}
                >
                  <Icon name="Plus" className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="max-w-prose pb-5 pl-11 text-sm leading-relaxed text-pencil">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
