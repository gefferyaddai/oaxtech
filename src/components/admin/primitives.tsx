import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* PageHeader                                                                  */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Rendered above the title — greeting, breadcrumb, eyebrow. */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow}
        <h1 className="font-display text-display-xs text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AdminCard — the shared surface for every panel                              */
/* -------------------------------------------------------------------------- */

interface AdminCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Removes body padding, for cards whose content is a full-bleed table. */
  flush?: boolean;
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
  flush,
}: AdminCardProps) {
  return (
    <section className={cn("card min-w-0 overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {title && (
              <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
            )}
            {description && <p className="mt-0.5 text-xs text-slate">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(!flush && "p-4 sm:p-5")}>{children}</div>
    </section>
  );
}

/** Alias kept because the brief names it explicitly. Charts are just cards. */
export const ChartCard = AdminCard;

/* -------------------------------------------------------------------------- */
/* MetricCard                                                                  */
/* -------------------------------------------------------------------------- */

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  href: string;
  /** Short comparison or status line, e.g. "+2 vs last week". */
  comparison?: string;
  /**
   * Direction of the comparison. Drives an arrow icon so the meaning does not
   * rely on colour alone.
   */
  trend?: "up" | "down" | "flat";
  /** Set when "up" is bad — overdue invoices, open tickets. */
  invertTrend?: boolean;
}

export function MetricCard({
  label,
  value,
  icon,
  href,
  comparison,
  trend = "flat",
  invertTrend,
}: MetricCardProps) {
  const good = trend === "flat" ? null : invertTrend ? trend === "down" : trend === "up";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";

  return (
    <Link
      href={href}
      className="card card-interactive group flex min-w-0 items-start gap-3 p-4 focus-visible:outline-2"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt"
      >
        <Icon name={icon} className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs text-slate">{label}</span>
        <span className="mt-0.5 block font-display text-xl font-semibold text-ink">{value}</span>
        {comparison && (
          <span
            className={cn(
              "mt-1 flex items-center gap-1 text-2xs font-medium",
              good === null ? "text-muted" : good ? "text-success" : "text-danger",
            )}
          >
            <Icon name={trendIcon} className="h-3 w-3 shrink-0" />
            {comparison}
          </span>
        )}
      </span>
      <Icon
        name="ArrowUpRight"
        className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-cobalt"
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* ProgressBar                                                                 */
/* -------------------------------------------------------------------------- */

interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
  /** Shows the numeric value beside the track. */
  showValue?: boolean;
  tone?: "cobalt" | "success" | "warning" | "danger";
}

export function ProgressBar({
  value,
  label,
  className,
  showValue,
  tone = "cobalt",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const fill = {
    cobalt: "bg-cobalt",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[tone];

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-haze">
        <div
          className={cn("h-full rounded-full", fill)}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
      {showValue && (
        <span className="shrink-0 text-2xs tabular-nums text-slate">{clamped}%</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Monogram only. No employee photographs are invented — if approved artwork
 * ever exists it should be added here explicitly.
 */
export function Avatar({
  initials,
  name,
  className,
}: {
  initials: string;
  name: string;
  className?: string;
}) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-haze text-2xs font-semibold text-charcoal",
        className,
      )}
    >
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* DemoDataNotice                                                              */
/* -------------------------------------------------------------------------- */

export function DemoDataNotice({ notice }: { notice: string }) {
  return (
    <div className="flex items-start gap-2.5 border-b border-warning/25 bg-warning-soft px-4 py-2.5 sm:px-6">
      <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-xs leading-relaxed text-charcoal">
        <span className="font-semibold">Demo data.</span>{" "}
        {notice.replace(/^Demo data\.\s*/, "")}
      </p>
    </div>
  );
}
