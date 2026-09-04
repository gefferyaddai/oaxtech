import Link from "next/link";
import { ArcEdge, BreakLine } from "@/components/ui/Drawing";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { PhoneFrame, SpargoHeroVisual } from "@/components/sections/HeroVisuals";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { spargoCaseStudy as study } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import grocery from "@/assets/09-grocery.jpg";
import { PhotoPlate } from "@/components/ui/Photo";
import mobile from "@/assets/06-mobile.jpg";

export const metadata = buildMetadata({
  title: "Spargo Case Study",
  description:
    "How OAX Tech designed and built Spargo, a mobile price-comparison platform helping shoppers compare store prices and shop more confidently.",
  path: "/work/spargo",
});

function breadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Our Work", item: `${siteConfig.url}/work` },
      { "@type": "ListItem", position: 3, name: "Spargo", item: `${siteConfig.url}/work/spargo` },
    ],
  };
}

export default function SpargoCaseStudyPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 08"
        eyebrow={study.eyebrow}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <li>
                <Link href="/work" className="transition-colors hover:text-ink">
                  Our Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-charcoal" aria-current="page">
                {study.name}
              </li>
            </ol>
          </nav>
        }
        title={
          <>
            <span className="block">{study.name}</span>
            <span className="block text-display-lg">{study.headline}</span>
          </>
        }
        description={study.intro}
        actions={
          <>
            <ButtonLink href={study.externalUrl} variant="primary" size="lg" external iconRight="ArrowUpRight">
              Visit {study.externalLabel}
            </ButtonLink>
            <ButtonLink href="/quote" variant="outline" size="lg" iconRight="ArrowRight">
              Start a Similar Project
            </ButtonLink>
          </>
        }
        visual={<SpargoHeroVisual />}
      />

      {/* Facts strip -------------------------------------------------------- */}
      <section className="bg-cream py-6">
        <Container>
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {study.facts.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border-rule border-graphite bg-revision text-white">
                  <Icon name={fact.icon} className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-2xs uppercase tracking-wide text-muted">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-ink">{fact.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Client overview ---------------------------------------------------- */}
      <div className="bg-sheet">
        <Container>
          <BreakLine />
        </Container>
      </div>
      <section className="section">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-display-sm">Client Overview</h2>
              <p className="mt-4 text-base leading-relaxed text-slate">{study.overview}</p>
            </div>
            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-ink">Project Summary</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{study.projectSummary}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {study.summaryTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-line bg-mist px-2.5 py-1 text-xs text-charcoal"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-8 border-t border-line pt-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
                <Icon name="AlertTriangle" className="h-5 w-5 text-cobalt" />
                The Problem
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate">{study.problem}</p>
            </div>
            <div>
              <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
                <Icon name="Target" className="h-5 w-5 text-cobalt" />
                Project Goals
              </h2>
              <ol className="mt-3 space-y-3">
                {study.goals.map((goal, index) => (
                  <li key={goal} className="flex items-start gap-3 text-sm text-charcoal">
                    <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cobalt-border text-2xs font-medium text-cobalt">
                      {index + 1}
                    </span>
                    {goal}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Solution ----------------------------------------------------------- */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="W01"
            align="left" title="OAX Tech's Solution" />
          <PhotoPlate
            className="mt-12"
            src={grocery}
            alt="Supermarket shelves lined with priced stock."
            imageClassName="aspect-[16/7]"
            sizes="(min-width: 1024px) 1100px, 100vw"
            fig="FIG. SP01"
            caption="The problem Spargo solves sits on a shelf like this one."
          />

          <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <ul className="space-y-6">
              {study.solution.slice(0, 2).map((item) => (
                <li key={item.label}>
                  <Icon name={item.icon} className="mb-2.5 h-5 w-5 text-cobalt" />
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
                </li>
              ))}
            </ul>

            <div className="order-first flex justify-center gap-2 lg:order-none">
              <PhoneFrame title="Compare prices" className="hidden translate-y-4 sm:block" />
              <PhoneFrame title="Find better prices" featured />
              <PhoneFrame title="Smart list" className="hidden translate-y-4 sm:block" />
            </div>

            <ul className="space-y-6">
              {study.solution.slice(2).map((item) => (
                <li key={item.label}>
                  <Icon name={item.icon} className="mb-2.5 h-5 w-5 text-cobalt" />
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Services + technologies -------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="section">
        <Container>
          <SectionHeading
            no="W02"
            align="left" title="Services Provided" />
          <PhotoPlate
            className="mt-12"
            src={mobile}
            alt="A phone held in one hand, app open."
            imageClassName="aspect-[16/7]"
            sizes="(min-width: 1024px) 1100px, 100vw"
            fig="FIG. SP02"
            caption="Built mobile-first, because that is where shoppers are."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {study.servicesProvided.map((item) => (
              <li key={item.label} className="card p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center border-rule border-graphite bg-revision text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </li>
            ))}
          </ul>

          <SectionHeading
            no="W03"
            align="left" title="Technologies Used" className="mt-16" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {study.technologies.map((tech) => (
              <li key={tech.label} className="card flex items-center gap-3 p-4">
                <Icon name={tech.icon} className="h-5 w-5 shrink-0 text-cobalt" />
                <span className="text-sm font-medium text-ink">{tech.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Screens ------------------------------------------------------------ */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="W04"
            align="left"
            title="Screens & Mockups"
            description="Key screens from the app, described rather than embedded as large images so the page stays fast."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {study.screens.map((screen) => (
              <li key={screen.title} className="card overflow-hidden">
                <div className="flex justify-center border-b border-line bg-paper p-5">
                  <PhoneFrame title={screen.title} eyebrow="Screen" />
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-semibold text-ink">{screen.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate">{screen.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Challenges --------------------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="section">
        <Container>
          <SectionHeading
            no="W05"
            align="left" title="Challenges & Solutions" />
          <ul className="mt-10 space-y-4">
            {study.challenges.map((item) => (
              <li key={item.challenge} className="card overflow-hidden">
                <div className="grid grid-cols-1 items-center gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{item.challenge}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate">
                      {item.challengeDetail}
                    </p>
                  </div>
                  <span
                    className="mx-auto inline-flex h-9 w-9 shrink-0 rotate-90 items-center justify-center rounded-full bg-cobalt text-white lg:rotate-0"
                    aria-hidden="true"
                  >
                    <Icon name="ArrowRight" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{item.solution}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate">
                      {item.solutionDetail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Results — qualitative only ----------------------------------------- */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="W06"
            align="left"
            title="Final Results"
            description="Described qualitatively. No user counts, revenue, savings or launch statistics are published for this project."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {study.results.map((result) => (
              <li key={result.label} className="card p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center border-rule border-graphite bg-revision text-white">
                  <Icon name={result.icon} className="h-5 w-5" />
                </span>
                <p className="font-display text-sm font-semibold text-ink">{result.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate">{result.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Testimonial placeholder -------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-tint p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Icon name="MessageSquare" className="mb-4 h-7 w-7 text-cobalt" />
              <p className="font-display text-display-xs text-ink">{study.testimonial.quote}</p>
              <p className="mt-4 text-sm text-slate">— {study.testimonial.attribution}</p>
              {study.testimonial.isPlaceholder && (
                <p className="mt-3 text-xs text-muted">
                  Placeholder. A real quote will appear here once the client has approved it.
                </p>
              )}
            </div>
            <div className="hidden justify-center lg:flex">
              <PhoneFrame title="Find better prices. Save more today." featured />
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Have a Similar Project in Mind?"
        description="Let's work together to build something impactful."
        actions={
          <>
            <ButtonLink href="/quote" variant="primary" iconRight="ArrowRight" fullWidth>
              Start a Similar Project
            </ButtonLink>
            <ButtonLink href="/book" variant="onDark" fullWidth>
              Book a Consultation
            </ButtonLink>
          </>
        }
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema()) }}
      />
    </>
  );
}
