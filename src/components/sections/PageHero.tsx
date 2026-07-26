import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { OrbitalBackdrop } from "@/components/ui/OrbitalBackdrop";
import { cn } from "@/lib/utils";

interface HeroBullet {
  label: string;
  icon: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  bullets?: HeroBullet[];
  /** Visual placed alongside the copy on large screens. */
  visual?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  /** Centred, no visual — used by simpler pages. */
  centered?: boolean;
}

/**
 * Shared hero used by every public page so the top of the site is consistent.
 * On mobile the copy always comes first; the visual stacks below and never
 * covers the headline.
 */
export function PageHero({
  eyebrow, title, description, actions, bullets, visual, breadcrumb, className, centered,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line bg-cream", className)}>
      <OrbitalBackdrop className="opacity-70" />
      <Container className="relative py-12 md:py-16 lg:py-20">
        {breadcrumb}
        <div
          className={cn(
            "grid items-center gap-10",
            visual && !centered ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14" : "",
            centered && "justify-items-center text-center",
          )}
        >
          <div className={cn("min-w-0", centered && "max-w-2xl")}>
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            <h1 className="text-display-xl">{title}</h1>
            {description && (
              <p className={cn("mt-5 max-w-xl text-lg text-slate", centered && "mx-auto")}>
                {description}
              </p>
            )}
            {actions && (
              <div className={cn("mt-8 flex flex-wrap gap-3", centered && "justify-center")}>
                {actions}
              </div>
            )}
            {bullets && bullets.length > 0 && (
              <ul className={cn("mt-8 flex flex-wrap gap-x-6 gap-y-3", centered && "justify-center")}>
                {bullets.map((bullet) => (
                  <li key={bullet.label} className="flex items-center gap-2 text-sm text-slate">
                    <Icon name={bullet.icon} className="h-4 w-4 shrink-0 text-cobalt" />
                    {bullet.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {visual && !centered && <div className="min-w-0">{visual}</div>}
        </div>
      </Container>
    </section>
  );
}
