import { Icon } from "@/components/ui/Icon";
import { PlotterPass, SlideIn } from "@/components/ui/Motion";
import type { ProcessStep } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * The process, drawn as a dimensioned run.
 *
 * A drawing measures a span with a rule between two end ticks, with stations
 * marked along it. That is exactly what a process is, so the steps sit ON a
 * spine rather than floating as a row of circles: the spine is a real rule,
 * each step is a square station plate stamped with its number, and the last
 * station is filled solid because it is the one you are being sold.
 *
 * The spine runs horizontally from `xl` and vertically below it, where a
 * five-across row would crush each step into a three-word column.
 */

/** Which ground the spine is drawn on. */
type Tone = "ink" | "paper";

function Station({ step, isLast, tone }: { step: ProcessStep; isLast: boolean; tone: Tone }) {
  const onInk = tone === "paper";

  /* Renders the station's contents only. The list item itself is the SlideIn
     wrapper in `Spine` — nesting an <li> inside an <li> is invalid, and the
     animation has to own the element that flexes. */
  return (
    <>
      {/* Station plate. Square, ruled, numbered — the number is the station
          mark, so it stays visible rather than being replaced on hover. */}
      <div className="relative z-10 flex shrink-0 flex-col items-center xl:items-start">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center border-rule transition-colors duration-200 ease-draft",
            onInk ? "border-ink-text" : "border-graphite",
            isLast
              ? "bg-revision text-white"
              : onInk
                ? "bg-ink-card text-white group-hover:bg-white group-hover:text-ink"
                : "bg-chalk text-graphite group-hover:bg-graphite group-hover:text-sheet",
          )}
        >
          <Icon name={step.icon} className="h-5 w-5" />
        </span>
        {/* Vertical spine segment, below xl where the stations stack */}
        {!isLast && (
          <span
            aria-hidden="true"
            className={cn("mt-1 w-0.5 flex-1 xl:hidden", onInk ? "bg-ink-line" : "bg-line")}
          />
        )}
      </div>

      <div className="min-w-0 pb-10 xl:pb-0 xl:pr-8 xl:pt-6">
        <div className="flex items-baseline gap-2">
          <span
            aria-hidden="true"
            className={cn("tally font-mono nums", onInk ? "text-revision-onInk" : "text-revision-text")}
          >
            {String(step.step).padStart(2, "0")}
          </span>
          <h3
            className={cn(
              "font-display text-xl font-bold uppercase leading-none",
              onInk ? "text-white" : "text-graphite",
            )}
          >
            {step.label}
          </h3>
        </div>
        <p
          className={cn(
            "mt-2.5 max-w-[30ch] text-sm leading-relaxed",
            onInk ? "text-ink-text" : "text-pencil",
          )}
        >
          {step.description}
        </p>
      </div>
    </>
  );
}

function Spine({ steps, className, tone }: { steps: ProcessStep[]; className?: string; tone: Tone }) {
  const onInk = tone === "paper";

  return (
    <div className={cn("relative", className)}>
      {/* The horizontal spine. Sits behind the station plates at their vertical
          centre, with end ticks, and is hidden wherever the layout stacks — a
          rule that does not connect anything is noise.

          A plotter head travels its length once as the section enters view,
          laying the line down behind it. The stations then strike in sequence
          behind the head, so the process is drawn in the order you read it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-7 hidden -translate-y-1/2 items-center xl:flex"
      >
        <span className={cn("h-3 w-0.5 shrink-0", onInk ? "bg-white" : "bg-graphite")} />
        <PlotterPass className="flex-1" tone={onInk ? "paper" : "ink"} duration={1500} />
        <span className={cn("h-3 w-0.5 shrink-0", onInk ? "bg-white" : "bg-graphite")} />
      </div>

      <ol className="relative flex flex-col xl:flex-row">
        {steps.map((step, index) => (
          <SlideIn
            as="li"
            key={step.label}
            from="up"
            /* Paced to trail the plotter head across the spine. */
            delay={index * 190}
            className="group relative flex gap-5 xl:flex-1 xl:flex-col xl:gap-0"
          >
            <Station step={step} tone={tone} isLast={index === steps.length - 1} />
          </SlideIn>
        ))}
      </ol>
    </div>
  );
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
  /** Which ground the spine is drawn on. */
  tone?: Tone;
  /** Kept for API compatibility. Stations are always numbered — a process is
      a sequence, and the number is the station mark. */
  numbered?: boolean;
}

export function ProcessSteps({ steps, className, tone = "ink" }: ProcessStepsProps) {
  return <Spine steps={steps} className={className} tone={tone} />;
}

interface ProcessStepsRowProps {
  steps: ProcessStep[];
  className?: string;
  tone?: Tone;
}

/** Horizontal variant. Same spine — the row/grid distinction the old design
    drew between these two is gone, because the spine handles both. */
export function ProcessStepsRow({ steps, className, tone = "ink" }: ProcessStepsRowProps) {
  return <Spine steps={steps} className={className} tone={tone} />;
}
