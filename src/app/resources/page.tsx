import { ArcEdge } from "@/components/ui/Drawing";
import { Container } from "@/components/layout/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { ResourcesBrowser } from "@/components/sections/ResourcesBrowser";
import { ButtonLink } from "@/components/ui/Button";
import { articles } from "@/data/articles";
import { buildMetadata } from "@/lib/metadata";
import writing from "@/assets/11-writing.jpg";
import { PhotoPlate } from "@/components/ui/Photo";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Practical guides on website development, software and automation, marketing, SEO and business technology from the OAX Tech team.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        sheetNo="SHT 11"
        eyebrow="Resources"
        centered
        title="Practical Guides for Growing Businesses"
        description="Straightforward writing on websites, software, marketing and SEO — no hype, no guaranteed-results claims."
      />

      <section className="section">
        <Container>
          <h2 className="sr-only">All resources</h2>
          <ResourcesBrowser articles={articles} />
        </Container>
      </section>

      <ArcEdge from="sheet" to="sheet-sunk" />
      <section className="section bg-mist">
        <Container narrow>
          <PhotoPlate
            className="mx-auto mb-10 max-w-xl"
            src={writing}
            alt="A notebook and pen on a desk, mid-sentence."
            imageClassName="aspect-[16/6]"
            sizes="(min-width: 640px) 576px, 100vw"
            fig="FIG. R01"
            caption="Guides written from work we have actually delivered."
          />

          <div className="card mx-auto max-w-xl p-6 sm:p-8">
            <h2 className="font-display text-display-xs">Get new guides by email</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Occasional, practical writing on building and growing online. No sales sequences.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        edgeFrom="sheet-sunk"
        title="Have a Question We Haven't Covered?"
        description="Ask us directly — we'd rather give you a straight answer than write around it."
        actions={
          <>
            <ButtonLink href="/contact" variant="primary" fullWidth>
              Contact Us
            </ButtonLink>
            <ButtonLink href="/book" variant="onDark" fullWidth>
              Book a Consultation
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
