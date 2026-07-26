export interface ServiceFeature {
  label: string;
  icon: string;
}

export interface Service {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  /** Longer copy used on the services page. */
  detail: string;
  icon: string;
  features: ServiceFeature[];
  href: string;
  ctaLabel: string;
}

/** The four core services shown on the home page and services page. */
export const services: Service[] = [
  {
    id: "01",
    slug: "website-design",
    eyebrow: "01",
    title: "Website Design & Development",
    shortTitle: "Website Design",
    summary:
      "Modern, responsive websites built for performance, conversions, and scalability.",
    detail:
      "High-performing, responsive websites designed to engage your audience, build trust, and convert visitors into customers.",
    icon: "Monitor",
    features: [
      { label: "Landing Pages", icon: "LayoutTemplate" },
      { label: "Business Websites", icon: "Building2" },
      { label: "E-commerce Websites", icon: "ShoppingCart" },
      { label: "Website Redesigns", icon: "PenSquare" },
      { label: "Mobile-Responsive Development", icon: "Smartphone" },
      { label: "Maintenance & Support", icon: "Settings" },
    ],
    href: "/services#website-design",
    ctaLabel: "Explore Web Design",
  },
  {
    id: "02",
    slug: "custom-software",
    eyebrow: "02",
    title: "Custom Software Solutions",
    shortTitle: "Custom Software",
    summary:
      "Powerful custom applications and integrations that solve real business problems.",
    detail:
      "Powerful web applications and tools tailored to your processes, integrations, and growth objectives.",
    icon: "Code2",
    features: [
      { label: "Web Applications", icon: "AppWindow" },
      { label: "Internal Management Systems", icon: "Building" },
      { label: "Business Dashboards", icon: "LayoutDashboard" },
      { label: "API Integrations", icon: "Workflow" },
      { label: "Client Portals", icon: "UserSquare" },
      { label: "Workflow Automation", icon: "Zap" },
    ],
    href: "/services#custom-software",
    ctaLabel: "Explore Custom Software",
  },
  {
    id: "03",
    slug: "marketing-consulting",
    eyebrow: "03",
    title: "Marketing Consulting",
    shortTitle: "Marketing Consulting",
    summary:
      "Data-driven strategies that build brand awareness and drive qualified leads.",
    detail:
      "Data-driven marketing strategies that attract the right audience, build your brand, and generate measurable growth.",
    icon: "BarChart3",
    features: [
      { label: "Marketing Strategy", icon: "Target" },
      { label: "Content Strategy", icon: "PenSquare" },
      { label: "Campaign Planning", icon: "CalendarRange" },
      { label: "Social Media Planning", icon: "Share2" },
      { label: "Brand Positioning", icon: "Compass" },
      { label: "Conversion Optimization", icon: "TrendingUp" },
    ],
    href: "/services/marketing-seo#marketing-consulting",
    ctaLabel: "Explore Marketing",
  },
  {
    id: "04",
    slug: "seo",
    eyebrow: "04",
    title: "SEO Services",
    shortTitle: "SEO Services",
    summary:
      "Improve rankings, increase organic traffic, and outrank your competition.",
    detail:
      "Improve visibility, drive qualified traffic, and outperform competitors with proven SEO practices.",
    icon: "Search",
    features: [
      { label: "Website Audits", icon: "ClipboardCheck" },
      { label: "Local SEO", icon: "MapPin" },
      { label: "Keyword Research", icon: "SearchCheck" },
      { label: "Google Business Profile Optimization", icon: "Store" },
      { label: "On-Page SEO", icon: "FileCode" },
      { label: "Performance Reporting", icon: "LineChart" },
    ],
    href: "/services/marketing-seo#seo-services",
    ctaLabel: "Explore SEO",
  },
];

/** Capability cards used on the work page filter overview. */
export const capabilities = [
  {
    label: "Websites",
    icon: "Monitor",
    description: "High-performing websites built for clarity, speed and results.",
  },
  {
    label: "Software",
    icon: "Code2",
    description: "Custom software solutions tailored to your business processes.",
  },
  {
    label: "Mobile Applications",
    icon: "Smartphone",
    description: "Intuitive mobile apps that deliver seamless user experiences.",
  },
  {
    label: "AI & Automation",
    icon: "BrainCircuit",
    description: "Smart automation and AI systems that streamline complex work.",
  },
  {
    label: "Marketing & SEO",
    icon: "BarChart3",
    description: "Data-driven marketing and SEO strategies that drive visibility and growth.",
  },
];

/** Types of clients served — from the services mockup. */
export const clientTypes = [
  {
    label: "Startups",
    icon: "Rocket",
    description: "Launch with the right foundation, and grow with confidence.",
  },
  {
    label: "Small Businesses",
    icon: "Store",
    description: "Attract more customers and streamline your online presence.",
  },
  {
    label: "Established Companies",
    icon: "Building2",
    description: "Scale intelligently and optimize systems that support growth.",
  },
  {
    label: "Community Organizations",
    icon: "HeartHandshake",
    description: "Amplify your mission and connect with your community.",
  },
  {
    label: "Personal Brands",
    icon: "UserRound",
    description: "Stand out, build authority, and grow your audience.",
  },
];

