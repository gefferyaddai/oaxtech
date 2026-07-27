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

export function Footer() {
  const email = siteConfig.contact.email;
  const phone = siteConfig.contact.phone;
  const emailHref = mailtoHref();
  const phoneHref = telHref();

  return (
    <footer className="surface-space relative overflow-hidden">
      <Container className="relative py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          <div>
            <Logo variant="light" width={124} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-space-text">
              {siteConfig.tagline}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  {social.url ? (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-space-line text-space-text transition-colors hover:border-white/40 hover:text-white"
                    >
                      <Icon
                        name={socialIcons[social.label] ?? "Globe"}
                        className="h-4 w-4"
                        label={`${siteConfig.name} on ${social.label}`}
                      />
                    </a>
                  ) : (
                    // No URL confirmed yet — shown but inert, never a dead link.
                    <span
                      className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-space-line/60 text-space-text/40"
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
              <h2 className="font-display text-sm font-semibold text-white">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-space-text transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-display text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-space-text">
              <li className="flex items-start gap-2.5">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{siteConfig.location.display}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="Mail" className="mt-0.5 h-4 w-4 shrink-0" />
                {email && emailHref ? (
                  <a href={emailHref} className="transition-colors hover:text-white">
                    {email}
                  </a>
                ) : (
                  <span className="italic text-space-text/70">{PLACEHOLDER_LABELS.email}</span>
                )}
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="Phone" className="mt-0.5 h-4 w-4 shrink-0" />
                {phone && phoneHref ? (
                  <a href={phoneHref} className="transition-colors hover:text-white">
                    {phone}
                  </a>
                ) : (
                  <span className="italic text-space-text/70">{PLACEHOLDER_LABELS.phone}</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-space-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-space-text/80">
            © {copyrightYears()} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xs text-space-text/80 transition-colors hover:text-white">
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
