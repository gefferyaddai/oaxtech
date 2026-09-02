import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * THE DRAWING VOCABULARY
 * ============================================================================
 *
 * The primitives every section on this site is assembled from. A drawing sheet
 * has a small, fixed set of parts — a bordered field, a title block, drawing
 * numbers, revision stamps, dimension lines, hatched voids — and the whole
 * design system is those parts and nothing else.
 *
 * Two rules hold the world together:
 *
 *   1. Rank is carried by RULE WEIGHT, never by colour or shadow. A bar rule
 *      opens a section, a heavy rule opens a subsection, a hairline separates
 *      rows.
 *   2. State is a MARK, never a fade. Things ink in, snap into register, or
 *      flip solid. Nothing on this site changes state by adjusting opacity,
 *      because a drawing cannot be half-drawn.
 */

/* -------------------------------------------------------------------------- */
/* Corner ticks                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Registration ticks at all four corners of a field.
 *
 * The `.sheet-frame` CSS class covers the common two-corner case with
 * pseudo-elements and no markup. This exists for the hero and the section
 * frames, where all four corners are visible and the extra four spans earn
 * their place.
 */
export function CornerTicks({
  className,
  tone = "ink",
  size = "0.875rem",
}: {
  className?: string;
  tone?: "ink" | "revision" | "paper";
  size?: string;
}) {
  const color =
    tone === "revision"
      ? "border-revision"
      : tone === "paper"
        ? "border-sheet"
        : "border-graphite";

  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {(
        [
          ["top-0 left-0", "border-t-2 border-l-2"],
          ["top-0 right-0", "border-t-2 border-r-2"],
          ["bottom-0 left-0", "border-b-2 border-l-2"],
          ["bottom-0 right-0", "border-b-2 border-r-2"],
        ] as const
      ).map(([position, edges]) => (
        <span
          key={position}
          className={cn("absolute", position, edges, color)}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Title block                                                                */
/* -------------------------------------------------------------------------- */

export interface TitleBlockField {
  label: string;
  value: string;
}

/**
 * The signature component. On a real drawing the title block sits at the
 * bottom-right of the sheet and records what the drawing is, who drew it and
 * which revision you are looking at. Here it does the same job for a section:
 * it names the sheet and carries the metadata the display type has no room for.
 *
 * Fields are laid out as a rule-separated row so the block reads as a stamped
 * record rather than a caption.
 */
export function TitleBlock({
  fields,
  className,
  tone = "ink",
}: {
  fields: TitleBlockField[];
  className?: string;
  tone?: "ink" | "paper";
}) {
  const onInk = tone === "paper";

  return (
    <dl
      className={cn(
        "flex flex-wrap border-rule",
        onInk ? "border-ink-text/60 text-ink-text" : "border-graphite text-graphite",
        className,
      )}
    >
      {fields.map((field, index) => (
        <div
          key={field.label}
          className={cn(
            "flex min-w-0 flex-col gap-1 px-3 py-2 first:pl-0",
            index > 0 && "border-l",
            onInk ? "border-ink-line" : "border-line",
          )}
        >
          <dt className={cn("tally", onInk ? "text-ink-muted" : "text-faint")}>{field.label}</dt>
          <dd
            className={cn(
              "font-mono text-xs font-semibold uppercase tracking-wider nums",
              onInk ? "text-white" : "text-graphite",
            )}
          >
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawing number                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The sheet number, set oversized in the display face and used as a graphic
 * element in its own right. Drawing sets number every sheet; here the number
 * doubles as the section's visual anchor.
 */
export function DrawingNo({
  value,
  className,
  tone = "ink",
}: {
  value: string;
  className?: string;
  tone?: "ink" | "revision" | "faint" | "paper";
}) {
  const color = {
    ink: "text-graphite",
    revision: "text-revision",
    faint: "text-line",
    paper: "text-white/25",
  }[tone];

  return (
    <span
      aria-hidden="true"
      className={cn("select-none font-display text-display-lg font-extrabold leading-none nums", color, className)}
    >
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Revision stamp                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A rotated, double-ruled stamp. Used sparingly — a stamp everywhere is a
 * stamp nowhere. It marks the one thing on a sheet that is genuinely stamped:
 * an approval, a status, a date.
 */
export function RevisionStamp({
  children,
  className,
  tone = "revision",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "revision" | "ink" | "paper";
}) {
  const color = {
    revision: "border-revision text-revision",
    ink: "border-graphite text-graphite",
    paper: "border-ink-text text-ink-text",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex -rotate-[4deg] items-center gap-2 border-rule px-3 py-1.5",
        "font-mono text-tally font-bold uppercase tracking-[0.16em]",
        "shadow-[inset_0_0_0_1px_currentColor]",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Dimension line                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A measured span: end ticks, a rule between them, and a label sitting on the
 * rule. This is how the sheet points at things — it replaces the decorative
 * arrows and connector dots the old design used, and unlike them it carries a
 * value.
 *
 * The rule draws in from the left when revealed (`animate-rule-draw`), which
 * is the one place motion is literal: a dimension is drawn, not faded in.
 */
export function DimensionLine({
  label,
  className,
  tone = "ink",
  animated = true,
}: {
  label?: string;
  className?: string;
  tone?: "ink" | "revision" | "paper";
  animated?: boolean;
}) {
  const stroke = {
    ink: "bg-graphite",
    revision: "bg-revision",
    paper: "bg-ink-text",
  }[tone];
  const text = {
    ink: "text-graphite",
    revision: "text-revision-text",
    paper: "text-ink-text",
  }[tone];

  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className={cn("h-3 w-0.5 shrink-0", stroke)} />
      <span className={cn("relative h-px min-w-6 flex-1", stroke)}>
        <span
          className={cn(
            "absolute inset-0 origin-left",
            stroke,
            animated && "animate-rule-draw",
          )}
        />
      </span>
      {label && (
        <span className={cn("tally shrink-0 whitespace-nowrap font-mono", text)}>{label}</span>
      )}
      <span className={cn("relative h-px min-w-6 flex-1", stroke)} />
      <span className={cn("h-3 w-0.5 shrink-0", stroke)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Arrow link                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The site's standard forward action. The arrow travels on hover and, on the
 * primary instances, runs a slow idle loop — the brief asks for animated
 * arrows, and an arrow that only moves on hover is invisible to a visitor
 * scanning a page on a touch screen.
 */
export function ArrowLink({
  href,
  children,
  className,
  tone = "ink",
  idle = false,
  srSuffix,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "revision" | "paper";
  /** Run the slow idle arrow loop. Reserve for the one action per section. */
  idle?: boolean;
  /** Appended, visually hidden, so repeated "Learn more" links stay distinct. */
  srSuffix?: string;
}) {
  const color = {
    ink: "text-graphite decoration-line",
    revision: "text-revision-text decoration-revision/50",
    paper: "text-white decoration-ink-text/60",
  }[tone];

  return (
    <Link
      href={href}
      className={cn(
        "group/arrow inline-flex items-center gap-2 font-display text-base font-bold uppercase tracking-wide",
        "underline decoration-2 underline-offset-[6px] transition-colors",
        "hover:decoration-current",
        color,
        className,
      )}
    >
      {children}
      {srSuffix && <span className="sr-only"> {srSuffix}</span>}
      <Icon
        name="ArrowRight"
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 ease-draft",
          "group-hover/arrow:translate-x-1.5",
          idle && "motion-safe:animate-arrow-travel",
        )}
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Hatched panel                                                              */
/* -------------------------------------------------------------------------- */

/**
 * A hatched void.
 *
 * 45-degree hatching is the drafting convention for a cut or unbuilt area, and
 * it is the honest way to draw the parts of this site that have no content
 * yet — the testimonials and client results that do not exist and must not be
 * invented. A hatched field reads as "deliberately empty, drawn that way",
 * which is exactly the truth, and it looks like part of the design rather than
 * a broken section.
 */
export function HatchPanel({
  children,
  className,
  contentClassName,
  tone = "ink",
}: {
  children: React.ReactNode;
  /** Applied to the bordered container — border, sizing, ground. */
  className?: string;
  /**
   * Applied to the content layer.
   *
   * Layout classes belong here, not on `className`: the hatch is an absolutely
   * positioned sibling, so the content sits one level down and a `flex` or
   * `justify-between` set on the container has a single child to distribute
   * and therefore does nothing.
   */
  contentClassName?: string;
  tone?: "ink" | "revision" | "paper";
}) {
  const hatch = {
    ink: "hatch",
    revision: "hatch-revision",
    paper: "hatch-ink",
  }[tone];

  return (
    <div
      className={cn(
        "relative border-rule",
        tone === "paper" ? "border-ink-line" : "border-graphite",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("absolute inset-0", hatch)} />
      <div className={cn("relative h-full", contentClassName)}>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Angular edge                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The diagonal cut between two grounds.
 *
 * Rendered as its own element carrying the INCOMING section's colour, rather
 * than as a `clip-path` on the section itself. Clipping the section works, but
 * it silently clips the section's own first child too, and it is invisible in
 * a screenshot until you happen to catch the boundary — this version is a real
 * band you can see, measure and verify.
 *
 * Place it immediately BEFORE the section whose colour it carries.
 */
export function AngularEdge({
  tone,
  className,
  flip,
}: {
  /** The ground of the section this edge leads into. */
  tone: "ink" | "revision" | "sheet" | "sheet-sunk";
  className?: string;
  /** Slope down to the right instead of up. */
  flip?: boolean;
}) {
  const ground = {
    ink: "bg-ink",
    revision: "bg-revision",
    sheet: "bg-sheet",
    "sheet-sunk": "bg-sheet-sunk",
  }[tone];

  return (
    <div
      aria-hidden="true"
      className={cn("h-10 w-full md:h-16 lg:h-20", ground, className)}
      style={{
        clipPath: flip
          ? "polygon(0 0, 100% 0, 100% 100%, 0 0)"
          : "polygon(0 100%, 100% 0, 100% 100%, 0 100%)",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Arc edge                                                                    */
/* -------------------------------------------------------------------------- */

const EDGE_BG = {
  ink: "bg-ink",
  revision: "bg-revision",
  sheet: "bg-sheet",
  "sheet-sunk": "bg-sheet-sunk",
  /* The pale violet from the compatibility layer. Interior pages still use it
     as a band, so an edge has to be able to leave one. */
  tint: "bg-tint",
} as const;

const EDGE_FILL = {
  ink: "text-ink",
  revision: "text-revision",
  sheet: "text-sheet",
  "sheet-sunk": "text-sheet-sunk",
  tint: "text-tint",
} as const;

export type EdgeGround = keyof typeof EDGE_BG;

/**
 * The curved counterpart to AngularEdge: a shallow arc where two grounds meet.
 *
 * A drawing is not all straight lines. A radius is as much a drafting primitive
 * as a rule, and an arc is how a drawing shows a form that bends rather than
 * one that breaks. The rule this page follows is that the FULL-BLEED BANDS bow
 * and the paper sheets stay flat — so the square corner keeps meaning
 * something, and curvature marks the bands that lift off the stock rather than
 * being sprayed over everything.
 *
 * Unlike AngularEdge this takes BOTH grounds. An edge leaving a dark band has
 * transparent area above the curve, and that area shows the page body, not the
 * section overhead — so the outgoing ground has to be painted explicitly or the
 * exit edge tears a paper-coloured gap out of the band it is leaving.
 *
 * `preserveAspectRatio="none"` stretches the curve to any width, which is safe
 * here because the shape is a filled area with no stroke to distort.
 *
 * Place it immediately BETWEEN the two sections it joins.
 */
export function ArcEdge({
  from,
  to,
  className,
  flip,
  rule,
}: {
  /** Ground of the section ABOVE. Painted flat behind the curve. */
  from: EdgeGround;
  /** Ground of the section BELOW. Carried by the arc itself. */
  to: EdgeGround;
  className?: string;
  /** Bow downward (a trough) instead of upward (a crest). */
  flip?: boolean;
  /** Draw the arc as a visible line. On by default; pass false for a pure fill. */
  rule?: boolean;
}) {
  const area = flip
    ? "M0 80 L0 8 Q720 72 1440 8 L1440 80 Z"
    : "M0 80 L0 52 Q720 -12 1440 52 L1440 80 Z";
  const curve = flip ? "M0 8 Q720 72 1440 8" : "M0 52 Q720 -12 1440 52";

  /*
   * The arc is DRAWN, not merely implied by the colour change.
   *
   * Between the paper grounds the two values are #E4E5E8 and #D8DAE0 — close
   * enough that a filled curve alone is invisible, which is why this treatment
   * only registered on the homepage where it lands against ink and violet. A
   * radius on a drawing is a line with a defined centre, so drawing it is both
   * what makes the curve legible on the quiet grounds and the more correct
   * thing to put on a drawing.
   *
   * The stroke is non-scaling: `preserveAspectRatio="none"` stretches the
   * geometry to the viewport, which would otherwise smear a 1px line into a
   * wedge that is thick in the middle and hairline at the edges.
   */
  const ruleTone = to === "ink" || to === "revision" ? "text-revision-onInk/45" : "text-graphite/30";

  return (
    <div
      aria-hidden="true"
      className={cn("h-10 w-full md:h-16 lg:h-20", EDGE_BG[from], EDGE_FILL[to], className)}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-full w-full"
        focusable="false"
      >
        <path d={area} fill="currentColor" />
        {rule !== false && (
          <path
            d={curve}
            fill="none"
            className={ruleTone}
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Break line                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The drafting long-break line: a rule interrupted by a loop.
 *
 * On a real drawing it means "the view continues past this point, and the part
 * omitted is more of the same" — which is exactly what a boundary between two
 * sheets on the same ground is. It is the one curved element every engineering
 * drawing already carries, so it breaks the stacked-rectangle rhythm without
 * importing anything from outside the world.
 *
 * The glyph is a FIXED-WIDTH SVG between two flexible hairlines rather than one
 * stretched drawing. A `preserveAspectRatio="none"` squiggle flattens into a
 * wave on a wide viewport and bunches on a narrow one; this keeps the loop at
 * its drawn proportions at every width, which is the whole point of a
 * convention.
 *
 * `mark="datum"` swaps the loop for a centre mark — a circle with its centre
 * lines extended past the circumference, the drafting note for a located axis.
 */
export function BreakLine({
  tone = "sheet",
  mark = "break",
  className,
}: {
  tone?: "sheet" | "ink";
  mark?: "break" | "datum";
  className?: string;
}) {
  const rule = tone === "ink" ? "bg-ink-line" : "bg-line";
  const glyph = tone === "ink" ? "text-revision-onInk" : "text-graphite";

  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3", className)}>
      <span className={cn("h-px flex-1", rule)} />
      {mark === "datum" ? (
        <svg width="30" height="26" viewBox="0 0 30 26" className={cn("shrink-0", glyph)} focusable="false">
          <circle cx="15" cy="13" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <path d="M15 1.5V24.5M2 13h26" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 2" />
        </svg>
      ) : (
        <svg width="100" height="26" viewBox="0 0 100 26" className={cn("shrink-0", glyph)} focusable="false">
          <path
            d="M0 13c16 0 16-9 30-9s14 18 26 18 14-9 44-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className={cn("h-px flex-1", rule)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sheet section                                                              */
/* -------------------------------------------------------------------------- */

/**
 * A full section rendered as a numbered sheet: bar rule at the top, the sheet
 * number and title on the rule, and the title block at the foot.
 *
 * Sections that need a different composition compose the primitives directly
 * rather than fighting this wrapper — the brief asks for a different structure
 * per section, so this is a convenience, not a mould.
 */
export function SheetHeader({
  no,
  eyebrow,
  title,
  description,
  action,
  className,
  tone = "ink",
  align = "left",
}: {
  no: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  tone?: "ink" | "paper";
  align?: "left" | "center";
}) {
  const onInk = tone === "paper";
  const centered = align === "center";

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-t-[6px]",
          onInk ? "border-white" : "border-graphite",
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-6 pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10",
          centered && "sm:flex-col sm:items-center sm:text-center",
        )}
      >
        <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
          <div className="flex items-baseline gap-4">
            <span
              className={cn(
                "tally font-mono",
                onInk ? "text-revision-onInk" : "text-revision-text",
              )}
            >
              {no}
            </span>
            <span className={cn("tally font-mono", onInk ? "text-ink-muted" : "text-faint")}>
              {eyebrow}
            </span>
          </div>
          <h2
            className={cn(
              "mt-3 max-w-[18ch] text-display-lg",
              onInk ? "text-white" : "text-graphite",
              centered && "max-w-[22ch]",
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-4 max-w-prose text-base leading-relaxed",
                onInk ? "text-ink-text" : "text-pencil",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 pt-1">{action}</div>}
      </div>
    </div>
  );
}
