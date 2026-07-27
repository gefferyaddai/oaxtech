import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { MarketingHeroVisual } from "@/components/sections/HeroVisuals";
import { QuotedPackageCard } from "@/components/sections/PricingCard";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marketingFaqs } from "@/data/faqs";
import {
  SAMPLE_REPORT_DISCLAIMER,
  localSeoServices,
  marketingPillars,
  marketingServices,
  problemsSolved,
  reportingFeatures,
  sampleReportSections,
  seoServiceList,
} from "@/data/marketing";
import { marketingPackages, seoPackages } from "@/data/pricing";
import { marketingProcess } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Marketing & SEO",
  description:
    "Marketing strategy and search optimization for Calgary businesses — audits, local SEO, campaign planning and clear performance reporting.",
  path: "/services/marketing-seo",
});

export default function MarketingSeoPage() {
  return (
    <>
      <PageHero
        eyebrow="Marketing & SEO"
        title={
          <>
            Get Found.
            <br />
            Reach the Right Audience.
            <br />
            Grow With Purpose
            <span className="accent-dot">.</span>
          </>
        }
        description="OAX Tech combines marketing strategy and search optimization to improve visibility, attract qualified audiences, and support sustainable growth for Calgary businesses."
        actions={
          <>
            <ButtonLink href="/book" variant="dark" size="lg" iconLeft="Calendar">
              Book a Strategy Consultation
            </ButtonLink>
            <ButtonLink href="#packages" variant="outline" size="lg" iconRight="ArrowRight">
              Explore Packages
            </ButtonLink>
          </>
        }
        visual={<MarketingHeroVisual />}
      />

      <section className="border-b border-line bg-mist py-8">
        <Container>
          <FeatureGrid items={marketingPillars} columns={4} variant="plain" />
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading eyebrow="Problems we help solve" title="Where Growth Usually Gets Stuck" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {problemsSolved.map((problem) => (
              <li key={problem.label} className="card p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
                  <Icon name={problem.icon} className="h-5 w-5" />
                </span>
                <p className="font-display text-sm font-semibold leading-snug text-ink">
                  {problem.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate">{problem.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Marketing consulting ----------------------------------------------- */}
      <section className="section border-y border-line bg-mist" id="marketing-consulting">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">Marketing consulting</p>
              <h2 className="mt-3 text-display-md">
                A Clear Strategy Behind Every Campaign
                <span className="accent-dot">.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                We help you attract the right audience with focused strategies, compelling messaging
                and campaigns that drive results.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {marketingServices.map((service) => (
                  <li key={service} className="flex items-center gap-2.5 text-sm text-charcoal">
                    <Icon name="CheckCircle2" className="h-4 w-4 shrink-0 text-cobalt" />
                    {service}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/quote" variant="ghost" className="mt-6 px-0" iconRight="ArrowRight">
                Explore Marketing Support
              </ButtonLink>
            </div>
            <div className="card p-6">
              <p className="font-display text-sm font-semibold text-ink">Campaign plan</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Awareness", "Consideration", "Conversion"].map((stage) => (
                  <div key={stage} className="rounded-lg border border-line bg-mist p-3">
                    <p className="text-2xs font-semibold uppercase tracking-wide text-muted">
                      {stage}
                    </p>
                    <div className="mt-3 space-y-2" aria-hidden="true">
                      <div className="h-1.5 w-full rounded-full bg-line-strong" />
                      <div className="h-1.5 w-2/3 rounded-full bg-line" />
                    </div>
                  </div>
                ))}
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-line-subtle pt-5">
                {["Objectives", "Audience", "Messaging", "Channels", "Timeline", "Measurement"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-charcoal">
                      <span className="h-1.5 w-1.5 rounded-full bg-cobalt" aria-hidden="true" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* SEO services -------------------------------------------------------- */}
      <section className="section" id="seo-services">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="card p-6 lg:order-1">
              <p className="font-display text-sm font-semibold text-ink">
                Technical audit{" "}
                <span className="font-normal text-muted">(sample structure)</span>
              </p>
              <ul className="mt-5 space-y-3">
                {["Crawling", "Indexing", "Mobile usability", "Page speed", "Security"].map(
                  (check) => (
                    <li
                      key={check}
                      className="flex items-center justify-between rounded-lg border border-line bg-mist px-3 py-2.5 text-xs text-charcoal"
                    >
                      {check}
                      <Icon name="Check" className="h-4 w-4 text-cobalt" />
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-4 text-xs text-muted">
                Sample structure only — no scores or results are shown.
              </p>
            </div>
            <div>
              <p className="eyebrow">SEO services</p>
              <h2 className="mt-3 text-display-md">
                Build Visibility Where Your Customers Are Searching
                <span className="accent-dot">.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                Our SEO services improve your website&apos;s visibility, attract relevant traffic and
                strengthen your online presence.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {seoServiceList.map((service) => (
                  <li key={service} className="flex items-center gap-2.5 text-sm text-charcoal">
                    <Icon name="CheckCircle2" className="h-4 w-4 shrink-0 text-cobalt" />
                    {service}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg border border-line bg-mist p-4 text-xs leading-relaxed text-slate">
                We don&apos;t guarantee specific rankings. Search engines control results and change
                their systems continuously — what we commit to is sound practice and honest
                reporting.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Local SEO ----------------------------------------------------------- */}
      <section className="section bg-tint">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="eyebrow">Local SEO</p>
              <h2 className="mt-3 text-display-sm">Local SEO for Calgary Businesses</h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                We help Calgary businesses appear more prominently in local searches that drive nearby
                traffic, calls and visits.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-sm text-charcoal">
                <Icon name="MapPin" className="h-4 w-4 text-cobalt" />
                {siteConfig.location.city}, {siteConfig.location.region}
              </p>
              <ButtonLink href="/quote" variant="primary" className="mt-6" iconRight="ArrowRight">
                Improve Your Local Visibility
              </ButtonLink>
            </div>
            <FeatureGrid items={localSeoServices} columns={2} />
          </div>
        </Container>
      </section>

      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading eyebrow="Our process" title="A Practical Path From Visibility to Growth" />
          <ProcessStepsRow steps={marketingProcess} className="mt-12" />
        </Container>
      </section>

      {/* Packages ------------------------------------------------------------ */}
      <section className="section" id="packages">
        <Container>
          <SectionHeading eyebrow="Available packages" title="Marketing and SEO Packages" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {seoPackages.map((pkg) => (
              <QuotedPackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {marketingPackages.map((pkg) => (
              <QuotedPackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        </Container>
      </section>

      {/* Sample report — clearly labelled illustrative ------------------------ */}
      <section className="section border-t border-line bg-mist">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cobalt-border bg-cobalt-soft px-3 py-1.5">
                <Icon name="Info" className="h-3.5 w-3.5 text-cobalt" />
                <span className="text-2xs font-semibold uppercase tracking-wide text-cobalt">
                  Illustrative sample
                </span>
              </div>
              <div className="card p-5">
                <p className="font-display text-sm font-semibold text-ink">
                  Search report{" "}
                  <span className="font-normal text-muted">(illustrative)</span>
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {sampleReportSections.map((section) => (
                    <div key={section.title} className="rounded-lg border border-line bg-mist p-4">
                      <p className="text-xs font-semibold text-ink">{section.title}</p>
                      <p className="mt-0.5 text-2xs text-muted">{section.caption}</p>
                      <dl className="mt-3 space-y-2">
                        {section.rows.map((row) => (
                          <div key={row.label} className="flex items-center justify-between gap-3">
                            <dt className="text-xs text-slate">{row.label}</dt>
                            <dd className="text-xs font-medium tabular-nums text-muted">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
                <p className="mt-5 border-t border-line-subtle pt-4 text-xs leading-relaxed text-muted">
                  {SAMPLE_REPORT_DISCLAIMER}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow">Reporting that drives decisions</p>
              <h2 className="mt-3 text-display-sm">
                Clear Reporting. Useful Insights
                <span className="accent-dot">.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                We provide easy-to-understand reports that show what&apos;s working, what needs
                attention, and where to focus next.
              </p>
              <ul className="mt-7 space-y-5">
                {reportingFeatures.map((feature) => (
                  <li key={feature.label} className="flex gap-3">
                    <Icon name={feature.icon} className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
                    <div>
                      <p className="font-display text-sm font-semibold text-ink">{feature.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section" id="faq">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Marketing & SEO Questions" />
          <FAQAccordion items={marketingFaqs} className="mt-10" />
        </Container>
      </section>

      <CTASection
        title={
          <>
            Build a Smarter Marketing and SEO Strategy
            <span className="accent-dot">.</span>
          </>
        }
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a Strategy Consultation
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
