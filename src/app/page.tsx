import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArticleCard } from "@/components/sections/ArticleCard";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { PricingCard } from "@/components/sections/PricingCard";
import { CompactProjectCard } from "@/components/sections/ProjectCard";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid, ServiceCard } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroDashboard } from "@/components/sections/HeroVisuals";
import { publishedArticles } from "@/data/articles";
import { homeFaqs } from "@/data/faqs";
import { websitePackages } from "@/data/pricing";
import { projects, trustedBy } from "@/data/projects";
import { homeProcess, services, valueProps } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Websites, Software, Marketing & SEO in Calgary`,
  description:
    "OAX Tech designs high-performing websites, builds custom software, and creates marketing and SEO strategies that help Calgary businesses grow.",
  path: "/",
});

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const latestArticles = publishedArticles().slice(0, 3);

  return (
    <>
      <PageHero
        title={
          <>
            Digital Solutions Built to Move Your Business Forward
            <span className="accent-dot">.</span>
          </>
        }
        description="We design high-performing websites, build custom software, and create marketing and SEO strategies that help businesses grow."
        actions={
          <>
            <ButtonLink href="/book" variant="dark" size="lg" iconLeft="Calendar">
              Book a Free Consultation
            </ButtonLink>
            <ButtonLink href="/work" variant="outline" size="lg">
              Explore Our Work
            </ButtonLink>
          </>
        }
        bullets={[{ label: siteConfig.location.display, icon: "MapPin" }]}
        visual={<HeroDashboard />}
      />

      {/* Trust strip -------------------------------------------------------- */}
      <section className="border-b border-line bg-mist py-8">
        <Container>
          <h2 className="text-center text-2xs font-semibold uppercase tracking-[0.16em] text-muted">
            Trusted by growing businesses
          </h2>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {trustedBy.map((client) => (
              <li
                key={client.name}
                className="font-display text-lg font-semibold tracking-wide text-muted"
              >
                {client.name}
              </li>
            ))}
          </ul>
          {/* Only organisations that have confirmed permission appear above. */}
        </Container>
      </section>

      {/* About preview ------------------------------------------------------ */}
      <section className="section">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <h2 className="text-display-sm">About OAX Tech</h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                OAX Tech is a Calgary-based digital agency focused on delivering smart, scalable, and
                measurable solutions. From modern websites and custom software to data-driven
                marketing and SEO, we help businesses thrive in the digital world.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
              >
                More about us
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <FeatureGrid items={valueProps} columns={4} variant="plain" className="lg:border-l lg:border-line lg:pl-12" />
          </div>
        </Container>
      </section>

      {/* Services ----------------------------------------------------------- */}
      <section className="section border-t border-line bg-mist">
        <Container>
          <SectionHeading eyebrow="What we do" title="Services That Drive Growth" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate">
            Looking for marketing or search support?{" "}
            <Link href="/services/marketing-seo" className="font-medium text-cobalt underline underline-offset-2">
              See our marketing and SEO services
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* Featured work ------------------------------------------------------ */}
      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Featured work"
            title="Solutions We're Proud Of"
            align="left"
            action={
              <Link
                href="/work"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-cobalt"
              >
                View All Projects
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <CompactProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      {/* Process ------------------------------------------------------------ */}
      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading eyebrow="Our process" title="A Clear Path to Success" />
          <ProcessStepsRow steps={homeProcess} className="mt-12" />
        </Container>
      </section>

      {/* Pricing preview ---------------------------------------------------- */}
      <section className="section">
        <Container>
          <SectionHeading eyebrow="Pricing preview" title="Simple, Transparent Pricing" />
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-5">
            {websitePackages.map((pkg) => (
              <PricingCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate">
            Need something custom?{" "}
            <Link href="/contact" className="font-medium text-cobalt underline underline-offset-2">
              Contact us
            </Link>{" "}
            for a tailored quote, or see the{" "}
            <Link href="/pricing" className="font-medium text-cobalt underline underline-offset-2">
              full pricing breakdown
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* Client stories ------------------------------------------------------
          No testimonials or client statistics are published until they are
          confirmed in writing, so this section states that plainly rather than
          showing invented quotes or numbers. */}
      <section className="section border-y border-line bg-tint">
        <Container narrow>
          <div className="card mx-auto max-w-2xl p-8 text-center">
            <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
              <Icon name="MessageSquare" className="h-5 w-5" />
            </span>
            <h2 className="font-display text-display-xs">Client success stories coming soon</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
              We&apos;re collecting feedback from the teams we&apos;ve worked with. Real quotes will
              appear here once our clients have approved them — nothing placed here will be invented.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/work" variant="outline" size="sm">
                See the work instead
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Resources ---------------------------------------------------------- */}
      {latestArticles.length > 0 && (
        <section className="section">
          <Container>
            <SectionHeading
              eyebrow="Resources"
              title="Practical Guides for Growing Businesses"
              align="left"
              action={
                <Link
                  href="/resources"
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-cobalt"
                >
                  All resources
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <div key={article.slug} className="relative">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ ---------------------------------------------------------------- */}
      <section className="section border-t border-line bg-mist" id="faq">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common Questions" />
          <FAQAccordion items={homeFaqs} className="mt-10" />
        </Container>
      </section>

      <CTASection
        title={
          <>
            Ready to Build Something Great
            <span className="accent-dot">?</span>
          </>
        }
        description="Let's talk about your project and how we can help you achieve your goals."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a Free Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" fullWidth>
              Request a Quote
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