export interface ProcessStep {
  step: string;
  label: string;
  description: string;
  icon: string;
}

/** Five-step process shown on the home page. */
export const homeProcess: ProcessStep[] = [
  { step: "1", label: "Discover", description: "We learn about your business, goals, and challenges.", icon: "Search" },
  { step: "2", label: "Strategy", description: "We define the right plan to achieve measurable results.", icon: "Target" },
  { step: "3", label: "Design & Build", description: "We design and build with performance and scalability in mind.", icon: "Code2" },
  { step: "4", label: "Launch", description: "We test, refine, and launch your solution with confidence.", icon: "Rocket" },
  { step: "5", label: "Grow", description: "We optimize and scale to help your business keep growing.", icon: "TrendingUp" },
];

/** Six-step process shown on the services page. */
export const fullProcess: ProcessStep[] = [
  { step: "1", label: "Discovery", description: "We learn about your business, goals, and challenges.", icon: "Search" },
  { step: "2", label: "Strategy", description: "We define the right plan to achieve measurable results.", icon: "Target" },
  { step: "3", label: "Creation", description: "We design, develop, and build with precision.", icon: "Code2" },
  { step: "4", label: "Review", description: "We test, refine, and ensure everything meets your goals.", icon: "CheckCircle2" },
  { step: "5", label: "Launch", description: "We launch your solution with care and confidence.", icon: "Rocket" },
  { step: "6", label: "Optimization", description: "We monitor, analyze, and optimize for ongoing growth.", icon: "TrendingUp" },
];

/** Six-step marketing and SEO process. */
export const marketingProcess: ProcessStep[] = [
  { step: "1", label: "Discover", description: "We learn about your business, goals and challenges.", icon: "Search" },
  { step: "2", label: "Audit", description: "We analyze your website, search presence and market opportunities.", icon: "ClipboardCheck" },
  { step: "3", label: "Strategize", description: "We build a custom plan aligned with your audience and objectives.", icon: "Target" },
  { step: "4", label: "Implement", description: "We execute campaigns and optimize across the right channels.", icon: "Settings" },
  { step: "5", label: "Measure", description: "We track performance and provide clear, actionable insights.", icon: "LineChart" },
  { step: "6", label: "Optimize", description: "We refine and adapt to improve results over time.", icon: "Rocket" },
];

/** Four-step collaboration process shown on the about and team pages. */
export const collaborationProcess: ProcessStep[] = [
  { step: "1", label: "Understand the Goal", description: "We learn your objectives, audience and challenges to define what success looks like.", icon: "MessageSquare" },
  { step: "2", label: "Combine Expertise", description: "Our engineers, analysts and outreach specialists align on strategy, timeline and the right approach.", icon: "Users" },
  { step: "3", label: "Build & Review", description: "We design, build and test with transparency — sharing updates and inviting feedback.", icon: "Code2" },
  { step: "4", label: "Support Growth", description: "We launch with care and continue supporting, optimizing and scaling your solution.", icon: "Rocket" },
];

/** "Why OAX Tech" points from the home and about mockups. */
export const valueProps = [
  { label: "Calgary Based", icon: "MapPin", description: "Proudly serving businesses across Alberta and Canada." },
  { label: "Results Driven", icon: "Target", description: "Solutions built to generate leads, sales, and long-term growth." },
  { label: "Tailored Solutions", icon: "Puzzle", description: "No one-size-fits-all. We build around your goals and industry." },
  { label: "Reliable Partner", icon: "ShieldCheck", description: "Clear communication, on-time delivery, and ongoing support." },
];

export const aboutHighlights = [
  { label: "Based in Calgary", icon: "MapPin", description: "Proudly serving businesses and organizations across Calgary, Alberta and Canada." },
  { label: "Technology + Marketing", icon: "Monitor", description: "We combine technology, design, marketing and SEO to drive real results." },
  { label: "Built for Growth", icon: "BarChart3", description: "We build scalable solutions that help businesses grow with confidence." },
  { label: "Community Minded", icon: "HeartHandshake", description: "We support students, community projects and local businesses." },
];

export const companyValues = [
  { label: "Innovation", icon: "Lightbulb", description: "We embrace new ideas and technology to solve real business challenges." },
  { label: "Transparency", icon: "ShieldCheck", description: "We communicate openly and keep our clients informed at every step." },
  { label: "Reliability", icon: "BadgeCheck", description: "We deliver quality work on time and stand behind our commitments." },
  { label: "Accessibility", icon: "MapPin", description: "We make technology and marketing understandable, useful and approachable." },
  { label: "Community", icon: "Users", description: "We give back and support the communities where we live and work." },
];

export const differentiators = [
  { step: "01", label: "Technology & Marketing Expertise", description: "We bring together development, design, marketing and SEO to build complete digital solutions." },
  { step: "02", label: "Custom Strategies", description: "We craft data-informed strategies tailored to your business, industry and growth goals." },
  { step: "03", label: "Personalized Communication", description: "You work directly with our team. Clear updates, honest advice and responsive support." },
  { step: "04", label: "Practical Business Solutions", description: "We focus on solutions that are useful, scalable and built to drive real business outcomes." },
];
