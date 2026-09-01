import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { LegalDocument as LegalDocumentData } from "@/data/legal";
import { mailtoHref, siteConfig } from "@/lib/site";

/**
 * Renders a legal document — privacy policy, terms of service.
 *
 * Shared by both so they cannot drift into looking like two different
 * companies' paperwork, and so the "how to reach us" block below stays in one
 * place: a privacy policy that tells you to exercise your rights without
 * saying where to write is not much of a policy.
 *
 * That block reads from `siteConfig` rather than repeating an address in the
 * content, which means it degrades honestly while contact details are still
 * being confirmed — pointing at the contact form instead of printing a
 * placeholder where an email address should be.
 */
export function LegalDocument({ document }: { document: LegalDocumentData }) {
  const email = siteConfig.contact.email;
  const mailto = mailtoHref();

  const effective = new Date(`${document.effective}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <section className="section">
      <Container narrow>
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-display-lg">{document.title}</h1>

        <p className="mt-4 text-sm text-muted">
          {/* A machine-readable date alongside the human one — this is the field
              a reader checks to see whether the terms changed under them. */}
          Effective <time dateTime={document.effective}>{effective}</time>
        </p>

        <p className="mt-8 max-w-prose border-l-2 border-cobalt pl-5 text-base leading-relaxed text-charcoal">
          {document.summary}
        </p>

        <div className="mt-12 max-w-prose space-y-10">
          {document.blocks.map((block) => (
            <section key={block.heading}>
              <h2 className="font-display text-display-xs text-ink">{block.heading}</h2>

              {block.paragraphs?.map((paragraph, index) => (
                <p key={index} className="mt-4 text-base leading-relaxed text-charcoal">
                  {paragraph}
                </p>
              ))}

              {block.list && (
                <ul className="mt-4 space-y-3">
                  {block.list.map((item) => (
                    <li
                      key={item}
                      className="border-l border-line pl-4 text-base leading-relaxed text-charcoal"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2 className="font-display text-display-xs text-ink">How to contact us</h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal">
              {email && mailto ? (
                <>
                  Write to us at{" "}
                  <a
                    href={mailto}
                    className="font-medium text-cobalt underline underline-offset-2"
                  >
                    {email}
                  </a>
                  , or use the{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-cobalt underline underline-offset-2"
                  >
                    contact form
                  </Link>
                  .
                </>
              ) : (
                <>
                  {/* No confirmed address yet — send people to something that
                      works rather than printing an "email to be added" label
                      into a document about how to exercise a legal right. */}
                  Use the{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-cobalt underline underline-offset-2"
                  >
                    contact form
                  </Link>{" "}
                  and mark your message for the attention of our privacy
                  contact. We read every message.
                </>
              )}
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal">
              {siteConfig.legalName}, {siteConfig.location.display}.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
