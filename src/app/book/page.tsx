import { ArcEdge } from "@/components/ui/Drawing";
import { Container } from "@/components/layout/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { BookingHeroVisual } from "@/components/sections/HeroVisuals";
import { FeatureGrid } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whatToExpect } from "@/data/availability";
import { bookingFaqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Book a Consultation",
  description:
    "Book a free 30-minute consultation with OAX Tech to discuss your goals, explore the right solution and understand the next steps.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 09"
        eyebrow="Book a consultation"
        title={
          <>
            Let&apos;s Talk About What You&apos;re Building
            <span className="accent-dot">.</span>
          </>
        }
        description="Book a free 30-minute consultation to discuss your goals, explore the right solution and understand the next steps."
        bullets={[
          { label: "Free consultation", icon: "CheckCircle2" },
          { label: "30 minutes", icon: "Clock" },
          { label: "No obligation", icon: "ShieldCheck" },
        ]}
        visual={<BookingHeroVisual />}
      />

      <section className="section">
        <Container>
          <h2 className="sr-only">Book your consultation</h2>
          <BookingFlow />
        </Container>
      </section>

      <ArcEdge from="sheet" to="sheet-sunk" />
      <section className="section bg-mist">
        <Container>
          <SectionHeading
            no="B01"
            align="left" title="What to Expect" />
          <FeatureGrid items={whatToExpect} columns={4} className="mt-10" />
        </Container>
      </section>

      <ArcEdge from="sheet-sunk" to="sheet" flip />
      <section className="section" id="faq">
        <Container>
          <SectionHeading
            no="B02"
            align="left" title="Frequently Asked Questions" />
          <FAQAccordion items={bookingFaqs} className="mt-10" />
        </Container>
      </section>

      <CTASection
        title="Not Ready to Book Yet?"
        description="We're here to help. Reach out and we'll find the best way to support your goals."
        actions={
          <>
            <ButtonLink href="/quote" variant="primary" fullWidth>
              Request a Quote
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
