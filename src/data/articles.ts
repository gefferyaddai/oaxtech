/**
 * Resources / blog metadata.
 *
 * ASSUMPTION: no Resources mockup was supplied with this brief, so the article
 * titles below were written to match the five categories named in the brief.
 * Replace them with the real editorial list when it exists.
 *
 * Every article carries a `status`. Only `published` articles render a full
 * detail page; `coming-soon` articles render a clear placeholder page instead
 * of a broken link, and are excluded from the sitemap and Article schema.
 *
 * When a CMS is connected, replace this file with the CMS query — the
 * `Article` type is the contract the UI depends on.
 */

export const ARTICLE_CATEGORIES = [
  "Website Development",
  "Software & Automation",
  "Marketing",
  "SEO Guides",
  "Business Technology",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  status: "published" | "coming-soon";
  /** ISO date. null while unpublished. */
  publishedAt: string | null;
  readingMinutes: number | null;
  /** Body paragraphs. Only used when status is "published". */
  body?: string[];
}

export const articles: Article[] = [
  {
    slug: "what-a-small-business-website-actually-needs",
    title: "What a Small Business Website Actually Needs",
    excerpt:
      "The short list of things that make a business website work — and the long list of things you can safely skip.",
    category: "Website Development",
    status: "published",
    publishedAt: "2025-11-04",
    readingMinutes: 6,
    body: [
      "Most small business websites fail for boring reasons. Not because they lack animation or a clever layout, but because a visitor can't quickly work out what the business does, whether it serves them, and how to get in touch.",
      "Start with clarity. The top of your homepage should answer three questions without scrolling: what you do, who you do it for, and what to do next. If a stranger can't answer all three in about five seconds, no amount of design polish will rescue the page.",
      "Then make it fast. Performance is not a technical vanity metric — it is the difference between a visitor who waits and one who leaves. Compress your images, keep third-party scripts to a minimum, and be suspicious of any plugin that promises a lot for free.",
      "Make contact effortless. A single, short form beats a long one. Ask for what you genuinely need to reply, and nothing else. Every additional required field costs you submissions.",
      "Finally, build on something you can maintain. A site you can't update yourself becomes stale within a year. Whether that means a CMS, a simple static site, or a documented handover, decide up front how content will change after launch — not after you need to change it.",
    ],
  },
  {
    slug: "when-custom-software-is-worth-it",
    title: "When Custom Software Is Worth It (And When It Isn't)",
    excerpt:
      "Off-the-shelf tools handle most problems. Here's how to recognise the ones they don't.",
    category: "Software & Automation",
    status: "published",
    publishedAt: "2025-10-21",
    readingMinutes: 7,
    body: [
      "Custom software is expensive to build and expensive to maintain. That's not a reason to avoid it — it's a reason to be certain before you start.",
      "The honest default is off-the-shelf. If an existing tool does eighty per cent of what you need for a monthly fee, adapting your process to it is almost always cheaper than building the missing twenty per cent yourself.",
      "Custom becomes worth it when the process you're automating is the thing that makes your business distinctive, when the manual work is large and recurring enough that the maths clearly favours automation, or when you're paying for several tools that don't talk to each other and the glue between them is costing more than the tools.",
      "A useful test: write down the process by hand, step by step, before anyone writes code. If you can't describe it clearly on paper, software will not clarify it. It will encode the confusion and make it harder to change.",
      "And budget for the second year. Software isn't a purchase, it's an ongoing commitment — hosting, updates, dependency changes, and the small fixes that keep it useful.",
    ],
  },
  {
    slug: "local-seo-basics-for-calgary-businesses",
    title: "Local SEO Basics for Calgary Businesses",
    excerpt:
      "The practical fundamentals that help nearby customers find you — without any ranking guarantees.",
    category: "SEO Guides",
    status: "published",
    publishedAt: "2025-10-02",
    readingMinutes: 8,
    body: [
      "Local search is less mysterious than it's often made to sound. Most of the value comes from a handful of unglamorous fundamentals done consistently.",
      "Start with your Google Business Profile. Claim it, fill in every field, choose accurate categories, add real photos, and keep your hours current. An incomplete or out-of-date profile quietly costs you visibility.",
      "Be consistent about your name, address and phone number everywhere they appear. Directories, social profiles, your own site footer. Inconsistency creates ambiguity, and ambiguity is not rewarded.",
      "Write pages that genuinely serve local intent. A page about your service in your service area, written for a human who lives there, will outperform a page that repeats a city name a dozen times.",
      "Ask for reviews, respond to all of them, and don't buy any. Review volume and recency matter; fabricated reviews are detectable and the downside is severe.",
      "One thing to hold on to: nobody can guarantee a first-page ranking. Search engines change their systems continuously and competitors are working too. Anyone who promises a specific position is either guessing or misleading you.",
    ],
  },
  {
    slug: "choosing-marketing-channels-that-fit",
    title: "Choosing Marketing Channels That Fit Your Business",
    excerpt:
      "A framework for deciding where to spend effort, instead of trying to be everywhere at once.",
    category: "Marketing",
    status: "coming-soon",
    publishedAt: null,
    readingMinutes: null,
  },
  {
    slug: "automating-repetitive-work",
    title: "Automating Repetitive Work Without Breaking Things",
    excerpt: "How to identify safe automation candidates and roll them out gradually.",
    category: "Software & Automation",
    status: "coming-soon",
    publishedAt: null,
    readingMinutes: null,
  },
  {
    slug: "technology-decisions-for-growing-teams",
    title: "Technology Decisions for Growing Teams",
    excerpt: "Practical guidance on choosing tools you won't regret in eighteen months.",
    category: "Business Technology",
    status: "coming-soon",
    publishedAt: null,
    readingMinutes: null,
  },
  {
    slug: "website-redesign-checklist",
    title: "The Website Redesign Checklist",
    excerpt: "What to audit, preserve and measure before you rebuild an existing site.",
    category: "Website Development",
    status: "coming-soon",
    publishedAt: null,
    readingMinutes: null,
  },
  {
    slug: "reading-your-analytics-honestly",
    title: "Reading Your Analytics Honestly",
    excerpt: "Which numbers deserve your attention, and which ones quietly mislead.",
    category: "Business Technology",
    status: "coming-soon",
    publishedAt: null,
    readingMinutes: null,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function publishedArticles(): Article[] {
  return articles.filter((a) => a.status === "published");
}
