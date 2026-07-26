/**
 * Project data.
 *
 * CONTENT RULE: no user counts, revenue figures, savings, launch statistics or
 * client testimonials are recorded here. Outcomes are described qualitatively
 * only. Add measured numbers once they are confirmed by the client.
 */

export const PROJECT_CATEGORIES = [
  "Websites",
  "Software",
  "Mobile Applications",
  "AI & Automation",
  "Marketing & SEO",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectHighlight {
  label: string;
  description: string;
  icon: string;
}

export interface Project {
  slug: string;
  name: string;
  eyebrow: string;
  categories: ProjectCategory[];
  summary: string;
  tags: string[];
  highlights: ProjectHighlight[];
  /** Confirmed live URL, or null when there is nothing public to link to. */
  externalUrl: string | null;
  externalLabel: string | null;
  /** Internal case-study route, when one exists. */
  caseStudyHref: string | null;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "spargo",
    name: "Spargo",
    eyebrow: "Mobile Application",
    categories: ["Mobile Applications", "Software", "AI & Automation"],
    summary:
      "A mobile price-comparison platform that helps shoppers discover better prices across nearby stores.",
    tags: ["Product Design", "Mobile Development", "AI Integration"],
    highlights: [
      { label: "Smarter Shopping", description: "Discover better prices across multiple stores.", icon: "Sparkles" },
      { label: "Price Comparison", description: "Instantly compare prices and save more.", icon: "Scale" },
      { label: "Mobile-First", description: "Built for speed and ease on the go.", icon: "Smartphone" },
    ],
    externalUrl: "https://savewithspargo.com",
    externalLabel: "savewithspargo.com",
    caseStudyHref: "/work/spargo",
    featured: true,
  },
  {
    slug: "ghsa",
    name: "GHSA",
    eyebrow: "Community Website",
    categories: ["Websites", "Marketing & SEO"],
    summary:
      "A community-focused website built as a student-community sponsorship for the Ghanaian Students' Association.",
    tags: ["Web Design", "Development", "Community Sponsorship"],
    highlights: [
      { label: "Community Presence", description: "Showcasing culture, news and initiatives.", icon: "Users" },
      { label: "Event Discovery", description: "Easy access to upcoming events and updates.", icon: "CalendarRange" },
      { label: "Member Engagement", description: "Resources and tools that connect members.", icon: "HeartHandshake" },
    ],
    externalUrl: "https://ghsa.ca",
    externalLabel: "ghsa.ca",
    caseStudyHref: null,
    featured: true,
  },
  {
    slug: "nasdaq-trading-automation",
    name: "NASDAQ Trading Automation",
    eyebrow: "AI & Automation",
    categories: ["AI & Automation", "Software"],
    // Deliberately high-level. No algorithms, credentials, source code, trade
    // data or private technical detail is described anywhere in this project.
    summary:
      "An automated stock-market analysis system that monitors market data, surfaces signals and supports informed decision-making.",
    tags: ["Custom Software", "Data Automation", "AI Analysis"],
    highlights: [
      { label: "Automated Monitoring", description: "Continuously monitors market movements.", icon: "Activity" },
      { label: "Faster Analysis", description: "Surfaces potential signals in real time.", icon: "Gauge" },
      { label: "Actionable Insights", description: "Delivers clear insights to guide decisions.", icon: "Target" },
    ],
    externalUrl: null,
    externalLabel: null,
    caseStudyHref: null,
    featured: true,
  },
];

export function projectsByCategory(category: ProjectCategory | "All"): Project[] {
  if (category === "All") return projects;
  return projects.filter((p) => p.categories.includes(category));
}

/* -------------------------------------------------------------------------- */
/* Outcome categories — qualitative only, no invented performance numbers.     */
/* -------------------------------------------------------------------------- */

export const outcomeAreas = [
  {
    label: "Leads Generated",
    icon: "Users",
    description: "We help you attract the right audience and turn interest into valuable opportunities.",
  },
  {
    label: "Workflows Automated",
    icon: "Code2",
    description: "We streamline repetitive tasks so your team can focus on what matters most.",
  },
  {
    label: "Time Saved",
    icon: "Clock",
    description: "We build solutions that save your team time and reduce operational friction.",
  },
  {
    label: "Performance Improvements",
    icon: "BarChart3",
    description: "We design systems that strengthen processes and support better outcomes.",
  },
];

export const workProcess = [
  { step: "1", label: "Strategy", description: "We discover your goals and define a clear plan.", icon: "Search" },
  { step: "2", label: "Design", description: "We design experiences that are intuitive and result-driven.", icon: "Target" },
  { step: "3", label: "Build", description: "We build robust solutions with clean, scalable technology.", icon: "Code2" },
  { step: "4", label: "Optimize", description: "We analyze, refine and optimize for long-term growth.", icon: "TrendingUp" },
];

/* -------------------------------------------------------------------------- */
/* Spargo case study                                                           */
/* -------------------------------------------------------------------------- */

