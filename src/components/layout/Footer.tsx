import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { footerNav, legalNav } from "@/data/navigation";
import { PLACEHOLDER_LABELS, copyrightYears, mailtoHref, siteConfig, telHref } from "@/lib/site";

const socialIcons: Record<string, string> = {
  LinkedIn: "Linkedin",
  Instagram: "Instagram",
  "X / Twitter": "Twitter",
  YouTube: "Youtube",
};

/**
 * The sheet's foot: the full title block of the drawing set.
 *
 * Every column is a ruled field, and the bottom strip is the record row —
 * copyright, legal links, and the sheet's own reference. Unconfirmed contact
 * details keep the same honest treatment they had before: rendered, visibly
 * marked as pending, and never a dead link. Here they read as an unfilled
 * field on a form, which is exactly what they are.
 */
export function Footer() {
  const email = siteConfig.contact.email;
  const phone = siteConfig.contact.phone;
  const emailHref = mailtoHref();
  const phoneHref = telHref();

  return (
    <footer className="surface-ink border-t-[6px] border-revision">
      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
          <div className="lg:pr-8">
            {/* Nameplate, for the same reason as the header: the "white" logo
                file is a placeholder that is not white, and would vanish. */}
            <Link
              href="/"
              aria-label="OAX Tech — home"
              className="inline-flex bg-sheet px-3 py-2"
            >
              <Logo asStatic width={120} />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-text">
              {siteConfig.tagline}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  {social.url ? (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-ink-line text-ink-text transition-colors hover:border-revision hover:bg-revision hover:text-white"
                    >
                      <Icon
                        name={socialIcons[social.label] ?? "Globe"}
                        className="h-4 w-4"
                        label={`${siteConfig.name} on ${social.label}`}
                      />
                    </a>
                  ) : (
                    /* No URL confirmed yet — shown but inert, never a dead
                       link. Hatched, so it reads as a field left blank on
                       purpose rather than a button that failed to load. */
                    <span
                      className="hatch-ink inline-flex h-11 w-11 cursor-not-allowed items-center justify-center border border-dashed border-ink-line text-ink-muted/50"
                      title={`${social.label}: ${PLACEHOLDER_LABELS.social}`}
                    >
                      <Icon
                        name={socialIcons[social.label] ?? "Globe"}
                        className="h-4 w-4"
                        label={`${social.label} — ${PLACEHOLDER_LABELS.social}`}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="tally border-t-rule border-white pt-3 font-mono text-white">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="font-display text-base font-bold uppercase tracking-wide text-ink-text transition-colors hover:text-revision-onInk"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="tally border-t-rule border-white pt-3 font-mono text-white">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-text">
              <li className="flex items-start gap-2.5">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-revision-onInk" />
                <span>{siteConfig.location.display}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="Mail" className="mt-0.5 h-4 w-4 shrink-0 text-revision-onInk" />
                {email && emailHref ? (
                  <a href={emailHref} className="transition-colors hover:text-white">
                    {email}
                  </a>
                ) : (
                  <span className="tally font-mono text-ink-muted">{PLACEHOLDER_LABELS.email}</span>
                )}
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="Phone" className="mt-0.5 h-4 w-4 shrink-0 text-revision-onInk" />
                {phone && phoneHref ? (
                  <a href={phoneHref} className="transition-colors hover:text-white">
                    {phone}
                  </a>
                ) : (
                  <span className="tally font-mono text-ink-muted">{PLACEHOLDER_LABELS.phone}</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* The record row */}
        <div className="mt-14 flex flex-col gap-4 border-t-rule border-ink-text/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="tally font-mono text-ink-muted">
            © {copyrightYears()} {siteConfig.name} · All rights reserved
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="tally font-mono text-ink-muted transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
