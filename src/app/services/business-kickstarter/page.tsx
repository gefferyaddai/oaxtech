import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { ArcEdge, ArrowLink, CornerTicks, TitleBlock } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import { SlideIn } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  type KickstarterTier,
  kickstarterTiers,
  monthlyFor,
  paymentPlanNote,
  rangeFor,
} from "@/data/kickstarter";
import { homeProcess } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import codePoster from "@/assets/08-code-poster.jpg";
import { PlateLoop } from "@/components/ui/Photo";

export const metadata = buildMetadata({
  title: "Business Kickstarter Packages",
  description:
    "Bundled launch packages for Calgary businesses: a website plus SEO, paid ads and marketing consulting over a fixed term, payable monthly across the length of the engagement.",
  path: "/services/business-kickstarter",
});

/**
 * ============================================================================
 * BUSINESS KICKSTARTER PACKAGES
 * ============================================================================
 *
 * Three bundled tiers, drawn as spec sheets.
 *
 * Two decisions worth keeping:
 *
 *   1. The price range and the monthly figure sit together on every card, and
 *      the monthly is DERIVED from the range and the term (see
 *      `monthlyFor()`). A page that shows a stored monthly beside a stored
 *      total will eventually show two numbers that disagree.
 *   2. Inherited contents are stated as "Everything in Basic, plus…" rather
 *      than re-listing the earlier tier's lines. Repeating them pads the card
 *      and hides what the extra money actually buys, which is the one thing
 *      the reader is trying to work out.
 */

