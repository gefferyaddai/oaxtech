import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

/**
 * An article as a filed document.
 *
 * The category and date read as a filing header in the tally face, and an
 * unpublished piece is marked with a hatched "coming soon" strip rather than a
 * badge — the same convention the rest of the site uses for content that does
 * not exist yet.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const isComingSoon = article.status === "coming-soon";

  return (
    <article className="plate plate-clipped plate-interactive group relative flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <span className="tally font-mono text-revision-text">{article.category}</span>
        {isComingSoon && (
          <span className="hatch tally border border-graphite px-2 py-0.5 font-mono text-faint">
            Coming soon
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight text-graphite">
        <Link href={`/resources/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-pencil">{article.excerpt}</p>

      <div className="tally mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-faint">
        <span>
          {article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Not published yet"}
        </span>
        {article.readingMinutes && <span>{article.readingMinutes} min read</span>}
      </div>

      <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-revision-text">
        {isComingSoon ? "See what's planned" : "Read article"}
        <Icon
          name="ArrowRight"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
        />
      </span>
    </article>
  );
}
