import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { WorkHeroVisual } from "@/components/sections/HeroVisuals";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { WorkFilter } from "@/components/sections/WorkFilter";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { outcomeAreas, projects } from "@/data/projects";
import { capabilities } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Our Work",
  description:
    "Projects by OAX Tech: the Spargo price-comparison app, the GHSA community website, and an automated stock-market analysis system.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 08"
        eyebrow="Our work"
        title="Ideas We've Turned Into Digital Experiences"
        description="We turn business and community problems into useful digital products that make a real difference."
        actions={
          <>
            <ButtonLink href="#projects" variant="primary" size="lg">
              View Our Work
            </ButtonLink>
            <ButtonLink href="/quote" variant="outline" size="lg" iconRight="ArrowRight">
              Start a Project
            </ButtonLink>
          </>
        }
        visual={<WorkHeroVisual />}
      />

      <section className="section" id="projects">
        <Container>
          <h2 className="sr-only">Projects</h2>
          <WorkFilter projects={projects} />
        </Container>
      </section>

      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading
            no="W01"
            align="left" title="Explore by Capability" />
          <FeatureGrid items={capabilities} columns={5} className="mt-10" />
        </Container>
      </section>

      <section className="section bg-tint">
        <Container>
          <SectionHeading
            no="W02"
            align="left" title="Real Solutions. Meaningful Results." />
          <FeatureGrid items={outcomeAreas} columns={4} className="mt-10" />
          <p className="mt-8 text-center text-sm text-slate">
            We describe outcomes in terms of what a solution does. Measured figures appear here only
            once a client has confirmed them.
          </p>
        </Container>
      </section>

      {/* No client testimonials are published until they're approved in writing. */}
      <section className="section">
        <Container narrow>
          <SectionHeading
            no="W03"
            align="left" title="What Our Clients Say" />
          <div className="card mx-auto mt-8 max-w-md p-8 text-center">
            <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center border-rule border-graphite bg-revision text-white">
              <Icon name="MessageSquare" className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-semibold text-ink">
              Client success story coming soon
            </p>
            <p className="mt-2 text-sm text-slate">
              Stay tuned for real stories from the teams we work with.
            </p>
          </div>
        </Container>
      </section>

      <CTASection
        title="Let's Build Your Next Project"
        description="Have an idea or need a solution? Let's work together to bring it to life."
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
