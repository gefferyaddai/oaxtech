"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/sections/ArticleCard";
import { FilterTabs } from "@/components/sections/FilterTabs";
import { EmptyState } from "@/components/ui/States";
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from "@/data/articles";

type Filter = "All" | ArticleCategory;
const FILTERS: readonly Filter[] = ["All", ...ARTICLE_CATEGORIES] as const;

export function ResourcesBrowser({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<Filter>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: articles.length };
    for (const category of ARTICLE_CATEGORIES) {
      map[category] = articles.filter((a) => a.category === category).length;
    }
    return map;
  }, [articles]);

  const visible = useMemo(
    () => (active === "All" ? articles : articles.filter((a) => a.category === active)),
    [active, articles],
  );

  return (
    <div>
      <FilterTabs
        options={FILTERS}
        active={active}
        onChange={setActive}
        label="Filter resources by category"
        counts={counts}
      />

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "article" : "articles"}
        {active === "All" ? "" : ` in ${active}`}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="FileText"
          title={`Nothing in ${active} yet`}
          description="We're writing more guides. Check another category in the meantime."
        />
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <li key={article.slug} className="relative">
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
