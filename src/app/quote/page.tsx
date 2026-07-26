import { Container } from "@/components/layout/Container";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteHeroVisual } from "@/components/sections/HeroVisuals";
import { ProcessStepsRow } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { quoteFaqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Request a Quote",
  description:
    "Tell OAX Tech about your project and we'll review your requirements, recommend the right approach and provide clear next steps.",
  path: "/quote",
});

const WHAT_HAPPENS_NEXT = [
  { step: "1", label: "We Review Your Request", description: "We carefully review your requirements and assess the best approach.", icon: "ClipboardCheck" },
  { step: "2", label: "You Receive a Response", description: "You'll receive a personalized response with recommendations and next steps.", icon: "Mail" },
  { step: "3", label: "We Schedule a Consultation, If Needed", description: "If helpful, we'll schedule a quick call to clarify details and answer questions.", icon: "Calendar" },
  { step: "4", label: "You Receive a Proposal", description: "We'll send a detailed proposal with scope, timeline and payment terms.", icon: "FileText" },
];

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: selectedPackage } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title={
          <>
            Tell Us What You&apos;re Looking to Build
            <span className="accent-dot">.</span>
          </>
        }
        description="Share a few details about your project and we'll review your requirements, recommend the right approach and provide next steps."
        bullets={[
          { label: "No obligation", icon: "CheckCircle2" },
          { label: "Clear next steps", icon: "Clock" },
          { label: "Personalized response", icon: "ShieldCheck" },
        ]}
        visual={<QuoteHeroVisual />}
      />

      <section className="section">
        <Container>
          <h2 className="sr-only">Quote request form</h2>
          <QuoteForm defaultPackage={selectedPackage} />
        </Container>
      </section>

      <section className="section border-y border-line bg-mist">
        <Container>
          <SectionHeading
            title="What Happens Next"
            description="No quote reference numbers are issued at this stage — we reply to you directly by email."
          />
          <ProcessStepsRow steps={WHAT_HAPPENS_NEXT} className="mt-12" />
        </Container>
      </section>

      <section className="section" id="faq">
        <Container>
          <SectionHeading title="Frequently Asked Questions" />
          <FAQAccordion items={quoteFaqs} className="mt-10" />
        </Container>
      </section>

      <CTASection
        title="Prefer to Talk It Through?"
        description="Let's chat about your project and explore the best solution for your goals."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a Free Consultation
            </ButtonLink>
            <ButtonLink href="/contact" variant="onDark" fullWidth>
              Contact Us
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
