import { ArcEdge, BreakLine } from "@/components/ui/Drawing";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { LearnMoreHeroVisual } from "@/components/sections/HeroVisuals";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { StoryVideoPlate } from "@/components/sections/StoryVideoPlate";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collaborationProcess } from "@/data/services";
import {
  businessExpertise,
  collaborationPrinciples,
  companyStrengths,
  growWithUs,
  hasStoryVideo,
  storyVideo,
  technicalExpertise,
} from "@/data/company";
import { buildMetadata } from "@/lib/metadata";

/**
 * This page replaced /team. The old page led with five profile cards whose
 * photographs never arrived, so every one of them rendered a monogram
 * placeholder — a roster of nobody. The company story is now told directly, by
 * one of the founders, on camera.
 *
 * /team permanently redirects here (next.config.ts) so existing links survive.
 *
 * INDEXED ONLY ONCE THE FOOTAGE EXISTS.
 *
 * The page's whole reason to be is the video. Until `storyVideo.src` is set it
 * renders a "footage pending" plate, and a thin placeholder is the last thing
 * that should be competing in search results for the company's own name — it
 * would be the page Google shows for "OAX Tech story". The route stays live
 * and returns 200 throughout, so the permanent /team redirect always resolves;
 * it is simply not advertised. Dropping the recording in flips this, the
 * sitemap entry and the navigation links together.
 */
export const metadata = buildMetadata({
  title: "Learn More About Us",
  description:
    "Hear the OAX Tech story first-hand: where the company started, what we build, how we work, and who we build it for.",
  path: "/learn-more",
  noIndex: !hasStoryVideo,
});

export default function LearnMorePage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 07"
        eyebrow="Learn more about us"
        title="Hear It From Us Directly"
        description="Rather than a page of headshots, here is the story in our own words — where OAX Tech came from, what we build, and how we work with the people who hire us."
        actions={
          <>
            <ButtonLink href="#story" variant="dark" size="lg" iconLeft="Play">
              Watch the Story
            </ButtonLink>
            <ButtonLink href="/work" variant="outline" size="lg" iconRight="ArrowRight">
              Explore Our Work
            </ButtonLink>
          </>
        }
        visual={<LearnMoreHeroVisual covers={storyVideo.covers} />}
      />

      <section className="py-10">
        <Container>
          <FeatureGrid items={companyStrengths} columns={4} variant="plain" />
        </Container>
      </section>

      {/* The video ---------------------------------------------------------- */}
      <div className="bg-sheet">
        <Container>
          <BreakLine />
        </Container>
      </div>
      <section className="section" id="story">
        <Container>
          <SectionHeading
            no="L01"
            align="left"
            eyebrow="Our story"
            title="The OAX Tech Story"
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
            <StoryVideoPlate video={storyVideo} />

            {/* Written alongside the video, not instead of it. A visitor who
                cannot play video — or a crawler, which never can — still gets
                what the video covers. */}
            <div>
              <p className="eyebrow">What it covers</p>
              <ol className="mt-6 space-y-6">
                {storyVideo.covers.map((cover, index) => (
                  <li key={cover.label} className="flex gap-4">
                    <span className="tally inline-flex h-7 w-7 shrink-0 items-center justify-center border border-graphite font-mono text-graphite nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-ink">{cover.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate">
                        {cover.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm leading-relaxed text-slate">
                  Questions the video doesn&apos;t answer? Ask us directly — you&apos;ll
                  get a person, not a form letter.
                </p>
                <ButtonLink
                  href="/contact"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  iconRight="ArrowRight"
                >
                  Get in Touch
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How we work -------------------------------------------------------- */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="L02"
            align="left"
            eyebrow="How we work together"
            title="A Shared, Transparent Process"
          />
          <ProcessStepsRow steps={collaborationProcess} className="mt-12" />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate">
            Engineers, analysts and outreach specialists share context at every stage — ensuring
            technology and strategy work together to create lasting results.
          </p>
        </Container>
      </section>

      {/* What we bring ------------------------------------------------------ */}
      <ArcEdge from="sheet-sunk" to="sheet" />
      <section className="section">
        <Container>
          <SectionHeading
            no="L03"
            align="left"
            eyebrow="Our strength"
            title="Technical Skill Meets Business Understanding"
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <Icon name="Code2" className="h-5 w-5 text-cobalt" />
                <h3 className="font-display text-base font-semibold text-ink">Technical Expertise</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                We design and develop modern digital solutions that are secure, scalable and built
                for performance.
              </p>
              <ul className="mt-5 space-y-2.5">
                {technicalExpertise.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <Icon name="BarChart3" className="h-5 w-5 text-cobalt" />
                <h3 className="font-display text-base font-semibold text-ink">Business Expertise</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                We help organizations grow with strategy, visibility and meaningful client
                connections.
              </p>
              <ul className="mt-5 space-y-2.5">
                {businessExpertise.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Principles --------------------------------------------------------- */}
      <ArcEdge from="sheet" to="sheet-sunk" flip />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="L04"
            align="left"
            eyebrow="Our collaboration principles"
            title="How We Hold Ourselves to It"
          />
          <FeatureGrid items={collaborationPrinciples} columns={4} className="mt-10" />
        </Container>
      </section>

      {/* Grow with us ------------------------------------------------------- */}
      <ArcEdge from="sheet-sunk" to="tint" />
      <section className="section bg-tint">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="eyebrow">Grow with OAX Tech</p>
              <h2 className="mt-3 text-display-sm">Grow With OAX Tech</h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                We&apos;re always open to meeting developers, designers, marketers and ambitious
                students interested in meaningful digital work.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {growWithUs.map((item) => (
                <li key={item.label} className="card flex h-full flex-col p-5">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center border-rule border-graphite bg-revision text-white">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{item.description}</p>
                  <ButtonLink
                    href={item.ctaHref}
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full"
                    iconRight="ArrowRight"
                  >
                    {item.ctaLabel}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CTASection
        edgeFrom="tint"
        title={
          <>
            Let&apos;s Build Something Great Together
            <span className="accent-dot">.</span>
          </>
        }
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconRight="ArrowRight" fullWidth>
              Book a Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" iconRight="ArrowRight" fullWidth>
              Request a Quote
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
