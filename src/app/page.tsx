import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArticleCard } from "@/components/sections/ArticleCard";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { HomeHero } from "@/components/sections/HomeHero";
import { PricingCard } from "@/components/sections/PricingCard";
import { CompactProjectCard } from "@/components/sections/ProjectCard";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { ClientRegister, ResultsLedger, TestimonialCarousel } from "@/components/sections/Proof";
import { FeatureGrid, ServiceCard } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { AngularEdge, ArrowLink, TitleBlock } from "@/components/ui/Drawing";
import {
  ClipReveal,
  SheetIndexRail,
  SlideIn,
  TallyMarquee,
  type SheetIndexEntry,
} from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publishedArticles } from "@/data/articles";
import { homeFaqs } from "@/data/faqs";
import { websitePackages } from "@/data/pricing";
import { projects, trustedBy } from "@/data/projects";
import { RESULTS_PLACEHOLDER_CELLS, clientResults } from "@/data/results";
import { homeProcess, services, valueProps } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Websites, Software, Marketing & SEO in Calgary`,
  description:
    "OAX Tech designs high-performing websites, builds custom software, and creates marketing and SEO strategies that help Calgary businesses grow.",
  path: "/",
});

/**
 * The sheet index, rendered as a pinned rail on wide screens. Ids here must
 * match the `id` on each section below, and sheet 01 is the hero.
 */
const SHEET_INDEX: SheetIndexEntry[] = [
  { id: "sheet-01", no: "01", label: "Cover" },
  { id: "sheet-02", no: "02", label: "Client register" },
  { id: "sheet-03", no: "03", label: "Services" },
  { id: "sheet-04", no: "04", label: "About" },
  { id: "sheet-05", no: "05", label: "Process" },
  { id: "sheet-06", no: "06", label: "Featured work" },
  { id: "sheet-07", no: "07", label: "Measured results" },
  { id: "sheet-08", no: "08", label: "The difference" },
  { id: "sheet-09", no: "09", label: "Pricing" },
  { id: "sheet-10", no: "10", label: "Client words" },
  { id: "sheet-11", no: "11", label: "Resources" },
  { id: "sheet-12", no: "12", label: "FAQ" },
];

/**
 * ============================================================================
 * THE DRAWING SET
 * ============================================================================
 *
 * Twelve numbered sheets and a closing sheet. Each one uses a different
 * composition — legend, register, grid, split, spine, band, ledger, statement,
 * schedule, list — while staying inside one grammar: rule weight carries rank,
 * state is a mark rather than a fade, and every container is square.
 *
 * The grounds alternate deliberately so the scroll has a pulse: paper, paper,
 * sunk, paper, INK, paper, paper, ORANGE, sunk, paper, sunk, INK. The two
 * full-bleed bands (the process spine and the positioning statement) are where
 * the page gets loud, and they are spaced far enough apart that neither wears
 * out.
 *
 * Motion follows the same logic — see components/ui/Motion.tsx. Section rules
 * draw themselves, split sections slide their halves in from opposite edges,
 * the process spine is laid down by a plotter head, and the register strip is
 * the one thing that moves continuously.
 */
export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const latestArticles = publishedArticles().slice(0, 3);

  /* Real capability names, taken from the services data rather than written
     for the strip — nothing here is a claim the services pages don't make. */
  const registerItems = services.flatMap((service) =>
    service.features.slice(0, 4).map((feature) => feature.label),
  );

  return (
    <>
      <SheetIndexRail entries={SHEET_INDEX} />

      {/* SHEET 01 — Cover ------------------------------------------------- */}
      <HomeHero />

      {/* SHEET 02 — Client register ---------------------------------------
          A strip, not a full section: `.section` padding either side of a
          two-row register leaves a gap that reads as a mistake rather than
          as rhythm. */}
      <section id="sheet-02" className="bg-sheet py-12 lg:py-16">
        <Container>
          <SlideIn>
            <ClientRegister clients={trustedBy} />
          </SlideIn>
          {/* Only organisations that have confirmed permission appear above. */}
        </Container>
      </section>

      {/* Register strip — the page's one continuous moving part ------------ */}
      <div className="border-y border-line bg-sheet-sunk">
        <TallyMarquee items={registerItems} speedSeconds={55} />
      </div>

      {/* SHEET 03 — Services ---------------------------------------------- */}
      <section id="sheet-03" className="section bg-sheet-sunk">
        <Container>
          <SectionHeading
            no="SHT 03"
            eyebrow="What we do"
            title="Services that drive growth"
            align="left"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <SlideIn key={service.slug} delay={index * 110}>
                <ServiceCard service={service} no={service.id} />
              </SlideIn>
            ))}
          </div>

          <SlideIn delay={140}>
            <p className="mt-10 text-base text-pencil">
              Looking for marketing or search support?{" "}
              <Link
                href="/services/marketing-seo"
                className="font-semibold text-revision-text underline decoration-2 underline-offset-4"
              >
                See our marketing and SEO services
              </Link>
              .
            </p>
          </SlideIn>
        </Container>
      </section>

      {/* SHEET 04 — Positioning split ------------------------------------- */}
      <section id="sheet-04" className="section bg-sheet">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <SlideIn from="left">
              <SectionHeading
                no="SHT 04"
                eyebrow="About"
                title="One team for the build and the growth"
                align="left"
                description="OAX Tech is a Calgary-based digital agency focused on delivering smart, scalable, and measurable solutions. From modern websites and custom software to data-driven marketing and SEO, we help businesses thrive in the digital world."
              />
              <div className="mt-8">
                <ArrowLink href="/about" idle>
                  More about us
                </ArrowLink>
              </div>
              <TitleBlock
                className="mt-12"
                fields={[
                  { label: "Founded", value: String(siteConfig.foundedYear) },
                  { label: "Base", value: "Calgary AB" },
                  { label: "Disciplines", value: "04" },
                ]}
              />
            </SlideIn>

            <SlideIn from="right" delay={120}>
              <FeatureGrid items={valueProps} columns={2} variant="plain" />
            </SlideIn>
          </div>
        </Container>
      </section>

      {/* SHEET 05 — Process spine, full-bleed ink -------------------------- */}
      <AngularEdge tone="ink" />
      <section id="sheet-05" className="section surface-ink">
        <Container>
          <SectionHeading
            no="SHT 05"
            eyebrow="Our process"
            title="A clear path to success"
            align="left"
            tone="paper"
            description="Five stations from first conversation to ongoing growth. You always know which one you are at."
          />

          <ProcessStepsRow className="mt-14" steps={homeProcess} tone="paper" />
        </Container>
      </section>

      {/* SHEET 06 — Featured work ----------------------------------------- */}
      <section id="sheet-06" className="section bg-sheet">
        <Container>
          <SectionHeading
            no="SHT 06"
            eyebrow="Featured work"
            title="Solutions we're proud of"
            align="left"
            action={<ArrowLink href="/work">View our work</ArrowLink>}
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, index) => (
              <SlideIn key={project.slug} delay={index * 110}>
                <CompactProjectCard
                  project={project}
                  no={`PRJ ${String(index + 1).padStart(2, "0")}`}
                />
              </SlideIn>
            ))}
          </div>
        </Container>
      </section>

      {/* SHEET 07 — Results ledger ----------------------------------------
          No client results are published until they are measured, attributable
          and approved in writing. The band is drawn as hatched empty cells
          rather than hidden or filled with plausible figures — see
          src/data/results.ts for the rule this enforces. */}
      <section id="sheet-07" className="section border-t border-line bg-sheet">
        <Container>
          <SectionHeading
            no="SHT 07"
            eyebrow="Measured results"
            title="Figures we can stand behind"
            align="left"
            description="We publish a number only when it is measured, attributable to the work, and approved by the client. These cells stay open until all three are true — which is also how we will report on your project."
          />

          <SlideIn delay={100}>
            <ResultsLedger
              className="mt-12"
              results={clientResults}
              placeholderCells={RESULTS_PLACEHOLDER_CELLS}
            />
          </SlideIn>
        </Container>
      </section>

      {/* SHEET 08 — Positioning statement, full-bleed revision ------------- */}
      <AngularEdge tone="revision" />
      <section id="sheet-08" className="relative bg-revision pb-20 pt-8 text-white lg:pb-28 lg:pt-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <SlideIn>
              <span className="tally font-mono text-white/80">The difference</span>
            </SlideIn>

            <ClipReveal as="p" className="mt-6" delay={60}>
              <span className="block text-balance font-display text-display-xl font-extrabold uppercase leading-[0.88] text-white">
                Development, design, marketing and SEO from the same team that builds it.
              </span>
            </ClipReveal>

            <SlideIn delay={180}>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/90">
                No handoffs between vendors, no one blaming the other when results stall. You
                work directly with the people doing the work.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/book" variant="dark" size="lg" iconLeft="Calendar">
                  Book a free consultation
                </ButtonLink>
              </div>
            </SlideIn>
          </div>
        </Container>
      </section>

      {/* SHEET 09 — Pricing ------------------------------------------------ */}
      <section id="sheet-09" className="section bg-sheet-sunk">
        <Container>
          <SectionHeading
            no="SHT 09"
            eyebrow="Pricing"
            title="Published, not quoted on request"
            align="left"
            description="Website package pricing is on the site because you should be able to budget before you talk to anyone."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {websitePackages.map((pkg, index) => (
              <SlideIn key={pkg.slug} delay={index * 110}>
                <PricingCard pkg={pkg} />
              </SlideIn>
            ))}
          </div>

          <SlideIn delay={140}>
            <p className="mt-10 text-base text-pencil">
              Need something custom?{" "}
              <Link
                href="/contact"
                className="font-semibold text-revision-text underline decoration-2 underline-offset-4"
              >
                Contact us
              </Link>{" "}
              for a tailored quote, or see the{" "}
              <Link
                href="/pricing"
                className="font-semibold text-revision-text underline decoration-2 underline-offset-4"
              >
                full pricing breakdown
              </Link>
              .
            </p>
          </SlideIn>
        </Container>
      </section>

      {/* SHEET 10 — Client words ------------------------------------------
          A real carousel with real controls, currently rendering its awaiting-
          approval state because no client has signed off on a quote. Adding an
          entry to src/data/testimonials.ts switches it on with no redesign. */}
      <section id="sheet-10" className="section bg-sheet">
        <Container>
          <SectionHeading
            no="SHT 10"
            eyebrow="Client words"
            title="In their words, once they've approved them"
            align="left"
          />

          <SlideIn delay={100}>
            <TestimonialCarousel className="mt-12" testimonials={testimonials} />
          </SlideIn>
        </Container>
      </section>

      {/* SHEET 11 — Resources ---------------------------------------------- */}
      {latestArticles.length > 0 && (
        <section id="sheet-11" className="section border-t border-line bg-sheet-sunk">
          <Container>
            <SectionHeading
              no="SHT 11"
              eyebrow="Resources"
              title="Practical guides for growing businesses"
              align="left"
              action={<ArrowLink href="/resources">All resources</ArrowLink>}
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article, index) => (
                <SlideIn key={article.slug} delay={index * 110}>
                  <ArticleCard article={article} />
                </SlideIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* SHEET 12 — FAQ ---------------------------------------------------- */}
      <section id="sheet-12" className="section bg-sheet">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <SlideIn from="left">
              <SectionHeading no="SHT 12" eyebrow="FAQ" title="Common questions" align="left" />
            </SlideIn>
            <SlideIn from="right" delay={120}>
              <FAQAccordion items={homeFaqs} />
            </SlideIn>
          </div>
        </Container>
      </section>

      {/* CLOSING SHEET ----------------------------------------------------- */}
      <CTASection
        title={
          <>
            Ready to build something great
            <span className="text-revision-onInk">?</span>
          </>
        }
        description="Let's talk about your project and how we can help you achieve your goals. Thirty minutes, free, no obligation."
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
