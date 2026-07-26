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
    children: [
      {
        label: "All Services",
        href: "/services",
        description: "Websites, software, marketing and SEO",
      },
      {
        label: "Marketing & SEO",
        href: "/services/marketing-seo",
        description: "Strategy, local SEO and reporting",
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
  { label: "Our Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Client Portal", href: "/portal/login" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Website Design", href: "/services#website-design" },
      { label: "Custom Software", href: "/services#custom-software" },
      { label: "Marketing Consulting", href: "/services/marketing-seo#marketing-consulting" },
      { label: "SEO Services", href: "/services/marketing-seo#seo-services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
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
