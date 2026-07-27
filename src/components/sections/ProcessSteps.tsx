import { Icon } from "@/components/ui/Icon";
import type { ProcessStep } from "@/data/services";
import { cn } from "@/lib/utils";

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
  /** Show the numeric marker. Only true when the order genuinely matters. */
  numbered?: boolean;
}

/**
 * The connecting line is decorative and hidden below `lg`, where the steps
 * stack vertically instead. Numbering is on by default here because a process
 * IS a sequence — the order carries real information for the reader.
 */
export function ProcessSteps({ steps, className, numbered = true }: ProcessStepsProps) {
  return (
    <ol className={cn("relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}
        style={{ gridTemplateColumns: undefined }}>
      {/* Connector rendered only on wide screens where the steps sit in a row */}
      <li
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[10%] top-7 hidden border-t border-dashed border-line xl:block"
        style={{ gridArea: "1 / 1 / 2 / -1" }}
      />
      {steps.map((step) => (
        <li key={step.label} className="group relative flex flex-col items-center text-center xl:flex-1">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-cobalt shadow-card transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-cobalt-border group-hover:shadow-card-hover">
            <Icon name={step.icon} className="h-5 w-5" />
          </span>
          <p className="font-display text-sm font-semibold text-ink">
            {numbered && <span className="text-muted">{step.step}. </span>}
            {step.label}
          </p>
          <p className="mt-2 max-w-[22ch] text-sm leading-relaxed text-slate">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

interface ProcessStepsRowProps {
  steps: ProcessStep[];
  className?: string;
}

/** Horizontal variant used where the mockups show a single wide row. */
export function ProcessStepsRow({ steps, className }: ProcessStepsRowProps) {
  return (
    <ol
      className={cn(
        "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
        steps.length === 4 && "xl:grid-cols-4",
        steps.length === 5 && "xl:grid-cols-5",
        steps.length === 6 && "xl:grid-cols-6",
        className,
      )}
    >
      {steps.map((step) => (
        <li key={step.label} className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-cobalt">
            <Icon name={step.icon} className="h-5 w-5" />
          </span>
          <p className="font-display text-sm font-semibold text-ink">
            <span className="mr-1 text-muted">{step.step}</span>
            {step.label}
          </p>
          <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-slate">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
