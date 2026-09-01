import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { AboutHeroVisual } from "@/components/sections/HeroVisuals";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutHighlights, collaborationProcess, companyValues, differentiators } from "@/data/services";
import { communityWork, hasStoryVideo, missionVision, storyVideo } from "@/data/company";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "OAX Tech is a Calgary-based technology and digital-growth agency helping businesses and organizations turn ideas into practical digital solutions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 02"
        eyebrow="About OAX Tech"
        title="Building Technology That Creates Real Opportunities"
        description={`${siteConfig.name} is a Calgary-based technology and digital-growth agency helping businesses and organizations turn ideas into practical digital solutions.`}
        actions={
          <>
            {/* Until the story footage exists, this slot points at real work
                rather than at a "footage pending" plate. See `hasStoryVideo`. */}
            {hasStoryVideo ? (
              <ButtonLink href="/learn-more" variant="dark" size="lg">
                Learn More About Us
              </ButtonLink>
            ) : (
              <ButtonLink href="/work" variant="dark" size="lg">
                See Our Work
              </ButtonLink>
            )}
            <ButtonLink href="/contact" variant="outline" size="lg">
              Work With Us
            </ButtonLink>
          </>
        }
        visual={<AboutHeroVisual />}
      />

      <section className="border-b border-line py-10">
        <Container>
          <FeatureGrid items={aboutHighlights} columns={4} />
        </Container>
      </section>

      {/* Our story ---------------------------------------------------------- */}
      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">Our story</p>
              <h2 className="mt-3 text-display-md">
                Created to Make Digital Growth More Accessible
                <span className="accent-dot">.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate">
                We started OAX Tech after seeing too many great ideas struggle to grow online. Many
                businesses and organizations have the vision, but they often can&apos;t find
                practical, trustworthy support across technology, design, marketing and SEO.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate">
                OAX Tech brings those disciplines together under one roof. We build clear strategies,
                create custom solutions, and deliver ongoing support so our clients can focus on what
                they do best.
              </p>
            </div>
            <div className="card p-6 lg:p-8">
              <p className="font-display text-sm font-semibold text-ink">Project roadmap</p>
              <ol className="mt-5 space-y-4">
                {["Strategy", "Design", "Build", "Launch"].map((phase, index) => (
                  <li key={phase} className="flex items-center gap-3">
                    <span
                      className={
                        index < 2
                          ? "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cobalt text-white"
                          : "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-2xs text-muted"
                      }
                    >
                      {index < 2 ? <Icon name="Check" className="h-3 w-3" strokeWidth={3} /> : index + 1}
                    </span>
                    <span className="text-sm text-charcoal">{phase}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Mission and vision */}
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            <div className="card flex items-start gap-5 p-6 lg:p-8">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">Our Mission</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  {missionVision.mission.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{missionVision.mission.body}</p>
              </div>
              <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line text-cobalt sm:inline-flex">
                <Icon name="Target" className="h-7 w-7" />
              </span>
            </div>
            <div className="card flex items-start gap-5 p-6 lg:p-8">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">Our Vision</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  {missionVision.vision.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{missionVision.vision.body}</p>
              </div>
              <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line text-cobalt sm:inline-flex">
                <Icon name="Eye" className="h-7 w-7" />
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Values ------------------------------------------------------------- */}
      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading
            no="A01"
            align="left" eyebrow="Our values" title="The Principles Behind Our Work" />
          <FeatureGrid items={companyValues} columns={5} className="mt-10" />
        </Container>
      </section>

      {/* Differentiators ---------------------------------------------------- */}
      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">What makes OAX Tech different</p>
              <h2 className="mt-3 text-display-md">
                More Than a Service Provider. A Growth Partner
                <span className="accent-dot">.</span>
              </h2>
              <ol className="mt-8 space-y-6">
                {differentiators.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cobalt-border text-2xs font-semibold text-cobalt">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="space-y-3 lg:pt-8">
              {[
                { label: "Strategy", detail: "Research, planning & goal setting", icon: "Search" },
                { label: "Design", detail: "User experience & creative design", icon: "PenSquare" },
                { label: "Build", detail: "Custom development & integrations", icon: "Code2" },
                { label: "Grow", detail: "SEO, analytics & continuous growth", icon: "TrendingUp" },
              ].map((layer, index) => (
                <li
                  key={layer.label}
                  className={
                    index === 3
                      ? "flex items-center gap-4 border-rule border-graphite bg-revision p-5 text-white"
                      : "plate flex items-center gap-4 p-5"
                  }
                  style={{ marginLeft: `${index * 8}px` }}
                >
                  <Icon
                    name={layer.icon}
                    className={index === 3 ? "h-5 w-5 shrink-0 text-white" : "h-5 w-5 shrink-0 text-cobalt"}
                  />
                  <div>
                    <p
                      className={
                        index === 3
                          ? "font-display text-sm font-semibold text-white"
                          : "font-display text-sm font-semibold text-ink"
                      }
                    >
                      {layer.label}
                    </p>
                    <p className={index === 3 ? "text-xs text-white/80" : "text-xs text-slate"}>
                      {layer.detail}
                    </p>
                  </div>
                </li>
              ))}
              <li className="card ml-8 flex items-center gap-4 p-5">
                <Icon name="TrendingUp" className="h-5 w-5 shrink-0 text-cobalt" />
                <div>
                  <p className="font-display text-sm font-semibold text-ink">End-to-End Support</p>
                  <p className="text-xs text-slate">
                    From strategy to ongoing growth, we&apos;re with you every step of the way.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Giving back -------------------------------------------------------- */}
      <section className="section bg-tint">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="eyebrow">Giving back</p>
              <h2 className="mt-3 text-display-sm">Technology That Gives Back</h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                We believe in using technology to make a positive impact. OAX Tech supports students,
                community organizations and local businesses through meaningful digital initiatives.
              </p>
              <ButtonLink href="/work" variant="primary" className="mt-6" iconRight="ArrowRight">
                Explore Our Community Work
              </ButtonLink>
            </div>
            <FeatureGrid items={communityWork} columns={2} />
          </div>
        </Container>
      </section>

      {/* Story video pointer -------------------------------------------------
          This slot used to hold a strip of team profile cards. It now points at
          the recorded story instead — the same "who are these people" question,
          answered by us rather than by five placeholder avatars. */}
      <section className="section">
        <Container>
          <SectionHeading
            no="A02"
            align="left" eyebrow="In our own words" title="Learn More About Us" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-base leading-relaxed text-slate">{storyVideo.description}</p>
              {/* A Play button that leads to no video is the one promise this
                  page must not make. The four covers below still describe what
                  we're about, so the section reads without it. */}
              {hasStoryVideo && (
                <ButtonLink href="/learn-more" variant="primary" className="mt-7" iconLeft="Play">
                  Watch Our Story
                </ButtonLink>
              )}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {storyVideo.covers.map((cover) => (
                <li key={cover.label} className="card flex h-full flex-col p-5">
                  <p className="font-display text-sm font-semibold text-ink">{cover.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{cover.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section border-t border-line bg-mist" id="our-process">
        <Container>
          <SectionHeading
            no="A03"
            align="left" eyebrow="Our process" title="A Collaborative, Straightforward Approach" />
          <ProcessStepsRow steps={collaborationProcess} className="mt-12" />
        </Container>
      </section>

      <CTASection
        title={
          <>
            Let&apos;s Build Something Meaningful Together
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
