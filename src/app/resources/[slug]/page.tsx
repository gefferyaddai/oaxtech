import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/sections/CTASection";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { articles, getArticle } from "@/data/articles";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return buildMetadata({ title: "Not found", description: "", path: "/resources" });

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/resources/${article.slug}`,
    // Unpublished articles must not be indexed.
    noIndex: article.status === "coming-soon",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const isPublished = article.status === "published";

  /** Article schema is only emitted for genuinely published articles. */
  const schema = isPublished
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        author: { "@type": "Organization", name: siteConfig.name },
        publisher: { "@type": "Organization", name: siteConfig.name },
        mainEntityOfPage: `${siteConfig.url}/resources/${article.slug}`,
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${siteConfig.url}/resources` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${siteConfig.url}/resources/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <article className="section">
        <Container narrow>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <li>
                <Link href="/resources" className="transition-colors hover:text-ink">
                  Resources
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-charcoal" aria-current="page">
                {article.category}
              </li>
            </ol>
          </nav>

          <p className="eyebrow">{article.category}</p>
          <h1 className="mt-3 text-display-lg">{article.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {article.readingMinutes && <span>{article.readingMinutes} min read</span>}
          </div>

          {isPublished ? (
            <div className="mt-10 max-w-prose space-y-5">
              {article.body?.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-charcoal">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            // Clear "coming soon" handling — never a broken link.
            <div className="card mt-10 p-6 sm:p-8">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
                <Icon name="PenSquare" className="h-5 w-5" />
              </span>
              <h2 className="font-display text-display-xs">This guide is still being written</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-slate">
                {article.excerpt}
              </p>
              <p className="mt-3 max-w-prose text-sm text-slate">
                We publish a guide when it&apos;s genuinely useful rather than to hit a schedule. If
                this is the topic you need help with now, ask us directly — we&apos;ll answer
                properly.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="primary" size="sm">
                  Ask us about this
                </ButtonLink>
                <ButtonLink href="/resources" variant="neutral" size="sm">
                  Back to resources
                </ButtonLink>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-line pt-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              All resources
            </Link>
          </div>
        </Container>
      </article>

      <CTASection
        inset
        title="Want This Applied to Your Business?"
        description="Book a free consultation and we'll talk through your specific situation."
        actions={
          <>
            <ButtonLink href="/book" variant="primary" fullWidth>
              Book a Consultation
            </ButtonLink>
            <ButtonLink href="/quote" variant="onDark" fullWidth>
              Request a Quote
            </ButtonLink>
          </>
        }
      />

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
