import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Hero visuals are built from real markup rather than dropped-in screenshots.
 *
 * That keeps page weight low, avoids layout shift, and means no meaningful text
 * is trapped inside an image. Any text that IS decorative (sample chart labels)
 * is marked aria-hidden so screen readers aren't read a fake dashboard.
 */

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                           */
/* -------------------------------------------------------------------------- */

function WindowChrome({ label, dark }: { label?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 border-b px-3.5 py-2.5",
        dark ? "border-space-line" : "border-line-subtle",
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
      <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
      <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
      {label && (
        <span className={cn("ml-2 truncate text-2xs", dark ? "text-space-text" : "text-muted")}>
          {label}
        </span>
      )}
    </div>
  );
}

const SPARK = [30, 46, 38, 62, 50, 74, 58, 82, 70, 92];

function Sparkline({ className, tone = "cobalt" }: { className?: string; tone?: "cobalt" | "muted" }) {
  const points = SPARK.map((value, index) => {
    const x = (index / (SPARK.length - 1)) * 100;
    const y = 100 - value;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={tone === "cobalt" ? "var(--color-cobalt)" : "rgba(122,132,148,0.5)"}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatTile({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2.5",
        dark ? "border-space-line bg-space" : "border-line bg-mist",
      )}
    >
      <p className={cn("text-2xs", dark ? "text-space-text/70" : "text-muted")}>{label}</p>
      <div
        className={cn("mt-1.5 h-2 w-2/3 rounded-full", dark ? "bg-white/20" : "bg-line-strong")}
        aria-hidden="true"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Home hero                                                                   */
/* -------------------------------------------------------------------------- */

export function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="card overflow-hidden shadow-float">
        <WindowChrome label="Analytics overview" />
        <div className="grid grid-cols-3 gap-2.5 p-3.5">
          <StatTile label="Visitors" />
          <StatTile label="Sessions" />
          <StatTile label="Conversions" />
        </div>
        <div className="px-3.5 pb-3.5">
          <div className="rounded-lg border border-line bg-mist p-3">
            <p className="text-2xs text-muted">Traffic trend</p>
            <div className="mt-2 h-20">
              <Sparkline />
            </div>
          </div>
        </div>
      </div>

      <div className="card absolute -bottom-6 -left-2 w-40 p-3 shadow-float sm:-left-6 sm:w-48">
        <p className="text-2xs text-muted">Site performance</p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-cobalt text-xs font-semibold text-cobalt">
            <Icon name="Gauge" className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <div className="h-1.5 w-full rounded-full bg-haze" aria-hidden="true">
              <span className="block h-full w-3/4 rounded-full bg-cobalt" />
            </div>
            <p className="mt-1.5 text-2xs text-muted">Optimized</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 -top-5 hidden w-36 overflow-hidden rounded-lg border border-space-line bg-space p-3 shadow-float sm:block">
        <p className="text-2xs text-space-text/70">Build status</p>
        <div className="mt-2 space-y-1.5" aria-hidden="true">
          <div className="h-1.5 w-full rounded-full bg-white/15" />
          <div className="h-1.5 w-2/3 rounded-full bg-cobalt/70" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Services hero — orbit of capability tiles                                   */
/* -------------------------------------------------------------------------- */

const SERVICE_TILES = [
  { label: "Custom Development", icon: "Code2" },
  { label: "Design & Experience", icon: "PenSquare" },
  { label: "Digital Marketing", icon: "BarChart3" },
  { label: "Optimization & Growth", icon: "Search" },
];

export function ServicesHeroVisual() {
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 lg:max-w-md">
      {SERVICE_TILES.map((tile) => (
        <div key={tile.label} className="card flex flex-col items-center p-5 text-center shadow-card">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
            <Icon name={tile.icon} className="h-5 w-5" />
          </span>
          <p className="text-xs font-medium leading-snug text-ink">{tile.label}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pricing hero                                                                */
/* -------------------------------------------------------------------------- */

const PRICING_TILES = [
  { label: "Websites", icon: "Monitor", value: "Starting at $600 CAD" },
  { label: "Custom Software", icon: "Code2", value: "Custom quote" },
  { label: "Marketing", icon: "BarChart3", value: "Request pricing" },
  { label: "SEO", icon: "Search", value: "Request pricing" },
];

export function PricingHeroVisual() {
  return (
    <ul className="mx-auto grid w-full max-w-md gap-3 sm:grid-cols-2">
      {PRICING_TILES.map((tile) => (
        <li key={tile.label} className="card p-4 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-cobalt-soft text-cobalt">
              <Icon name={tile.icon} className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-ink">{tile.label}</p>
          </div>
          <p className="mt-3 font-display text-sm font-semibold text-charcoal">{tile.value}</p>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Work hero — device cluster                                                  */
/* -------------------------------------------------------------------------- */

export function WorkHeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-lg items-end justify-center gap-3">
      {/* Phone */}
      <div className="w-24 shrink-0 rounded-2xl border border-line bg-paper p-1.5 shadow-float sm:w-28">
        <div className="rounded-xl bg-mist p-2">
          <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-line-strong" aria-hidden="true" />
          <div className="space-y-1.5" aria-hidden="true">
            <div className="h-1.5 w-full rounded-full bg-line-strong" />
            <div className="h-1.5 w-3/4 rounded-full bg-line" />
            <div className="h-8 rounded-md bg-cobalt/15" />
            <div className="h-1.5 w-2/3 rounded-full bg-line" />
          </div>
        </div>
      </div>

      {/* Laptop */}
      <div className="card min-w-0 flex-1 overflow-hidden shadow-float">
        <WindowChrome label="Project preview" />
        <div className="space-y-2 p-3" aria-hidden="true">
          <div className="h-2 w-2/5 rounded-full bg-line-strong" />
          <div className="h-2 w-3/5 rounded-full bg-line" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-10 rounded-md bg-mist" />
            <div className="h-10 rounded-md bg-mist" />
            <div className="h-10 rounded-md bg-cobalt/15" />
          </div>
        </div>
      </div>

      {/* Tablet, dark */}
      <div className="hidden w-28 shrink-0 overflow-hidden rounded-xl border border-space-line bg-space p-1.5 shadow-float sm:block">
        <div className="rounded-lg bg-space-raised p-2">
          <div className="mb-2 h-1.5 w-2/3 rounded-full bg-white/20" aria-hidden="true" />
          <div className="h-12">
            <Sparkline />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Case-study hero — phone trio                                                */
/* -------------------------------------------------------------------------- */

interface PhoneProps {
  title: string;
  lines?: number;
  featured?: boolean;
  className?: string;
}

export function PhoneFrame({ title, lines = 4, featured, className }: PhoneProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border-4 border-ink bg-ink p-1 shadow-float",
        featured ? "w-40 sm:w-48" : "w-32 sm:w-36",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.35rem] bg-paper">
        <div className="flex items-center justify-center border-b border-line-subtle py-1.5">
          <span className="h-1 w-8 rounded-full bg-line-strong" aria-hidden="true" />
        </div>
        <div className="space-y-2 p-3">
          <p className="font-display text-[0.6875rem] font-semibold leading-snug text-ink">{title}</p>
          <div className="h-6 rounded-md bg-mist" aria-hidden="true" />
          <div className="space-y-1.5" aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-5 w-5 shrink-0 rounded bg-haze" />
                <span className="h-1.5 flex-1 rounded-full bg-line" />
                <span className="h-1.5 w-5 rounded-full bg-cobalt/40" />
              </div>
            ))}
          </div>
          <div className="h-6 rounded-md bg-cobalt/80" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function SpargoHeroVisual() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <PhoneFrame title="Compare prices" className="hidden translate-y-4 xs:block" />
      <PhoneFrame title="Find better prices. Save more today." featured lines={5} />
      <PhoneFrame title="Savings" className="hidden translate-y-4 xs:block" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking hero                                                                */
/* -------------------------------------------------------------------------- */

export function BookingHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card overflow-hidden p-5 shadow-float">
        <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded",
                i === 16 ? "bg-cobalt" : i % 5 === 0 ? "bg-cobalt-soft" : "bg-mist",
              )}
            />
          ))}
        </div>
      </div>
      <div className="card absolute -bottom-5 -right-3 flex h-16 w-16 items-center justify-center shadow-float">
        <Icon name="CheckCircle2" className="h-7 w-7 text-cobalt" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quote hero                                                                  */
/* -------------------------------------------------------------------------- */

export function QuoteHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card p-5 shadow-float">
        <p className="font-display text-sm font-semibold text-ink">Project proposal</p>
        <div className="mt-4 space-y-2" aria-hidden="true">
          <div className="h-2 w-full rounded-full bg-line" />
          <div className="h-2 w-5/6 rounded-full bg-line" />
          <div className="h-2 w-2/3 rounded-full bg-line" />
          <div className="mt-4 h-2 w-1/3 rounded-full bg-cobalt" />
        </div>
      </div>
      <div className="card absolute -right-3 -top-4 w-36 p-3 shadow-float">
        <p className="text-2xs text-muted">Estimate</p>
        <p className="mt-1 font-display text-sm font-semibold text-ink">Prepared for you</p>
      </div>
      <div className="card absolute -bottom-6 -left-3 w-40 p-3 shadow-float">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cobalt-soft text-cobalt">
            <Icon name="Monitor" className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-2xs text-muted">Website project</p>
            <p className="text-xs font-semibold text-ink">From $1,000 CAD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Marketing hero                                                              */
/* -------------------------------------------------------------------------- */

export function MarketingHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="card overflow-hidden shadow-float">
        <div className="border-b border-line-subtle px-4 py-3">
          <p className="font-display text-xs font-semibold text-ink">Search performance</p>
        </div>
        <div className="grid grid-cols-4 gap-2 p-3.5">
          <StatTile label="Clicks" />
          <StatTile label="Impressions" />
          <StatTile label="CTR" />
          <StatTile label="Position" />
        </div>
        <div className="px-3.5 pb-4">
          <div className="h-24 rounded-lg border border-line bg-mist p-2">
            <Sparkline />
          </div>
        </div>
      </div>
      <div className="card absolute -bottom-6 -left-2 hidden w-44 p-3 shadow-float sm:block">
        <p className="text-2xs text-muted">Campaigns</p>
        <ul className="mt-2 space-y-1.5">
          {["Brand awareness", "Lead generation", "Content"].map((label) => (
            <li key={label} className="flex items-center gap-2 text-2xs text-charcoal">
              <span className="h-1.5 w-1.5 rounded-full bg-cobalt" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact hero                                                                */
/* -------------------------------------------------------------------------- */

const CONTACT_TILES = [
  { label: "Send a Message", icon: "MessageSquare" },
  { label: "Email Us", icon: "Mail" },
  { label: "Book a Consultation", icon: "Calendar" },
];

export function ContactHeroVisual() {
  return (
    <ul className="mx-auto flex w-full max-w-sm flex-col gap-3">
      {CONTACT_TILES.map((tile, index) => (
        <li
          key={tile.label}
          className={cn("card flex items-center gap-3 p-4 shadow-card", index === 1 && "sm:ml-6", index === 2 && "sm:ml-12")}
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
            <Icon name={tile.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{tile.label}</p>
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-line" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* About hero                                                                  */
/* -------------------------------------------------------------------------- */

export function AboutHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="card overflow-hidden shadow-float">
        <WindowChrome label="Growth strategy" />
        <div className="p-4">
          <ul className="space-y-2">
            {["Research", "Plan", "Execute", "Optimize"].map((label, i) => (
              <li key={label} className="flex items-center gap-2.5 text-xs text-charcoal">
                <span
                  className={cn(
                    "inline-flex h-4 w-4 items-center justify-center rounded-full",
                    i < 2 ? "bg-cobalt text-white" : "border border-line-strong",
                  )}
                  aria-hidden="true"
                >
                  {i < 2 && <Icon name="Check" className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-4 h-16 rounded-lg border border-line bg-mist p-2">
            <Sparkline />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-2 hidden w-40 overflow-hidden rounded-xl border border-space-line bg-space p-3 shadow-float sm:block">
        <p className="text-2xs text-space-text/70">Custom solution</p>
        <div className="mt-2 space-y-1.5" aria-hidden="true">
          <div className="h-1.5 w-full rounded-full bg-white/15" />
          <div className="h-1.5 w-4/5 rounded-full bg-cobalt/60" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
          <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Team hero                                                                   */
/* -------------------------------------------------------------------------- */

export function TeamHeroVisual({ initials }: { initials: string[] }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-wrap items-center justify-center gap-3">
      {initials.map((value, index) => (
        <div
          key={value + index}
          className={cn(
            "card flex h-20 w-20 items-center justify-center shadow-card sm:h-24 sm:w-24",
            index % 2 === 1 && "translate-y-3",
          )}
          aria-hidden="true"
        >
          <span className="font-display text-lg font-medium text-muted">{value}</span>
        </div>
      ))}
    </div>
  );
}
