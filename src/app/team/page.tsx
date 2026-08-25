
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { TeamHeroVisual } from "@/components/sections/HeroVisuals";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { TeamMemberCard } from "@/components/sections/TeamMemberCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collaborationProcess } from "@/data/services";
import {
  businessExpertise,
  collaborationPrinciples,
  growWithUs,
  team,
  teamStrengths,
  technicalExpertise,
} from "@/data/team";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Our Team",
  description:
    "A multidisciplinary team combining software development, AI, business strategy and client outreach to build practical solutions that create real value.",
  path: "/team",
});

export default function TeamPage() {
  const initials = team.map((m) =>
    m.name.split(" ").map((p) => p[0]).slice(0, 2).join(""),
  );

  return (
    <>
      <PageHero
        sheetNo="SHT 07"
        eyebrow="Our team"
        title="The People Behind OAX Tech"
        description="A multidisciplinary team combining software development, AI, business strategy and client outreach to build practical solutions that create real value."
        actions={
          <>
            <ButtonLink href="/contact" variant="dark" size="lg" iconRight="ArrowRight">
              Work With Our Team
            </ButtonLink>
            <ButtonLink href="/work" variant="outline" size="lg" iconRight="ArrowRight">
              Explore Our Work
            </ButtonLink>
          </>
        }
        visual={<TeamHeroVisual initials={initials} />}
      />

      <section className="border-b border-line py-10">
        <Container>
          <FeatureGrid items={teamStrengths} columns={4} variant="plain" />
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            no="T01"
            align="left" eyebrow="Meet the team" title="The People Behind OAX Tech" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {team.map((member) => (
              <li key={member.slug}>
                <TeamMemberCard member={member} />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-xs text-muted">
            Avatars are neutral placeholders. Approved photography will replace them before launch.
          </p>
        </Container>
      </section>

      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading
            no="T02"
            align="left" eyebrow="How we work together" title="A Shared, Transparent Process" />
          <ProcessStepsRow steps={collaborationProcess} className="mt-12" />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate">
            Engineers, analysts and outreach specialists share context at every stage — ensuring
            technology and strategy work together to create lasting results.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            no="T03"
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

      <section className="section border-t border-line bg-mist">
        <Container>
          <SectionHeading
            no="T04"
            align="left" eyebrow="Our collaboration principles" title="How We Hold Ourselves to It" />
          <FeatureGrid items={collaborationPrinciples} columns={4} className="mt-10" />
        </Container>
      </section>

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
