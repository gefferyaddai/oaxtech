"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps<T extends string> {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
  label: string;
  /** Optional per-option result count, announced to screen readers. */
  counts?: Record<string, number>;
  className?: string;
}

/**
 * Client-side filter control.
 *
 * Implemented with real <button> elements in a group rather than a tablist,
 * because the filtered content lives below as a single list rather than in
 * separate panels. Fully keyboard operable via normal tab order.
 */
export function FilterTabs<T extends string>({
  options, active, onChange, label, counts, className,
}: FilterTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isActive = option === active;
        const count = counts?.[option];
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={cn(
              "inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
              isActive
                ? "border-cobalt bg-cobalt font-medium text-white"
                : "border-line bg-paper text-slate hover:border-line-strong hover:text-ink",
            )}
          >
            {option}
            {typeof count === "number" && (
              <span className={cn("text-xs", isActive ? "text-white/70" : "text-muted")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
