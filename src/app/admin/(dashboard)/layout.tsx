import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchRecord } from "@/components/admin/AdminTopbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DemoDataNotice } from "@/components/admin/primitives";
import { DEMO_NOTICE } from "@/data/demo-data";
import { getAdminSession } from "@/lib/admin/auth";
import {
  getClients,
  getLeads,
  getMessages,
  getProjects,
  isDemoData,
} from "@/lib/domain/repository";

/**
 * The admin is never indexed. Also enforced by a header in next.config.ts, so
 * it holds even for responses that bypass this metadata.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin | OAX Tech",
    template: "%s · Admin | OAX Tech",
  },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Builds the global-search index on the server. Only the label and href of each
 * record are sent to the browser — emails, phone numbers, budgets and invoice
 * amounts stay server-side rather than being shipped in the client bundle.
 */
async function buildSearchIndex(): Promise<SearchRecord[]> {
  const [clients, projects, leads] = await Promise.all([
    getClients(),
    getProjects(),
    getLeads(),
  ]);

  return [
    ...clients.map((client) => ({
      id: `client-${client.id}`,
      label: client.name,
      kind: "Client",
      href: `/admin/clients/${client.id}`,
    })),
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.name,
      kind: "Project",
      href: `/admin/projects/${project.id}`,
    })),
    ...leads.map((lead) => ({
      id: `lead-${lead.id}`,
      label: lead.company ?? lead.name,
      kind: "Lead",
      href: `/admin/leads/${lead.id}`,
    })),
  ];
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Protected layout: without a session every admin route redirects to login.
  if (!session) redirect("/admin/login");

  const [searchIndex, messages] = await Promise.all([buildSearchIndex(), getMessages()]);
  const unreadCount = messages.filter((message) => message.unread).length;

  return (
    /* `data-surface="app"` swaps the condensed signage display face back to
       the UI face and drops the uppercase heading treatment. The admin is an
       Operate surface read at 13-15px all day; it keeps the drawing set's
       colour, linework and square corners but not its headline face. */
    <div data-surface="app" className="flex min-h-screen bg-mist">
      <AdminSidebar label={session.label} role={session.role} />

      {/*
        `min-w-0` is load-bearing: without it this flex child adopts the intrinsic
        width of its widest content (a table or the Kanban board) and pushes the
        page into horizontal overflow instead of scrolling within its own panel.
      */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          label={session.label}
          role={session.role}
          searchIndex={searchIndex}
          unreadCount={unreadCount}
        />
        {isDemoData() && <DemoDataNotice notice={DEMO_NOTICE} />}
        {/* A <div>, not <main>: the root layout already provides #main and
            nesting main elements is invalid. */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
