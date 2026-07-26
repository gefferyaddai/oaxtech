import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "info" | "warning" | "danger" | "neutral";

const toneClass: Record<BadgeTone, string> = {
  success: "bg-success-soft text-success border-success/20",
  info: "bg-info-soft text-info border-info/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  neutral: "bg-haze text-slate border-line",
};

/**
 * Status is never signalled by colour alone — every badge carries a text label,
 * and an optional icon, so it remains readable in greyscale.
 */
const toneIcon: Record<BadgeTone, string> = {
  success: "Check",
  info: "Info",
  warning: "Clock",
  danger: "AlertCircle",
  neutral: "Minus",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ children, tone = "neutral", className, showIcon = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-2xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {showIcon && <Icon name={toneIcon[tone]} className="h-3 w-3" />}
      {children}
    </span>
  );
}
