export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** External links open in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface NavGroup {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Desktop primary navigation, exactly as specified in the brief. */
export const primaryNav: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    /* Three destinations, split by what a visitor is actually shopping for.
       Each one leads somewhere that covers only that thing — "Websites &
       Software" showing marketing sections would make the split cosmetic. */
    children: [
      {
        label: "Websites & Software",
        href: "/services",
        description: "Websites, web and mobile apps, AI and automation",
      },
      {
        label: "Marketing & SEO",
        href: "/services/marketing-seo",
        description: "Strategy, paid ads, local SEO and reporting",
      },
      {
        label: "Business Kickstarter Packages",
        href: "/services/business-kickstarter",
        description: "Website plus campaigns, bundled over a fixed term",
      },
    ],
  },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Secondary destinations kept out of the primary nav to avoid crowding. */
export const utilityNav: NavLink[] = [
  /*
   * "Learn More About Us" (/learn-more) is intentionally NOT linked here.
   *
   * The page is built around the recorded company story, and until
   * `storyVideo.src` is set it renders a "footage pending" plate. Linking it
   * from global navigation would send every visitor to a placeholder. The
   * route stays live and reachable so the permanent /team -> /learn-more
   * redirect still resolves rather than 404ing.
   *
   * RESTORE both entries (here and in footerNav "Company") the moment the
   * footage and its captions land.
   */
  { label: "Resources", href: "/resources" },
  { label: "Client Portal", href: "/portal/login" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Websites & Software", href: "/services" },
      { label: "Marketing & SEO", href: "/services/marketing-seo" },
      { label: "Business Kickstarter", href: "/services/business-kickstarter" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      /* See utilityNav — withheld until the story footage exists. */
      { label: "Our Process", href: "/about#our-process" },
      { label: "Work", href: "/work" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "FAQs", href: "/contact#faq" },
      { label: "Request a Quote", href: "/quote" },
      { label: "Book a Consultation", href: "/book" },
      { label: "Client Portal", href: "/portal/login" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

/** Client portal sidebar. Mirrors the sections in the portal mockup. */
export interface PortalNavItem {
  label: string;
  href: string;
  icon: string;
}

export const portalNav: PortalNavItem[] = [
  { label: "Overview", href: "/portal", icon: "LayoutDashboard" },
  { label: "Project Progress", href: "/portal/progress", icon: "TrendingUp" },
  { label: "Milestones", href: "/portal/milestones", icon: "CalendarCheck" },
  { label: "Files", href: "/portal/files", icon: "FileText" },
  { label: "Design Approvals", href: "/portal/approvals", icon: "CheckSquare" },
  { label: "Revision Requests", href: "/portal/revisions", icon: "PenSquare" },
  { label: "Messages", href: "/portal/messages", icon: "MessageSquare" },
  { label: "Proposals & Contracts", href: "/portal/contracts", icon: "FileSignature" },
  { label: "Invoices & Payments", href: "/portal/invoices", icon: "Receipt" },
  { label: "Completed Files", href: "/portal/completed", icon: "Archive" },
  { label: "Support", href: "/portal/support", icon: "LifeBuoy" },
];
