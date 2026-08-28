import { CornerTicks, TitleBlock } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import { SlideIn } from "@/components/ui/Motion";
import { layerFor } from "@/lib/layers";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * HERO VISUALS
 * ============================================================================
 *
 * Built from real markup rather than dropped-in screenshots: page weight stays
 * low, there is no layout shift, and no meaningful text is trapped inside an
 * image.
 *
 * Every visual here is a DRAWING PLATE — a bordered field with registration
 * ticks, a ruled header, numbered rows and a title block at the foot. It is the
 * same device as the homepage's legend, which is the point: each interior page
 * opens with a detail plate belonging to the same set as the cover sheet.
 *
 * These replaced the previous orbital-motif visuals. Two things changed beyond
 * the styling:
 *
 *   - Illustrative device mockups no longer carry invented marketing copy
 *     ("Grow with confidence", "Built for what's next"). They are labelled as
 *     elevations, which is what they actually are — a drawing of a layout at a
 *     given width. It is more honest and it belongs to this world.
 *   - Anything purely illustrative stays `aria-hidden`, so a screen reader is
 *     never read a fake product.
 */

/* -------------------------------------------------------------------------- */
/* The plate                                                                  */
/* -------------------------------------------------------------------------- */

interface PlateNode {
  key: string;
  icon?: string;
  label: string;
  /** Secondary value shown right-aligned — a price, a status, a count. */
  meta?: string;
  /** Service slug, when this row maps to one of the four drawing layers. */
  slug?: string;
}

/**
 * The shared device. A legend of the page's own real content, drawn as a plate.
 */
