import type { MetadataRoute } from "next";
import { publishedArticles } from "@/data/articles";
import { siteConfig } from "@/lib/site";

/**
 * Public routes only. The client portal, login and any demo screens are
 * excluded here and additionally blocked in robots.ts and by an X-Robots-Tag
 * header in next.config.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/services/marketing-seo", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/work/spargo", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/team", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/book", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/resources", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const lastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path === "/" ? "" : route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    // Only genuinely published articles are listed.
    ...publishedArticles().map((article) => ({
      url: `${siteConfig.url}/resources/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