function TierCard({ tier }: { tier: KickstarterTier }) {
  const monthly = monthlyFor(tier);
  const featured = tier.featured;

  return (
    <article
      className={cn(
        "plate plate-interactive relative flex h-full flex-col",
        featured && "plate-ink",
      )}
    >
      <CornerTicks tone={featured ? "revision" : "ink"} />

      {featured && (
        <p className="tally bg-revision py-2 text-center font-mono text-white">Most popular</p>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={cn(
              "font-display text-2xl font-bold uppercase leading-none",
              featured ? "text-white" : "text-graphite",
            )}
          >
            {tier.name}
          </h3>
          <span
            className={cn("tally font-mono nums", featured ? "text-ink-muted" : "text-faint")}
          >
            {tier.termMonths} months
          </span>
        </div>

        <p
          className={cn(
            "mt-3 text-sm leading-relaxed",
            featured ? "text-ink-text" : "text-pencil",
          )}
        >
          {tier.tagline}
        </p>

        {/* Price: the range binds, the monthly is the same money spread out. */}
        <div
          className={cn(
            "mt-6 border-t-rule pt-4",
            featured ? "border-ink-text/50" : "border-graphite",
          )}
        >
          <span className={cn("tally block font-mono", featured ? "text-ink-muted" : "text-faint")}>
            Package price
          </span>
          <p
            className={cn(
              "mt-1 font-display text-display-sm font-extrabold leading-none nums",
              featured ? "text-revision-onInk" : "text-revision",
            )}
          >
            {rangeFor(tier)}
            <span
              className={cn("tally ml-2 font-mono", featured ? "text-ink-muted" : "text-faint")}
            >
              CAD
            </span>
          </p>

          <p
            className={cn(
              "tally mt-3 flex items-center gap-2 font-mono",
              featured ? "text-ink-text" : "text-graphite",
            )}
          >
            <Icon
              name="CalendarRange"
              className={cn("h-3.5 w-3.5", featured ? "text-revision-onInk" : "text-revision-text")}
            />
            or {monthly.label}/mo × {tier.termMonths}
          </p>
        </div>

        {/* Contents */}
        <div className="mt-6 flex-1">
          {tier.inherits && (
            <p
              className={cn(
                "tally mb-3 border-b pb-2 font-mono",
                featured ? "border-ink-line text-revision-onInk" : "border-line text-revision-text",
              )}
            >
              Everything in {tier.inherits}, plus
            </p>
          )}

          <ul>
            {tier.inclusions.map((inclusion) => (
              <li
                key={inclusion.label}
                className={cn(
                  "flex items-start gap-3 border-b py-2.5 text-sm last:border-b-0",
                  featured ? "border-ink-line text-ink-text" : "border-line text-pencil",
                )}
              >
                <Icon
                  name="Check"
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    featured ? "text-revision-onInk" : "text-revision-text",
                  )}
                />
                <span className="flex-1">{inclusion.label}</span>
                {inclusion.term && (
                  <span
                    className={cn(
                      "tally shrink-0 whitespace-nowrap font-mono",
                      featured ? "text-ink-muted" : "text-faint",
                    )}
                  >
                    {inclusion.term}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <ButtonLink
          href={`/quote?package=${encodeURIComponent(`Kickstarter — ${tier.name}`)}`}
          variant={featured ? "primary" : "outline"}
          className="mt-7 w-full"
        >
          Request this package
          <span className="sr-only"> — {tier.name} Kickstarter</span>
        </ButtonLink>
      </div>
    </article>
  );
}

export default function BusinessKickstarterPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 11"
        eyebrow="Business Kickstarter"
        title={
          <>
            Everything a new business needs to launch
            <span className="accent-dot">.</span>
          </>
        }
        description="A website plus a fixed run of SEO, paid ads and marketing consulting, bundled into one engagement over a defined term. Pay up front or spread it across the months the campaigns actually run."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" size="lg" iconLeft="Calendar">
              Book a free consultation
            </ButtonLink>
            <ButtonLink href="#packages" variant="outline" size="lg">
              Compare packages
            </ButtonLink>
          </>
        }
        bullets={[
          { label: "3, 6 or 12-month terms", icon: "CalendarRange" },
          { label: "Monthly payment option", icon: "Wallet" },
        ]}
      />

      {/* Packages ---------------------------------------------------------- */}
      <section id="packages" className="section bg-sheet">
        <Container>
          <SectionHeading
            no="K01"
            eyebrow="Packages"
            title="Three tiers, one running start"
            align="left"
            description="Each tier includes everything in the one before it, so the only thing to compare is what the extra buys."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {kickstarterTiers.map((tier, index) => (
              <SlideIn key={tier.slug} delay={index * 110}>
                <TierCard tier={tier} />
              </SlideIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Payment plans ----------------------------------------------------- */}
      <ArcEdge from="sheet" to="sheet-sunk" />
      <section className="section bg-sheet-sunk">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <SlideIn from="left">
              <SectionHeading
                no="K02"
                eyebrow="Payment plans"
                title="Pay across the term, not up front"
                align="left"
                description={paymentPlanNote}
              />
              <TitleBlock
                className="mt-10"
                fields={[
                  { label: "Basis", value: "Price ÷ term" },
                  { label: "Interest", value: "None" },
                  { label: "Confirmed in", value: "Proposal" },
                ]}
              />
            </SlideIn>

            <SlideIn from="right" delay={120}>
              {/* The schedule, derived from the same numbers as the cards
                  above so the two can never disagree. */}
              <div className="relative border border-line bg-chalk p-5 sm:p-6">
                <CornerTicks />

                <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
                  <span className="tally font-mono text-graphite">Payment schedule</span>
                  <span className="tally font-mono text-faint nums">
                    {String(kickstarterTiers.length).padStart(2, "0")} tiers
                  </span>
                </div>

                <div className="table-scroll">
                  <table className="w-full min-w-[26rem] border-collapse text-left">
                    <caption className="sr-only">
                      Package price, term and monthly payment for each Kickstarter tier
                    </caption>
                    <thead>
                      <tr>
                        {["Tier", "Package", "Term", "Monthly"].map((heading) => (
                          <th
                            key={heading}
                            scope="col"
                            className="tally border-b border-line py-3 font-mono text-faint"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {kickstarterTiers.map((tier) => {
                        const monthly = monthlyFor(tier);
                        return (
                          <tr key={tier.slug}>
                            <th
                              scope="row"
                              className="border-b border-line py-3.5 pr-3 text-left font-display text-base font-bold uppercase text-graphite"
                            >
                              {tier.name}
                            </th>
                            <td className="border-b border-line py-3.5 pr-3 font-mono text-xs tabular-nums text-pencil">
                              {rangeFor(tier)}
                            </td>
                            <td className="border-b border-line py-3.5 pr-3 font-mono text-xs tabular-nums text-pencil">
                              {tier.termMonths} mo
                            </td>
                            <td className="border-b border-line py-3.5 font-mono text-xs font-semibold tabular-nums text-revision-text">
                              {monthly.label}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="tally mt-4 border-t border-line pt-3 font-mono text-faint">
                  Monthly figures are the package price divided by its term, rounded to the
                  dollar. The total is unchanged.
                </p>
              </div>
            </SlideIn>
          </div>
        </Container>
      </section>

      {/* Process ----------------------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="ink" flip />
      <section className="section surface-ink">
        <Container>
          <SectionHeading
            no="K03"
            eyebrow="How it runs"
            title="The same five stations"
            align="left"
            tone="paper"
            description="A Kickstarter package follows the process every project here follows — the difference is that the campaigns keep running after launch."
          />
          <ProcessStepsRow className="mt-14" steps={homeProcess} tone="paper" />
          <PlateLoop
            className="mx-auto mt-14 max-w-[16rem]"
            src="/video/08-code.mp4"
            poster={codePoster}
            alt="Code being written on screen."
            imageClassName="aspect-[9/16]"
            tone="ink"
            fig="FIG. K04"
            caption="The build stage, as it actually looks."
          />

        </Container>
      </section>

      {/* Not sure which ----------------------------------------------------- */}
      <ArcEdge from="ink" to="sheet" />
      <section className="section bg-sheet">
        <Container narrow>
          <SectionHeading
            no="K04"
            eyebrow="Not sure which"
            title="Start with a conversation"
            align="left"
            description="If you are not certain which tier fits, book the free consultation. We will tell you which one we would recommend and why — including when the smaller one is the right answer."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar">
              Book a free consultation
            </ButtonLink>
            <ArrowLink href="/pricing" idle>
              See individual pricing
            </ArrowLink>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-pencil">
            Prefer to buy the pieces separately?{" "}
            <Link
              href="/pricing"
              className="font-semibold text-revision-text underline decoration-2 underline-offset-4"
            >
              Website packages are listed individually
            </Link>
            , and software, marketing and SEO are quoted after a conversation.
          </p>
        </Container>
      </section>

      <CTASection
        title={
          <>
            Ready to launch properly
            <span className="text-revision-onInk">?</span>
          </>
        }
        description="Thirty minutes, free, no obligation. We will scope the right package for where your business actually is."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a free consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" fullWidth>
              Request a quote
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
