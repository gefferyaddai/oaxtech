import { Container } from "@/components/layout/Container";
import { OrbitalBackdrop } from "@/components/ui/OrbitalBackdrop";
import { StarField } from "@/components/ui/StarField";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
  /** Inset card style used on the pricing and contact pages. */
  inset?: boolean;
}

/** Dark, space-inspired call to action used at the foot of every page. */
export function CTASection({ title, description, actions, className, inset }: CTASectionProps) {
  const body = (
    <div className="relative overflow-hidden">
      <StarField />
      <OrbitalBackdrop variant="dark" className="opacity-80" showNodes={false} />
      <div className="relative grid items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.3fr_auto] lg:gap-12 lg:px-14 lg:py-16">
        <div>
          <h2 className="text-display-md text-white">{title}</h2>
          {description && (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-space-text sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3 sm:max-w-xs">{actions}</div>
      </div>
    </div>
  );

  if (inset) {
    return (
      <section className={cn("bg-paper py-10 lg:py-14", className)}>
        <Container>
          <div className="overflow-hidden rounded-3xl bg-space">{body}</div>
        </Container>
      </section>
    );
  }

  return (
    <section className={cn("surface-space", className)}>
      <Container>{body}</Container>
    </section>
  );
}
