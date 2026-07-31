/**
 * Admin sidebar navigation.
 *
 * Grouped into the four sections the admin brief specifies. Every href here
 * must resolve to a real route — a nav that links to a 404 is worse than one
 * that omits the item.
 */

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
}

export interface AdminNavSection {
  heading: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavSection[] = [
  {
    heading: "Main",
    items: [
      { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
      { label: "Leads", href: "/admin/leads", icon: "Target" },
      { label: "Consultations", href: "/admin/consultations", icon: "Calendar" },
      { label: "Clients", href: "/admin/clients", icon: "Users" },
      { label: "Projects", href: "/admin/projects", icon: "Layers" },
      { label: "Tasks", href: "/admin/tasks", icon: "ClipboardCheck" },
    ],
  },
  {
    heading: "Workflow",
    items: [
      { label: "Approvals", href: "/admin/approvals", icon: "CheckSquare" },
      { label: "Messages", href: "/admin/messages", icon: "MessageSquare" },
      { label: "Proposals", href: "/admin/proposals", icon: "FileText" },
      { label: "Invoices", href: "/admin/invoices", icon: "Receipt" },
      { label: "Files", href: "/admin/files", icon: "Archive" },
      { label: "Support", href: "/admin/support", icon: "LifeBuoy" },
    ],
  },
  {
    heading: "Growth",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
      { label: "Website Content", href: "/admin/content", icon: "PenSquare" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Team", href: "/admin/team", icon: "UserRound" },
      { label: "Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
];

/** Flat list, used by global search to resolve a query to a destination. */
export const adminNavFlat: AdminNavItem[] = adminNav.flatMap((section) => section.items);
