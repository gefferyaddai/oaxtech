import Link from "next/link";
import { ArcEdge, BreakLine } from "@/components/ui/Drawing";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { PricingCard, QuotedPackageCard } from "@/components/sections/PricingCard";
import { PricingHeroVisual } from "@/components/sections/HeroVisuals";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pricingFaqs } from "@/data/faqs";
import {
  comparisonColumns,
  comparisonRows,
  marketingPackages,
  paymentFootnote,
  paymentInfo,
  seoPackages,
  softwarePackages,
  websitePackages,
} from "@/data/pricing";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Pricing & Packages",
  description:
    "Transparent website pricing starting at $600 CAD, plus SEO, marketing and custom software packages quoted to your project.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 03"
        eyebrow="Pricing & packages"
        title={
          <>
            Simple Packages.
            <br />
            Custom Solutions
            <span className="accent-dot">.</span>
          </>
        }
        description="Every project is different. These starting prices provide a clear foundation, with final pricing based on your goals, features and timeline."
        actions={
          <ButtonLink href="/quote" variant="dark" size="lg">
            Request a Quote
          </ButtonLink>
        }
        visual={<PricingHeroVisual />}
      />

      <section className="section">
        <Container>
          <h2 className="tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Primary website packages
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:gap-5">
            {websitePackages.map((pkg) => (
              <PricingCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison table — scrolls horizontally on small screens rather than
          shrinking text below a readable size. */}
      <div className="bg-sheet">
        <Container>
          <BreakLine />
        </Container>
      </div>
      <section className="pb-12 lg:pb-16">
        <Container>
          <h2 className="tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Package comparison
          </h2>
          <div className="mt-8 card overflow-hidden">
            <div className="table-scroll">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <caption className="sr-only">
                  Feature comparison across the One-Page, Business and Advanced website packages
                </caption>
                <thead>
                  <tr className="border-b border-line bg-mist">
                    <th scope="col" className="w-2/5 px-4 py-3 text-left font-medium text-muted">
                      <span className="sr-only">Feature</span>
                    </th>
                    {comparisonColumns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="px-4 py-3 text-center font-display font-semibold text-ink"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-line-subtle last:border-0">
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <span className="flex items-center gap-2.5 text-charcoal">
                          <Icon name={row.icon} className="h-4 w-4 shrink-0 text-cobalt" />
                          {row.label}
                        </span>
                      </th>
                      {row.values.map((value, index) => (
                        <td key={index} className="px-4 py-3.5 text-center text-charcoal">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <h2 className="tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Software packages
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {softwarePackages.map((pkg) => (
              <QuotedPackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>

          <h2 className="mt-16 tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            SEO packages
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {seoPackages.map((pkg) => (
              <QuotedPackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>

          <h2 className="mt-16 tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Marketing packages
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {marketingPackages.map((pkg) => (
              <QuotedPackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate">
            Software, SEO and marketing packages are priced against your goals and scope, so we
            quote them after a short conversation rather than listing a figure that
            wouldn&apos;t fit your situation.
          </p>
        </Container>
      </section>

      {/* Custom software ---------------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="section">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-space">
            <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:p-14">
              <div>
                <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-space-text">
                  Custom Software
                </p>
                <h2 className="mt-3 text-display-md text-white">
                  Software Built Around Your Workflow
                  <span className="accent-dot">.</span>
                </h2>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2.5 text-sm text-space-text">
                    <Icon name="FileText" className="h-4 w-4 shrink-0" />
                    Custom quote
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-space-text">
                    <Icon name="Clock" className="h-4 w-4 shrink-0" />
                    Discovery consultation required
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/book" variant="primary">
                    Book Discovery Call
                  </ButtonLink>
                  <ButtonLink href="/quote" variant="onDark">
                    Request a Quote
                  </ButtonLink>
                </div>
              </div>
              <div className="rounded-xl border border-space-line bg-space-card p-5">
                <p className="text-xs font-medium text-white">What a custom quote covers</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Discovery and requirements",
                    "Architecture and integrations",
                    "Build, test and deployment",
                    "Handover and ongoing support",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-space-text">
                      <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Payment information ------------------------------------------------ */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <h2 className="tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Clear terms. No surprises.
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paymentInfo.map((item) => (
              <li key={item.label} className="card p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center border-rule border-graphite bg-revision text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-muted">{paymentFootnote}</p>
        </Container>
      </section>

      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="section" id="faq">
        <Container>
          <h2 className="tally border-t-rule border-graphite pt-3 font-mono text-graphite">
            Pricing FAQ
          </h2>
          <FAQAccordion items={pricingFaqs} className="mt-8" />
          <p className="mt-8 text-center text-sm text-slate">
            Still unsure which package fits?{" "}
            <Link href="/book" className="font-medium text-cobalt underline underline-offset-2">
              Book a free consultation
            </Link>{" "}
            and we&apos;ll point you to the right one.
          </p>
        </Container>
      </section>

      <CTASection
        title="Ready to Choose the Right Package?"
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
    </>
  );
}
