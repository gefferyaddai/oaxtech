import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { ContactHeroVisual } from "@/components/sections/HeroVisuals";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactFaqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/metadata";
import { PLACEHOLDER_LABELS, mailtoHref, siteConfig, telHref } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with OAX Tech in Calgary, Alberta. Send a message, request a quote, or book a free 30-minute consultation.",
  path: "/contact",
});

const socialIcons: Record<string, string> = {
  LinkedIn: "Linkedin",
  Instagram: "Instagram",
  "X / Twitter": "Twitter",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const emailHref = mailtoHref();
  const phoneHref = telHref();

  return (
    <>
      <PageHero
        sheetNo="SHT 06"
        eyebrow="Contact OAX Tech"
        title={
          <>
            Let&apos;s Start a Conversation
            <span className="accent-dot">.</span>
          </>
        }
        description="Have a question, project idea or partnership opportunity? Send us a message and our team will help you find the right next step."
        bullets={[
          { label: "Friendly guidance", icon: "MessageSquare" },
          { label: "Clear communication", icon: "CheckCircle2" },
          { label: "No obligation", icon: "ShieldCheck" },
        ]}
        visual={<ContactHeroVisual />}
      />

      <section className="section">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <ContactForm defaultSubject={subject} />

            <div className="space-y-6">
              <div className="card p-5 sm:p-6">
                <h2 className="font-display text-lg font-semibold text-ink">Contact Information</h2>
                <ul className="mt-5 space-y-3">
                  {/* Email — placeholder until a real address is supplied. */}
                  <li className="flex items-start gap-3 rounded-lg border border-line bg-mist p-4">
                    <Icon name="Mail" className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">Business Email</p>
                      {siteConfig.contact.email && emailHref ? (
                        <a
                          href={emailHref}
                          className="mt-0.5 block break-words text-sm text-cobalt underline underline-offset-2"
                        >
                          {siteConfig.contact.email}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm italic text-muted">
                          {PLACEHOLDER_LABELS.email}
                        </p>
                      )}
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-lg border border-line bg-mist p-4">
                    <Icon name="Phone" className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">Phone Number</p>
                      {siteConfig.contact.phone && phoneHref ? (
                        <a
                          href={phoneHref}
                          className="mt-0.5 block text-sm text-cobalt underline underline-offset-2"
                        >
                          {siteConfig.contact.phone}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm italic text-muted">
                          {PLACEHOLDER_LABELS.phone}
                        </p>
                      )}
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-lg border border-line bg-mist p-4">
                    <Icon name="MapPin" className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
                    <div>
                      <p className="text-sm font-medium text-ink">Location</p>
                      <p className="mt-0.5 text-sm text-slate">{siteConfig.location.display}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-lg border border-line bg-mist p-4">
                    <Icon name="Clock" className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
                    <div>
                      <p className="text-sm font-medium text-ink">Business Hours</p>
                      <p className="mt-0.5 text-sm text-slate">
                        {siteConfig.contact.hours ?? PLACEHOLDER_LABELS.hours}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card p-5 sm:p-6">
                <h2 className="font-display text-lg font-semibold text-ink">Connect With Us</h2>
                <ul className="mt-4 divide-y divide-line-subtle">
                  {siteConfig.socials.map((social) => (
                    <li key={social.label} className="py-3 first:pt-0 last:pb-0">
                      {social.url ? (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm font-medium text-ink"
                        >
                          <Icon
                            name={socialIcons[social.label] ?? "Globe"}
                            className="h-5 w-5 text-cobalt"
                          />
                          {social.label}
                          <Icon name="ArrowUpRight" className="ml-auto h-4 w-4 text-muted" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-muted">
                          <Icon
                            name={socialIcons[social.label] ?? "Globe"}
                            className="h-5 w-5 text-muted"
                          />
                          {social.label}
                          <span className="ml-auto text-xs italic">
                            {PLACEHOLDER_LABELS.social}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary paths ------------------------------------------------ */}
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center border-rule border-graphite bg-revision text-white">
                <Icon name="FileText" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold text-ink">
                  Have a Project in Mind?
                </h2>
                <p className="mt-1.5 text-sm text-slate">
                  Tell us about your goals and we&apos;ll create a custom proposal tailored to your
                  needs.
                </p>
                <ButtonLink href="/quote" variant="outline" size="sm" className="mt-4 w-full sm:w-auto">
                  Request a Quote
                </ButtonLink>
              </div>
            </div>

            <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center border-rule border-graphite bg-revision text-white">
                <Icon name="Calendar" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold text-ink">Ready to Talk?</h2>
                <p className="mt-1.5 text-sm text-slate">
                  Book a free 30-minute consultation to explore your project and the right solution.
                </p>
                <ButtonLink href="/book" variant="primary" size="sm" className="mt-4 w-full sm:w-auto">
                  Book a Free Consultation
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section border-t border-line bg-mist" id="faq">
        <Container narrow>
          <SectionHeading
            no="C01"
            align="left" title="Frequently Asked Questions" />
          <FAQAccordion items={contactFaqs} columns={1} className="mt-10" />
        </Container>
      </section>

      <CTASection
        title="Ready to Take the Next Step?"
        description="We're here to help you move your business forward with clarity and confidence."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" iconLeft="Calendar" fullWidth>
              Book a Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" fullWidth>
              Request a Quote
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
