import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { ServicesHeroVisual } from "@/components/sections/HeroVisuals";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { clientTypes, fullProcess, services } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Website design and development, custom software, marketing consulting and SEO for businesses in Calgary, Alberta and across Canada.",
  path: "/services",
});

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.detail,
        provider: { "@type": "Organization", name: siteConfig.name },
        areaServed: {
          "@type": "AdministrativeArea",
          name: `${siteConfig.location.city}, ${siteConfig.location.region}`,
        },
      },
    })),
  };
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Technology and Marketing Solutions Built Around Your Goals"
        description="OAX Tech combines strategy, design, development and optimization to help organizations launch with confidence and grow with clarity."
        actions={
          <>
            <ButtonLink href="/book" variant="dark" size="lg" iconLeft="Calendar">
              Book a Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="outline" size="lg">
              Request a Quote
            </ButtonLink>
          </>
        }
        visual={<ServicesHeroVisual />}
      />

      {services.map((service, index) => {
        const alternate = index % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={cn("section border-b border-line", alternate ? "bg-mist" : "bg-paper")}
          >
            <Container>
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  alternate && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  <p className="font-display text-display-xs font-semibold text-cobalt">
                    {service.eyebrow}
                  </p>
                  <h2 className="mt-2 text-display-md">{service.title}</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-slate">
                    {service.detail}
                  </p>

                  <ul className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-3">
                    {service.features.map((feature) => (
                      <li key={feature.label}>
                        <Icon name={feature.icon} className="mb-2 h-5 w-5 text-cobalt" />
                        <p className="text-xs font-medium leading-snug text-ink">{feature.label}</p>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href.startsWith("/services#") ? "/quote" : service.href}
                    className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
                  >
                    {service.ctaLabel}
                    <Icon
                      name="ArrowRight"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                <div className="card overflow-hidden p-5 shadow-card sm:p-6">
                  <p className="eyebrow">{service.shortTitle}</p>
                  <p className="mt-3 font-display text-display-xs text-ink">{service.summary}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {service.features.slice(0, 6).map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-center gap-2.5 rounded-lg border border-line bg-mist px-3 py-2.5"
                      >
                        <Icon name={feature.icon} className="h-4 w-4 shrink-0 text-cobalt" />
                        <span className="text-xs text-charcoal">{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      <section className="section">
        <Container>
          <SectionHeading title="Built for Businesses at Every Stage" />
          <FeatureGrid items={clientTypes} columns={5} className="mt-10" />
        </Container>
      </section>

      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading title="Our Process, Built Around Your Success" />
          <ProcessStepsRow steps={fullProcess} className="mt-12" />
        </Container>
      </section>

      <CTASection
        title={
          <>
            Let&apos;s Build the Right Solution for Your Goals
            <span className="accent-dot">.</span>
          </>
        }
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" fullWidth>
              Request a Quote
            </ButtonLink>
          </>
        }
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema()) }}
      />
    </>
  );
}
