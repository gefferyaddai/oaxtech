"use client";

import { Icon } from "@/components/ui/Icon";

/**
 * Inline failure state for a single dashboard section.
 *
 * Deliberately kept in its own module rather than alongside the charts:
 * `SectionBoundary` wraps every panel, and importing this from `charts.tsx`
 * would pull Recharts into the bundle of every page that uses a boundary —
 * including pages with no chart on them at all.
 */
export function SectionFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Icon name="AlertCircle" className="h-5 w-5 text-danger" />
      <p className="text-sm font-medium text-ink">This section could not be displayed</p>
      <p className="max-w-xs text-xs text-slate">The rest of the dashboard is unaffected.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-sm btn-neutral mt-1">
          <Icon name="RefreshCw" className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
