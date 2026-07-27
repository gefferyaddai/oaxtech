import { Icon } from "@/components/ui/Icon";
import { OrbitalSystem } from "@/components/ui/OrbitalSystem";
import { cn } from "@/lib/utils";

/**
 * Hero visuals are built from real markup rather than dropped-in screenshots.
 *
 * That keeps page weight low, avoids layout shift, and means no meaningful text
 * is trapped inside an image. Most heroes below are variations of one signature
 * device — the orbital system, echoing the OAX mark — orbited by the page's own
 * real content (services, packages, people) instead of an invented dashboard
 * screenshot. Any text that is purely illustrative (device-mockup captions) is
 * marked aria-hidden so screen readers aren't read a fake product.
 */

/* -------------------------------------------------------------------------- */
/* Home hero — the four disciplines, orbiting                                  */
/* -------------------------------------------------------------------------- */

export function HeroDashboard() {
  return (
    <OrbitalSystem
      hub={{ icon: "Rocket", label: "OAX Tech" }}
      nodes={[
        { key: "web", icon: "Monitor", label: "Websites" },
        { key: "software", icon: "Code2", label: "Custom Software" },
        { key: "marketing", icon: "BarChart3", label: "Marketing" },
        { key: "seo", icon: "Search", label: "SEO" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Services hero — orbit of capability tiles                                   */
/* -------------------------------------------------------------------------- */

export function ServicesHeroVisual() {
  return (
    <OrbitalSystem
      hub={{ icon: "Layers", label: "Capabilities" }}
      nodes={[
        { key: "dev", icon: "Code2", label: "Custom Development" },
        { key: "design", icon: "PenSquare", label: "Design & Experience" },
        { key: "marketing", icon: "BarChart3", label: "Digital Marketing" },
        { key: "growth", icon: "Search", label: "Optimization & Growth" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Pricing hero                                                                */
/* -------------------------------------------------------------------------- */

export function PricingHeroVisual() {
  return (
    <OrbitalSystem
      hub={{ icon: "Wallet", label: "Pricing" }}
      nodes={[
        { key: "web", icon: "Monitor", label: "Websites", meta: "From $600 CAD" },
        { key: "software", icon: "Code2", label: "Custom Software", meta: "Custom quote" },
        { key: "marketing", icon: "BarChart3", label: "Marketing", meta: "Request pricing" },
        { key: "seo", icon: "Search", label: "SEO", meta: "Request pricing" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Marketing hero                                                              */
/* -------------------------------------------------------------------------- */

export function MarketingHeroVisual() {
  return (
    <OrbitalSystem
      hub={{ icon: "TrendingUp", label: "Growth" }}
      nodes={[
        { key: "brand", icon: "Megaphone", label: "Brand Awareness" },
        { key: "leads", icon: "Target", label: "Lead Generation" },
        { key: "content", icon: "PenSquare", label: "Content" },
        { key: "seo", icon: "Search", label: "SEO" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* About hero                                                                  */
/* -------------------------------------------------------------------------- */

export function AboutHeroVisual() {
  return (
    <OrbitalSystem
      hub={{ icon: "Compass", label: "Our approach" }}
      nodes={[
        { key: "research", icon: "Search", label: "Research" },
        { key: "plan", icon: "ClipboardCheck", label: "Plan" },
        { key: "execute", icon: "Rocket", label: "Execute" },
        { key: "optimize", icon: "Gauge", label: "Optimize" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Contact hero                                                                */
/* -------------------------------------------------------------------------- */

export function ContactHeroVisual() {
  return (
    <OrbitalSystem
      hub={{ icon: "MessageSquare", label: "Let's talk" }}
      nodes={[
        { key: "message", icon: "MessageSquare", label: "Send a Message" },
        { key: "email", icon: "Mail", label: "Email Us" },
        { key: "book", icon: "Calendar", label: "Book a Consultation" },
      ]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Team hero — the people, orbiting                                            */
/* -------------------------------------------------------------------------- */

export function TeamHeroVisual({ initials }: { initials: string[] }) {
  return (
    <OrbitalSystem
      nodeStyle="avatar"
      hub={{ icon: "Users", label: "The team" }}
      nodes={initials.map((value, index) => ({ key: `${value}-${index}`, label: value }))}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Shared device-frame primitives — used where the subject really is a screen  */
/* -------------------------------------------------------------------------- */

function BrowserChrome({ label, dark }: { label?: string; dark?: boolean }) {
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

/* -------------------------------------------------------------------------- */
/* Work hero — a real mini site, rendered across three real form factors       */
/* -------------------------------------------------------------------------- */

export function WorkHeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-lg items-end justify-center gap-3">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-32 -translate-y-1/2 rounded-full bg-cobalt/10 blur-3xl" />

      {/* Phone */}
      <div className="w-24 shrink-0 -rotate-3 rounded-[1.4rem] border border-line bg-paper p-1.5 shadow-float transition-transform duration-500 hover:rotate-0 sm:w-28">
        <div className="overflow-hidden rounded-[1rem] bg-mist">
          <div className="mx-auto mb-2 mt-1.5 h-1 w-6 rounded-full bg-line-strong" aria-hidden="true" />
          <div className="space-y-2 px-2 pb-2.5">
            <p className="font-display text-[0.55rem] font-semibold text-ink">Grow with confidence.</p>
            <div className="h-9 rounded-md bg-gradient-to-br from-cobalt/25 to-violet/15" aria-hidden="true" />
            <span className="btn btn-primary block !min-h-0 !py-1 !text-[0.5rem]">Get Started</span>
          </div>
        </div>
      </div>

      {/* Laptop */}
      <div className="card relative z-10 min-w-0 flex-1 overflow-hidden shadow-float">
        <BrowserChrome label="yoursite.com" />
        <div className="space-y-2.5 p-3.5">
          <p className="font-display text-xs font-semibold leading-snug text-ink">Built for what&apos;s next.</p>
          <div className="h-14 rounded-md bg-gradient-to-br from-cobalt/20 via-violet/10 to-transparent" aria-hidden="true" />
          <div className="grid grid-cols-3 gap-2 pt-0.5" aria-hidden="true">
            {["Home", "Work", "Contact"].map((label) => (
              <div key={label} className="rounded-md border border-line bg-mist px-2 py-1.5 text-center text-[0.55rem] font-medium text-slate">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet, dark */}
      <div className="hidden w-28 shrink-0 rotate-3 overflow-hidden rounded-xl border border-space-line bg-space p-1.5 shadow-float transition-transform duration-500 hover:rotate-0 sm:block">
        <div className="rounded-lg bg-space-card p-2.5">
          <p className="text-[0.55rem] font-medium text-space-text">Performance</p>
          <div className="mt-2 flex items-end gap-1" aria-hidden="true">
            {[40, 65, 52, 80, 70].map((h, i) => (
              <span key={i} className="flex-1 rounded-sm bg-cobalt/70" style={{ height: `${h * 0.4}px` }} />
            ))}
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
  eyebrow?: string;
  featured?: boolean;
  className?: string;
}

export function PhoneFrame({ title, eyebrow = "Compare", featured, className }: PhoneProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border-4 border-ink bg-ink p-1 shadow-float transition-transform duration-500 hover:-translate-y-1.5",
        featured ? "w-40 sm:w-48" : "w-32 sm:w-36",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.35rem] bg-paper">
        <div className="flex items-center justify-center border-b border-line-subtle py-1.5">
          <span className="h-1 w-8 rounded-full bg-line-strong" aria-hidden="true" />
        </div>
        <div className="space-y-2.5 p-3">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-cobalt">{eyebrow}</p>
          <p className="font-display text-[0.75rem] font-semibold leading-snug text-ink">{title}</p>
          <div className="h-10 rounded-md bg-gradient-to-br from-cobalt/20 via-violet/10 to-transparent" aria-hidden="true" />
          {featured && (
            <span className="btn btn-primary block !min-h-0 !py-1.5 !text-[0.55rem]">
              See savings
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function SpargoHeroVisual() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <PhoneFrame title="Compare prices instantly" eyebrow="Search" className="hidden translate-y-4 xs:block" />
      <PhoneFrame title="Find better prices. Save more today." eyebrow="Spargo" featured />
      <PhoneFrame title="Track your savings" eyebrow="Savings" className="hidden translate-y-4 xs:block" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Booking hero — a real calendar grid with a selected slot                    */
/* -------------------------------------------------------------------------- */

export function BookingHeroVisual() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const selected = 17;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card overflow-hidden p-5 shadow-float">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-xs font-semibold text-ink">Pick a time</p>
          <Icon name="Calendar" className="h-4 w-4 text-cobalt" />
        </div>
        <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
          {days.map((day) => (
            <span
              key={day}
              className={cn(
                "flex aspect-square items-center justify-center rounded text-[0.6rem] font-medium",
                day === selected
                  ? "bg-cobalt text-white"
                  : day % 5 === 0
                    ? "bg-cobalt-soft text-cobalt"
                    : "bg-mist text-slate",
              )}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
      <div className="card absolute -bottom-5 -right-3 flex items-center gap-2 p-3 shadow-float">
        <Icon name="CheckCircle2" className="h-5 w-5 shrink-0 text-cobalt" />
        <div className="pr-1">
          <p className="text-[0.65rem] font-semibold text-ink">Tue, 2:00 PM</p>
          <p className="text-[0.6rem] text-muted">30 min call</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quote hero — a proposal outline                                            */
/* -------------------------------------------------------------------------- */

export function QuoteHeroVisual() {
  const rows = [
    { icon: "Layers", label: "Scope" },
    { icon: "Clock", label: "Timeline" },
    { icon: "Wallet", label: "Investment" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card overflow-hidden shadow-float">
        <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3.5">
          <p className="font-display text-sm font-semibold text-ink">Project proposal</p>
          <span className="rounded-full bg-cobalt-soft px-2.5 py-1 text-2xs font-semibold text-cobalt">Draft</span>
        </div>
        <ul className="space-y-3.5 p-5">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
                <Icon name={row.icon} className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-charcoal">{row.label}</span>
              <span className="ml-auto h-1.5 w-16 rounded-full bg-line" aria-hidden="true" />
            </li>
          ))}
        </ul>
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