export const spargoCaseStudy = {
  slug: "spargo",
  name: "Spargo",
  eyebrow: "Mobile Application",
  headline: "Helping Shoppers Find Better Prices, Faster.",
  intro:
    "A mobile price-comparison platform designed to help users compare store prices, evaluate deals and shop more confidently.",

  facts: [
    { label: "Client", value: "Spargo", icon: "UserRound" },
    { label: "Industry", value: "Retail Technology", icon: "Building2" },
    { label: "Platform", value: "iOS & Android", icon: "Smartphone" },
    { label: "Focus", value: "Mobile Product Development", icon: "Target" },
  ],

  overview:
    "Spargo is a consumer savings platform built to make local price discovery simpler and more useful. The app helps shoppers compare prices across nearby stores, uncover better deals and make more confident purchasing decisions every day.",

  projectSummary:
    "OAX Tech partnered with Spargo to design and develop a mobile app that delivers real-time price comparisons, smart recommendations and an engaging shopping experience.",

  summaryTags: ["Product Strategy", "UI/UX Design", "Mobile Development", "AI Integration"],

  problem:
    "Shoppers face fragmented pricing, limited visibility across stores, and time-consuming comparison processes that lead to missed savings and inconvenient shopping experiences.",

  goals: [
    "Simplify price comparison across nearby stores",
    "Support better purchase decisions with clear insights",
    "Create an intuitive, engaging mobile experience",
    "Establish a scalable platform foundation for future growth",
  ],

  solution: [
    {
      label: "Nearby Price Comparison",
      icon: "MapPin",
      description: "Compare prices for the same product across nearby stores in real time to find the best available deal.",
    },
    {
      label: "Smart Grocery Lists",
      icon: "ListChecks",
      description: "Create and organize grocery lists to track items, compare prices and shop more efficiently.",
    },
    {
      label: "Camera Price Scan",
      icon: "Camera",
      description: "Scan barcodes instantly to see prices and availability across stores without manual search.",
    },
    {
      label: "Savings & Deal Insights",
      icon: "Tag",
      description: "Discover personalized deals and track savings over time to make smarter spending decisions.",
    },
  ],

  servicesProvided: [
    { label: "Product Strategy", icon: "Target", description: "Defined the product vision, user needs and roadmap to create real value." },
    { label: "UI/UX Design", icon: "PenSquare", description: "Designed intuitive flows and clean interfaces for seamless user journeys." },
    { label: "Mobile App Development", icon: "Smartphone", description: "Built high-performance mobile apps for iOS and Android with a focus on reliability." },
    { label: "Backend & API Integration", icon: "Workflow", description: "Integrated robust APIs and backend services for real-time data and secure operations." },
    { label: "AI-Powered Features", icon: "BrainCircuit", description: "Leveraged AI and computer vision to enhance product matching and insights." },
  ],

  technologies: [
    { label: "React Native", icon: "Atom" },
    { label: "Expo", icon: "Triangle" },
    { label: "API Integrations", icon: "Code2" },
    { label: "Cloud Backend", icon: "Cloud" },
    { label: "AI Vision", icon: "ScanEye" },
  ],

  /** Screens shown in the case study. Text describes the screen; no numbers claimed. */
  screens: [
    { title: "Price search", description: "Search a product and see comparable prices from nearby stores." },
    { title: "Compare prices", description: "Side-by-side store pricing for a single item, sorted for clarity." },
    { title: "Scan a product", description: "Barcode scanning to look up an item without typing." },
    { title: "Grocery list", description: "Build and manage a shopping list across categories." },
    { title: "Favourites", description: "Save products and stores for faster repeat shopping." },
  ],

  challenges: [
    {
      challenge: "Consistent Product Matching",
      challengeDetail: "Variations in product names and packaging made accurate comparisons difficult.",
      solution: "Structured comparison experience",
      solutionDetail: "Implemented smart matching and normalization to ensure consistent and reliable price comparisons.",
    },
    {
      challenge: "Complex Price Information",
      challengeDetail: "Multiple stores and pricing formats created confusion for users.",
      solution: "Clear hierarchy and filters",
      solutionDetail: "Designed a clean information architecture with filters and sorting to simplify decision-making.",
    },
    {
      challenge: "Scalable User Experience",
      challengeDetail: "Growing features risked a fragmented and hard-to-maintain experience.",
      solution: "Modular mobile interface",
      solutionDetail: "Built reusable components and scalable architecture for flexibility and long-term maintainability.",
    },
  ],

  /** Qualitative outcomes only — no metrics, adoption or revenue claims. */
  results: [
    { label: "Simplified Price Discovery", icon: "Search", description: "Users can quickly find and compare prices across nearby stores with ease and confidence." },
    { label: "Faster Comparisons", icon: "Gauge", description: "Real-time data and smart matching help users make quicker, better purchasing decisions." },
    { label: "Mobile-First Experience", icon: "Smartphone", description: "An intuitive, responsive app delivers a smooth and enjoyable shopping experience on the go." },
    { label: "Scalable Product Foundation", icon: "Layers", description: "A robust and flexible platform supports ongoing enhancements and future feature growth." },
  ],

  /** Testimonial is an explicit placeholder. Do not fill in without client sign-off. */
  testimonial: {
    quote: "Client testimonial to be added.",
    attribution: "Spargo Team",
    isPlaceholder: true,
  },

  externalUrl: "https://savewithspargo.com",
  externalLabel: "savewithspargo.com",
} as const;

/* -------------------------------------------------------------------------- */
/* Trust strip                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * PLACEHOLDER LIST.
 *
 * Only Spargo and GHSA are confirmed. The additional company names that appear
 * in the trust strip of the landing-page mockup are NOT confirmed clients and
 * are deliberately omitted. Add entries here only with written permission to
 * use the organisation's name.
 */
export const trustedBy: { name: string }[] = [
  { name: "Spargo" },
  { name: "GHSA" },
];