function LegendPlate({
  title,
  nodes,
  sheet,
  countLabel = "items",
  className,
}: {
  title: string;
  nodes: PlateNode[];
  sheet: string;
  countLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative border border-line bg-chalk p-5 sm:p-6", className)}>
      <CornerTicks />

      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">{title}</span>
        <span className="tally font-mono text-faint nums">
          {String(nodes.length).padStart(2, "0")} {countLabel}
        </span>
      </div>

      <ul>
        {nodes.map((node, index) => (
          <SlideIn
            as="li"
            key={node.key}
            from="right"
            delay={120 + index * 90}
            className="group flex items-center gap-4 border-b border-line py-3.5 last:border-b-0"
          >
            {/* Rows that map to a discipline carry that layer's pen colour;
                the rest stay neutral rather than borrowing one. */}
            <span
              aria-hidden="true"
              className={cn(
                "tally shrink-0 font-mono nums",
                node.slug ? layerFor(node.slug).text : "text-faint",
              )}
            >
              {node.slug ? layerFor(node.slug).no : String(index + 1).padStart(2, "0")}
            </span>

            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center border border-graphite transition-colors duration-200 group-hover:bg-graphite group-hover:text-white",
                node.slug ? `${layerFor(node.slug).fill} text-white` : "bg-sheet text-graphite",
              )}
            >
              <Icon name={node.icon ?? "Square"} className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1 font-display text-base font-bold uppercase leading-tight text-graphite">
              {node.label}
            </span>

            {node.meta && (
              <span className="tally shrink-0 whitespace-nowrap font-mono text-faint">
                {node.meta}
              </span>
            )}
          </SlideIn>
        ))}
      </ul>

      <TitleBlock
        className="mt-5"
        fields={[
          { label: "Sheet", value: sheet },
          { label: "Drawn by", value: "OAX Tech" },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Retained for compatibility. The homepage composes its own legend inside
 * `HomeHero`, so nothing renders this today.
 */
export function HeroDashboard() {
  return (
    <LegendPlate
      title="Disciplines"
      sheet="01"
      countLabel="services"
      nodes={[
        { key: "web", icon: "Monitor", label: "Websites", slug: "website-design" },
        { key: "software", icon: "Code2", label: "Custom software", slug: "custom-software" },
        { key: "marketing", icon: "BarChart3", label: "Marketing", slug: "marketing-consulting" },
        { key: "seo", icon: "Search", label: "SEO", slug: "seo" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Services / pricing / marketing / about / contact                           */
/* -------------------------------------------------------------------------- */

export function ServicesHeroVisual() {
  return (
    <LegendPlate
      title="Capabilities"
      sheet="02"
      countLabel="areas"
      nodes={[
        { key: "dev", icon: "Code2", label: "Custom development", slug: "custom-software" },
        { key: "design", icon: "PenSquare", label: "Design & experience", slug: "website-design" },
        { key: "marketing", icon: "BarChart3", label: "Digital marketing", slug: "marketing-consulting" },
        { key: "growth", icon: "Search", label: "Optimization & growth", slug: "seo" },
      ]}
    />
  );
}

export function PricingHeroVisual() {
  return (
    <LegendPlate
      title="Rate schedule"
      sheet="03"
      countLabel="lines"
      nodes={[
        { key: "web", icon: "Monitor", label: "Websites", meta: "From $600 CAD", slug: "website-design" },
        { key: "software", icon: "Code2", label: "Custom software", meta: "Custom quote", slug: "custom-software" },
        { key: "marketing", icon: "BarChart3", label: "Marketing", meta: "Request pricing", slug: "marketing-consulting" },
        { key: "seo", icon: "Search", label: "SEO", meta: "Request pricing", slug: "seo" },
      ]}
    />
  );
}

export function MarketingHeroVisual() {
  return (
    <LegendPlate
      title="Growth scope"
      sheet="04"
      countLabel="areas"
      nodes={[
        { key: "brand", icon: "Megaphone", label: "Brand awareness" },
        { key: "leads", icon: "Target", label: "Lead generation" },
        { key: "content", icon: "PenSquare", label: "Content" },
        { key: "seo", icon: "Search", label: "SEO", slug: "seo" },
      ]}
    />
  );
}

export function AboutHeroVisual() {
  return (
    <LegendPlate
      title="Our approach"
      sheet="05"
      countLabel="stages"
      nodes={[
        { key: "research", icon: "Search", label: "Research" },
        { key: "plan", icon: "ClipboardCheck", label: "Plan" },
        { key: "execute", icon: "Rocket", label: "Execute" },
        { key: "optimize", icon: "Gauge", label: "Optimize" },
      ]}
    />
  );
}

export function ContactHeroVisual() {
  return (
    <LegendPlate
      title="Ways to reach us"
      sheet="06"
      countLabel="routes"
      nodes={[
        { key: "message", icon: "MessageSquare", label: "Send a message" },
        { key: "email", icon: "Mail", label: "Email us" },
        { key: "book", icon: "Calendar", label: "Book a consultation" },
      ]}
    />
  );
}

/**
 * Learn More plate. Lists what the story video actually walks through, taken
 * from `storyVideo.covers` — a legend of the page's own content, same as every
 * other plate in the set.
 */
export function LearnMoreHeroVisual({ covers }: { covers: { label: string }[] }) {
  return (
    <LegendPlate
      title="In the video"
      sheet="07"
      countLabel="chapters"
      nodes={covers.map((cover, index) => ({
        key: `${cover.label}-${index}`,
        icon: "Play",
        label: cover.label,
      }))}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Elevations                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A drawn elevation: the outline of a layout at a given width, with its
 * dimension label. This replaces the previous gradient-filled device mockups —
 * a drawing of a screen shows the same thing (this site works at these widths)
 * without pretending to be a screenshot of a site that does not exist.
 */
function Elevation({
  label,
  width,
  ratio,
  rows = 3,
  tone = "paper",
  className,
}: {
  label: string;
  width: string;
  /** Tailwind aspect ratio class, e.g. "aspect-[9/16]". */
  ratio: string;
  rows?: number;
  tone?: "paper" | "ink";
  className?: string;
}) {
  const onInk = tone === "ink";

  return (
    <figure className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div
        className={cn(
          "relative border-rule",
          ratio,
          onInk ? "border-ink-line bg-ink" : "border-graphite bg-sheet",
        )}
      >
        {/* Title bar of the drawn screen */}
        <div
          className={cn(
            "flex h-5 items-center gap-1 border-b px-1.5",
            onInk ? "border-ink-line" : "border-line",
          )}
          aria-hidden="true"
        >
          <span className={cn("h-1.5 w-1.5", onInk ? "bg-ink-line" : "bg-line")} />
          <span className={cn("h-1.5 w-1.5", onInk ? "bg-ink-line" : "bg-line")} />
        </div>

        {/* Content blocks, drawn not filled */}
        <div className="space-y-1.5 p-2" aria-hidden="true">
          <span className={cn("block h-3 w-3/4", onInk ? "bg-ink-text/40" : "bg-graphite")} />
          <span className="block h-8 w-full bg-revision/85" />
          {Array.from({ length: rows }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "block h-1.5",
                index % 2 === 0 ? "w-full" : "w-2/3",
                onInk ? "bg-ink-line" : "bg-line",
              )}
            />
          ))}
        </div>
      </div>

      {/* The dimension: end ticks, rule, and the width it is drawn at */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-px shrink-0 bg-line" />
        <span className="h-px flex-1 bg-line" />
        <span className="tally shrink-0 whitespace-nowrap font-mono text-faint">{width}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="h-2 w-px shrink-0 bg-line" />
      </div>

      <figcaption className="tally text-center font-mono text-faint">{label}</figcaption>
    </figure>
  );
}

/**
 * The work page: one layout drawn at three widths, which is what "responsive"
 * actually means and what the previous three-device mockup was gesturing at.
 */
export function WorkHeroVisual() {
  return (
    <div className="relative border border-line bg-chalk p-5 sm:p-6">
      <CornerTicks />

      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">Elevations</span>
        <span className="tally font-mono text-faint nums">03 widths</span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1.5fr_1fr] items-end gap-3 sm:gap-4">
        <SlideIn delay={80}>
          <Elevation label="Phone" width="390" ratio="aspect-[9/16]" rows={2} />
        </SlideIn>
        <SlideIn delay={160}>
          <Elevation label="Desktop" width="1440" ratio="aspect-[4/3]" rows={3} />
        </SlideIn>
        <SlideIn delay={240}>
          <Elevation label="Tablet" width="820" ratio="aspect-[3/4]" rows={2} tone="ink" />
        </SlideIn>
      </div>

      <TitleBlock
        className="mt-6"
        fields={[
          { label: "Sheet", value: "08" },
          { label: "Scale", value: "NTS" },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Case study                                                                 */
/* -------------------------------------------------------------------------- */

interface PhoneProps {
  title: string;
  eyebrow?: string;
  featured?: boolean;
  className?: string;
}

/**
 * A single phone elevation with its own caption. The `title` is real copy
 * describing what that screen does, so it stays visible rather than being
 * hidden as decoration.
 */
export function PhoneFrame({ title, eyebrow = "Compare", featured, className }: PhoneProps) {
  return (
    <figure
      className={cn(
        "flex min-w-0 flex-col border-rule border-graphite bg-chalk",
        featured ? "w-40 sm:w-48" : "w-32 sm:w-36",
        className,
      )}
    >
      <div className={cn("border-b border-line px-2 py-1.5", featured && "bg-revision")}>
        <span
          className={cn("tally block font-mono", featured ? "text-white" : "text-revision-text")}
        >
          {eyebrow}
        </span>
      </div>

      <div className="aspect-[9/16] bg-sheet p-2">
        <span className="block h-6 w-full bg-revision/80" aria-hidden="true" />
        <div className="mt-2 space-y-1.5" aria-hidden="true">
          <span className="block h-1.5 w-full bg-line" />
          <span className="block h-1.5 w-2/3 bg-line" />
        </div>
      </div>

      <figcaption className="border-t border-line px-2 py-2 font-display text-xs font-bold uppercase leading-tight text-graphite">
        {title}
      </figcaption>
    </figure>
  );
}

export function SpargoHeroVisual() {
  return (
    <div className="flex items-start justify-center gap-2 sm:gap-3">
      <PhoneFrame title="Compare prices instantly" eyebrow="Search" className="hidden xs:flex" />
      <PhoneFrame title="Find better prices" eyebrow="Spargo" featured />
      <PhoneFrame title="Track your savings" eyebrow="Savings" className="hidden xs:flex" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A month drawn as a schedule grid.
 *
 * The marked day and time are ILLUSTRATIVE, not an available slot — the whole
 * grid is `aria-hidden` and the booking page's own availability UI is the only
 * thing that states real times. The previous version had the same constraint.
 */
export function BookingHeroVisual() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const selected = 17;

  return (
    <div className="relative border border-line bg-chalk p-5 sm:p-6">
      <CornerTicks />

      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">Schedule</span>
        <span className="tally font-mono text-faint nums">30 min · Free</span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1" aria-hidden="true">
        {days.map((day) => (
          <span
            key={day}
            className={cn(
              "flex aspect-square items-center justify-center border font-mono text-[0.6rem] tabular-nums",
              day === selected
                ? "border-graphite bg-revision text-white"
                : day % 5 === 0
                  ? "border-graphite bg-sheet text-graphite"
                  : "border-line text-faint",
            )}
          >
            {day}
          </span>
        ))}
      </div>

      <p className="tally mt-4 border-t border-line pt-3 font-mono text-faint">
        Marked cells are illustrative — real availability is shown below.
      </p>

      <TitleBlock
        className="mt-4"
        fields={[
          { label: "Sheet", value: "09" },
          { label: "Duration", value: "30 min" },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quote                                                                      */
/* -------------------------------------------------------------------------- */

/** A proposal drawn as a schedule of what a quote covers. */
export function QuoteHeroVisual() {
  const rows = [
    { icon: "Layers", label: "Scope" },
    { icon: "Clock", label: "Timeline" },
    { icon: "Wallet", label: "Investment" },
  ];

  return (
    <LegendPlate
      title="Proposal outline"
      sheet="10"
      countLabel="sections"
      nodes={rows.map((row) => ({ key: row.label, icon: row.icon, label: row.label }))}
    />
  );
}
