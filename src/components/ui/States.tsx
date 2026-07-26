import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
}

/** An empty screen is an invitation to act, not an apology. */
export function EmptyState({ title, description, icon = "Inbox", action, className }: EmptyStateProps) {
  return (
    <div className={cn("card flex flex-col items-center px-6 py-10 text-center", className)}>
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-haze text-muted">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-2.5 px-6 py-10 text-sm text-slate", className)}
    >
      <Icon name="Loader2" className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  /** "config" is used when an integration simply isn't connected yet. */
  variant?: "error" | "config";
}

/** Errors explain what happened and what to do. They don't apologise or hedge. */
export function ErrorState({
  title, description, action, className, variant = "error",
}: ErrorStateProps) {
  const isConfig = variant === "config";
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border p-4",
        isConfig ? "border-info/25 bg-info-soft" : "border-danger/25 bg-danger-soft",
        className,
      )}
    >
      <div className="flex gap-3">
        <Icon
          name={isConfig ? "Info" : "AlertCircle"}
          className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", isConfig ? "text-info" : "text-danger")}
        />
        <div className="min-w-0">
          {title && (
            <p className={cn("font-display text-sm font-semibold", isConfig ? "text-info" : "text-danger")}>
              {title}
            </p>
          )}
          <p className={cn("text-sm", title && "mt-1", isConfig ? "text-charcoal" : "text-charcoal")}>
            {description}
          </p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

interface SuccessStateProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({ title, description, action, className }: SuccessStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-xl border border-success/25 bg-success-soft p-5", className)}
    >
      <div className="flex gap-3">
        <Icon name="CheckCircle2" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-ink">{title}</p>
          {description && <div className="mt-1.5 text-sm text-charcoal">{description}</div>}
          {action && <div className="mt-4 flex flex-wrap gap-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
