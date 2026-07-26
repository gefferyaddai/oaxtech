import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Article } from "@/data/articles";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const isComingSoon = article.status === "coming-soon";

  return (
    <article className="card card-interactive group flex h-full flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line bg-mist px-2.5 py-1 text-2xs font-medium text-charcoal">
          {article.category}
        </span>
        {isComingSoon && <StatusBadge tone="neutral">Coming soon</StatusBadge>}
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
        <Link href={`/resources/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate">{article.excerpt}</p>

      <div className="mt-5 flex items-center justify-between border-t border-line-subtle pt-4 text-xs text-muted">
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

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt">
        {isComingSoon ? "See what's planned" : "Read article"}
        <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
