/**
 * ============================================================================
 * DEVELOPMENT / DEMO DATA — NOT REAL BUSINESS INFORMATION
 * ============================================================================
 *
 * Every record below is invented for development and demonstration. None of it
 * describes a real OAX Tech client, project, contract, invoice or amount.
 *
 * Deliberately NOT present, and never to be added here:
 *   - real client or contact names, emails or phone numbers
 *   - real revenue, invoice amounts or payment records
 *   - API keys, secrets or credentials of any kind
 *
 * Company names use the reserved-for-documentation "Example" convention and
 * addresses use `example.com` (RFC 2606), so nothing can collide with a real
 * organisation or deliver mail to a real inbox.
 *
 * Nothing in the UI imports this file directly. It is reachable only through
 * `src/lib/admin/repository.ts`, so replacing it with database queries does not
 * touch a single component.
 *
 * The admin shell reads `isAdminDemoMode()` and shows a persistent banner while
 * this data is what's being displayed.
 */

import type {
  ActivityEvent,
  AdminFile,
  Approval,
  Client,
  Consultation,
  ContentItem,
  Invoice,
  Lead,
  LeadSourcePoint,
  Message,
  Project,
  Proposal,
  RevenuePoint,
  Subscriber,
  SupportTicket,
  Task,
  TeamMemberRecord,
} from "@/lib/admin/types";

/** Shown wherever the UI needs to state plainly that nothing here is real. */
export const ADMIN_DEMO_NOTICE =
  "Demo data. Every client, project, invoice and amount on this screen is invented for development — none of it is real business information.";

/* -------------------------------------------------------------------------- */
/* Team — the only real names here, taken from the public team page            */
/* -------------------------------------------------------------------------- */

export const demoTeam: TeamMemberRecord[] = [
  { id: "tm-1", slug: "geffery-addai", name: "Geffery Addai", initials: "GA", role: "Super Admin", title: "Co-Founder & Full-Stack Developer", assignedTasks: 12, completedTasks: 38, activeProjects: 3, workloadPercent: 82 },
  { id: "tm-2", slug: "morgan-lee", name: "Morgan Lee", initials: "ML", role: "Project Manager", title: "Project Manager", assignedTasks: 9, completedTasks: 44, activeProjects: 4, workloadPercent: 68 },
  { id: "tm-3", slug: "chijioke-obi", name: "Chijioke Obi", initials: "CO", role: "Developer", title: "Developer", assignedTasks: 14, completedTasks: 51, activeProjects: 2, workloadPercent: 91 },
  { id: "tm-4", slug: "lorenzo-vargas", name: "Lorenzo Vargas", initials: "LV", role: "Marketing", title: "Marketing & SEO", assignedTasks: 7, completedTasks: 29, activeProjects: 3, workloadPercent: 54 },
  { id: "tm-5", slug: "nazeeh-hammad", name: "Nazeeh Hammad", initials: "NH", role: "Support", title: "Support & Operations", assignedTasks: 5, completedTasks: 33, activeProjects: 2, workloadPercent: 41 },
];

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

export const demoLeads: Lead[] = [
  { id: "ld-1", name: "Avery Stone", company: "Example Dental Group", email: "avery@example.com", phone: null, service: "Website Design & Development", budget: "$1,000 – $2,500", stage: "New", source: "Organic Search", origin: "quote", assigneeId: null, submittedAt: "2026-07-29T14:22:00Z", followUp: "Due today", notes: "Looking to replace an ageing site. Five pages, online booking." },
  { id: "ld-2", name: "Priya Raman", company: "Example Fitness Studio", email: "priya@example.com", phone: "+1 403 555 0142", service: "Marketing & SEO", budget: "$2,500 – $5,000", stage: "New", source: "Social", origin: "quote", assigneeId: "tm-4", submittedAt: "2026-07-29T09:05:00Z", followUp: "Due today", notes: "Wants local SEO and a monthly content plan." },
  { id: "ld-3", name: "Daniel Okoro", company: "Example Logistics", email: "daniel@example.com", phone: "+1 403 555 0188", service: "Custom Software", budget: "More than $10,000", stage: "Contacted", source: "Referrals", origin: "quote", assigneeId: "tm-1", submittedAt: "2026-07-27T16:40:00Z", followUp: "Scheduled", notes: "Internal dispatch tool. Needs discovery session." },
  { id: "ld-4", name: "Ines Moreau", company: null, email: "ines@example.com", phone: null, service: "Website Design & Development", budget: "Not sure yet", stage: "Contacted", source: "Direct", origin: "contact", assigneeId: "tm-2", submittedAt: "2026-07-26T11:15:00Z", followUp: "Overdue", notes: "General enquiry from the contact form." },
  { id: "ld-5", name: "Tomas Silva", company: "Example Roofing Co.", email: "tomas@example.com", phone: "+1 403 555 0119", service: "Website Design & Development", budget: "$2,500 – $5,000", stage: "Consultation", source: "Organic Search", origin: "booking", assigneeId: "tm-2", submittedAt: "2026-07-24T13:30:00Z", followUp: "Scheduled", notes: "Consultation booked for Aug 3." },
  { id: "ld-6", name: "Hana Yusuf", company: "Example Legal Partners", email: "hana@example.com", phone: null, service: "Marketing & SEO", budget: "$5,000 – $10,000", stage: "Consultation", source: "Email", origin: "booking", assigneeId: "tm-4", submittedAt: "2026-07-23T10:00:00Z", followUp: "None", notes: null },
  { id: "ld-7", name: "Marcus Bell", company: "Example Auto Repair", email: "marcus@example.com", phone: "+1 403 555 0177", service: "Website Design & Development", budget: "$1,000 – $2,500", stage: "Proposal Sent", source: "Referrals", origin: "quote", assigneeId: "tm-2", submittedAt: "2026-07-20T15:45:00Z", followUp: "Scheduled", notes: "Proposal PRO-2026-014 sent." },
  { id: "ld-8", name: "Sofia Marchetti", company: "Example Interiors", email: "sofia@example.com", phone: null, service: "Custom Software", budget: "$5,000 – $10,000", stage: "Proposal Sent", source: "Direct", origin: "quote", assigneeId: "tm-1", submittedAt: "2026-07-18T08:20:00Z", followUp: "Overdue", notes: "Awaiting decision. Follow up this week." },
  { id: "ld-9", name: "Grace Adeyemi", company: "Example Wellness Clinic", email: "grace@example.com", phone: "+1 403 555 0155", service: "Website Design & Development", budget: "$2,500 – $5,000", stage: "Converted", source: "Organic Search", origin: "quote", assigneeId: "tm-2", submittedAt: "2026-07-10T12:00:00Z", followUp: "None", notes: "Converted — see Example Wellness Clinic." },
  { id: "ld-10", name: "Owen Fraser", company: "Example Brewing", email: "owen@example.com", phone: null, service: "Marketing & SEO", budget: "$2,500 – $5,000", stage: "Converted", source: "Social", origin: "quote", assigneeId: "tm-4", submittedAt: "2026-07-05T09:30:00Z", followUp: "None", notes: "Converted — retainer started." },
];

/* -------------------------------------------------------------------------- */
/* Consultations                                                               */
/* -------------------------------------------------------------------------- */

/**
 * `meetingUrl` is null on every record: no calendar or conferencing provider is
 * configured, so there is no real meeting to join. The UI renders the Join
 * button disabled rather than linking somewhere that does not exist.
 */
export const demoConsultations: Consultation[] = [
  { id: "cs-1", contactName: "Tomas Silva", company: "Example Roofing Co.", service: "Website Design & Development", date: "2026-08-03", time: "10:00", timeZone: "America/Edmonton", status: "Confirmed", meetingUrl: null, leadId: "ld-5" },
  { id: "cs-2", contactName: "Hana Yusuf", company: "Example Legal Partners", service: "Marketing & SEO", date: "2026-08-03", time: "14:30", timeZone: "America/Edmonton", status: "Confirmed", meetingUrl: null, leadId: "ld-6" },
  { id: "cs-3", contactName: "Daniel Okoro", company: "Example Logistics", service: "Custom Software", date: "2026-08-04", time: "09:00", timeZone: "America/Edmonton", status: "Pending", meetingUrl: null, leadId: "ld-3" },
  { id: "cs-4", contactName: "Avery Stone", company: "Example Dental Group", service: "Website Design & Development", date: "2026-08-05", time: "11:15", timeZone: "America/Edmonton", status: "Pending", meetingUrl: null, leadId: "ld-1" },
  { id: "cs-5", contactName: "Priya Raman", company: "Example Fitness Studio", service: "Marketing & SEO", date: "2026-08-06", time: "16:00", timeZone: "America/Edmonton", status: "Confirmed", meetingUrl: null, leadId: "ld-2" },
];

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */

export const demoClients: Client[] = [
  { id: "cl-1", name: "Example Wellness Clinic", contactName: "Grace Adeyemi", email: "grace@example.com", phone: "+1 403 555 0155", status: "Active", industry: "Healthcare", since: "2026-07-12", activeProjects: 1, lifetimeValue: 480000 },
  { id: "cl-2", name: "Example Brewing", contactName: "Owen Fraser", email: "owen@example.com", phone: null, status: "Active", industry: "Food & Beverage", since: "2026-07-06", activeProjects: 1, lifetimeValue: 315000 },
  { id: "cl-3", name: "Example Property Group", contactName: "Renee Kaur", email: "renee@example.com", phone: "+1 403 555 0133", status: "Active", industry: "Real Estate", since: "2026-04-18", activeProjects: 2, lifetimeValue: 1240000 },
  { id: "cl-4", name: "Example Outfitters", contactName: "Sam Whitfield", email: "sam@example.com", phone: null, status: "Active", industry: "Retail", since: "2026-02-02", activeProjects: 1, lifetimeValue: 690000 },
  { id: "cl-5", name: "Example Accounting", contactName: "Nadia Rahman", email: "nadia@example.com", phone: "+1 403 555 0166", status: "Dormant", industry: "Professional Services", since: "2025-11-20", activeProjects: 0, lifetimeValue: 225000 },
];

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const demoProjects: Project[] = [
  { id: "pj-1", name: "Wellness Clinic Website", clientId: "cl-1", service: "Website Design & Development", progressPercent: 68, phase: "Design", nextMilestone: "Design Review", deadline: "2026-08-19", ownerId: "tm-2", status: "On Track" },
  { id: "pj-2", name: "Brewing Brand Refresh", clientId: "cl-2", service: "Marketing & SEO", progressPercent: 45, phase: "Strategy", nextMilestone: "Content Plan Sign-off", deadline: "2026-08-28", ownerId: "tm-4", status: "Waiting on Client" },
  { id: "pj-3", name: "Property Listings Platform", clientId: "cl-3", service: "Custom Software", progressPercent: 32, phase: "Development", nextMilestone: "API Integration", deadline: "2026-09-15", ownerId: "tm-1", status: "At Risk" },
  { id: "pj-4", name: "Property Group Site Rebuild", clientId: "cl-3", service: "Website Design & Development", progressPercent: 88, phase: "Launch", nextMilestone: "Pre-launch QA", deadline: "2026-08-08", ownerId: "tm-2", status: "On Track" },
  { id: "pj-5", name: "Outfitters Store Optimisation", clientId: "cl-4", service: "Marketing & SEO", progressPercent: 12, phase: "Discovery", nextMilestone: "Audit Delivery", deadline: "2026-09-30", ownerId: "tm-4", status: "On Hold" },
  { id: "pj-6", name: "Accounting Portal Handover", clientId: "cl-5", service: "Custom Software", progressPercent: 100, phase: "Launch", nextMilestone: null, deadline: "2026-06-30", ownerId: "tm-3", status: "Completed" },
];

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export const demoTasks: Task[] = [
  { id: "tk-1", title: "Send revised homepage concept to client", priority: "High", dueDate: "2026-07-31", assigneeId: "tm-2", projectId: "pj-1", completed: false },
  { id: "tk-2", title: "Resolve API rate-limit issue on listings sync", priority: "High", dueDate: "2026-07-31", assigneeId: "tm-3", projectId: "pj-3", completed: false },
  { id: "tk-3", title: "Publish August content calendar", priority: "Medium", dueDate: "2026-08-01", assigneeId: "tm-4", projectId: "pj-2", completed: false },
  { id: "tk-4", title: "Pre-launch accessibility audit", priority: "High", dueDate: "2026-08-04", assigneeId: "tm-1", projectId: "pj-4", completed: false },
  { id: "tk-5", title: "Follow up on overdue proposal", priority: "Medium", dueDate: "2026-08-02", assigneeId: "tm-2", projectId: null, completed: false },
  { id: "tk-6", title: "Prepare discovery questions for Example Logistics", priority: "Low", dueDate: "2026-08-05", assigneeId: "tm-1", projectId: null, completed: false },
  { id: "tk-7", title: "Archive completed portal handover files", priority: "Low", dueDate: "2026-07-30", assigneeId: "tm-5", projectId: "pj-6", completed: true },
];

/* -------------------------------------------------------------------------- */
/* Workflow                                                                    */
/* -------------------------------------------------------------------------- */

export const demoApprovals: Approval[] = [
  { id: "ap-1", title: "Homepage Concept", projectId: "pj-1", version: "v2", status: "Awaiting Client", submittedAt: "2026-07-28T10:00:00Z", commentCount: 3 },
  { id: "ap-2", title: "Services Page Layout", projectId: "pj-1", version: "v1", status: "Approved", submittedAt: "2026-07-22T14:00:00Z", commentCount: 1 },
  { id: "ap-3", title: "Brand Colour Direction", projectId: "pj-2", version: "v3", status: "Changes Requested", submittedAt: "2026-07-26T09:30:00Z", commentCount: 6 },
  { id: "ap-4", title: "Launch Checklist Sign-off", projectId: "pj-4", version: "v1", status: "Awaiting Client", submittedAt: "2026-07-29T16:20:00Z", commentCount: 0 },
];

export const demoMessages: Message[] = [
  { id: "ms-1", subject: "Homepage feedback", clientId: "cl-1", projectId: "pj-1", preview: "Thanks for the latest round — a couple of notes on the hero section.", lastActivityAt: "2026-07-30T08:15:00Z", unread: true, lastSender: "client" },
  { id: "ms-2", subject: "Content plan questions", clientId: "cl-2", projectId: "pj-2", preview: "Could we shift the blog cadence to fortnightly?", lastActivityAt: "2026-07-29T17:40:00Z", unread: true, lastSender: "client" },
  { id: "ms-3", subject: "Launch window", clientId: "cl-3", projectId: "pj-4", preview: "Confirming we're still on for the 8th.", lastActivityAt: "2026-07-29T11:05:00Z", unread: false, lastSender: "team" },
  { id: "ms-4", subject: "Audit scope", clientId: "cl-4", projectId: "pj-5", preview: "Putting this on hold until Q4 budget is confirmed.", lastActivityAt: "2026-07-25T13:22:00Z", unread: false, lastSender: "client" },
];

export const demoProposals: Proposal[] = [
  { id: "pr-1", reference: "PRO-2026-014", clientId: "cl-1", service: "Website Design & Development", amount: 240000, status: "Sent", sentAt: "2026-07-21T10:00:00Z", validUntil: "2026-08-21" },
  { id: "pr-2", reference: "PRO-2026-015", clientId: "cl-3", service: "Custom Software", amount: 1450000, status: "Viewed", sentAt: "2026-07-24T15:30:00Z", validUntil: "2026-08-24" },
  { id: "pr-3", reference: "PRO-2026-016", clientId: "cl-4", service: "Marketing & SEO", amount: 380000, status: "Draft", sentAt: null, validUntil: null },
  { id: "pr-4", reference: "PRO-2026-013", clientId: "cl-2", service: "Marketing & SEO", amount: 315000, status: "Accepted", sentAt: "2026-07-02T09:00:00Z", validUntil: "2026-08-02" },
];

export const demoInvoices: Invoice[] = [
  { id: "in-1", reference: "INV-2026-031", clientId: "cl-1", projectId: "pj-1", amount: 120000, status: "Sent", issuedAt: "2026-07-15", dueAt: "2026-08-14", paidAt: null },
  { id: "in-2", reference: "INV-2026-030", clientId: "cl-3", projectId: "pj-4", amount: 460000, status: "Overdue", issuedAt: "2026-06-20", dueAt: "2026-07-20", paidAt: null },
  { id: "in-3", reference: "INV-2026-029", clientId: "cl-2", projectId: "pj-2", amount: 157500, status: "Paid", issuedAt: "2026-06-10", dueAt: "2026-07-10", paidAt: "2026-07-08" },
  { id: "in-4", reference: "INV-2026-028", clientId: "cl-4", projectId: "pj-5", amount: 190000, status: "Paid", issuedAt: "2026-05-28", dueAt: "2026-06-27", paidAt: "2026-06-24" },
  { id: "in-5", reference: "INV-2026-032", clientId: "cl-3", projectId: "pj-3", amount: 620000, status: "Draft", issuedAt: "2026-07-30", dueAt: "2026-08-29", paidAt: null },
];

export const demoFiles: AdminFile[] = [
  { id: "fl-1", name: "homepage-concept-v2.fig", kind: "Figma", sizeBytes: 4_820_000, projectId: "pj-1", uploadedById: "tm-2", uploadedAt: "2026-07-28T09:50:00Z", visibleToClient: true },
  { id: "fl-2", name: "content-plan-august.pdf", kind: "PDF", sizeBytes: 318_000, projectId: "pj-2", uploadedById: "tm-4", uploadedAt: "2026-07-27T14:10:00Z", visibleToClient: true },
  { id: "fl-3", name: "api-integration-notes.md", kind: "Markdown", sizeBytes: 12_400, projectId: "pj-3", uploadedById: "tm-3", uploadedAt: "2026-07-26T16:35:00Z", visibleToClient: false },
  { id: "fl-4", name: "launch-checklist.xlsx", kind: "Spreadsheet", sizeBytes: 96_200, projectId: "pj-4", uploadedById: "tm-2", uploadedAt: "2026-07-29T11:00:00Z", visibleToClient: true },
];

export const demoSupportTickets: SupportTicket[] = [
  { id: "st-1", reference: "SUP-2026-018", subject: "Contact form not sending", clientId: "cl-4", priority: "High", status: "Open", openedAt: "2026-07-30T07:45:00Z", assigneeId: "tm-5" },
  { id: "st-2", reference: "SUP-2026-017", subject: "Request to add a staff account", clientId: "cl-3", priority: "Low", status: "In Progress", openedAt: "2026-07-28T12:20:00Z", assigneeId: "tm-5" },
  { id: "st-3", reference: "SUP-2026-016", subject: "Slow page load on listings", clientId: "cl-3", priority: "Medium", status: "Open", openedAt: "2026-07-27T09:10:00Z", assigneeId: null },
  { id: "st-4", reference: "SUP-2026-015", subject: "Update opening hours", clientId: "cl-1", priority: "Low", status: "Resolved", openedAt: "2026-07-22T15:00:00Z", assigneeId: "tm-5" },
];

/* -------------------------------------------------------------------------- */
/* Activity                                                                    */
/* -------------------------------------------------------------------------- */

export const demoActivity: ActivityEvent[] = [
  { id: "ac-1", kind: "design_approved", summary: "Approved “Services Page Layout” (v1)", actor: "Example Wellness Clinic", occurredAt: "2026-07-30T09:12:00Z", href: "/admin/approvals" },
  { id: "ac-2", kind: "file_uploaded", summary: "Uploaded “launch-checklist.xlsx”", actor: "Morgan Lee", occurredAt: "2026-07-29T11:00:00Z", href: "/admin/files" },
  { id: "ac-3", kind: "revision_requested", summary: "Requested changes on “Brand Colour Direction” (v3)", actor: "Example Brewing", occurredAt: "2026-07-28T16:44:00Z", href: "/admin/approvals" },
  { id: "ac-4", kind: "invoice_paid", summary: "Paid invoice INV-2026-029", actor: "Example Brewing", occurredAt: "2026-07-08T10:02:00Z", href: "/admin/invoices" },
  { id: "ac-5", kind: "support_opened", summary: "Opened SUP-2026-018 — Contact form not sending", actor: "Example Outfitters", occurredAt: "2026-07-30T07:45:00Z", href: "/admin/support" },
  { id: "ac-6", kind: "consultation_booked", summary: "Booked a consultation for Aug 3", actor: "Example Roofing Co.", occurredAt: "2026-07-24T13:30:00Z", href: "/admin/consultations" },
];

/* -------------------------------------------------------------------------- */
/* Analytics series                                                            */
/* -------------------------------------------------------------------------- */

export const demoRevenueSeries: RevenuePoint[] = [
  { month: "Feb", revenue: 410000, payments: 380000, outstanding: 30000 },
  { month: "Mar", revenue: 525000, payments: 470000, outstanding: 55000 },
  { month: "Apr", revenue: 480000, payments: 455000, outstanding: 25000 },
  { month: "May", revenue: 640000, payments: 560000, outstanding: 80000 },
  { month: "Jun", revenue: 720000, payments: 690000, outstanding: 30000 },
  { month: "Jul", revenue: 815000, payments: 655000, outstanding: 160000 },
];

export const demoLeadSources: LeadSourcePoint[] = [
  { source: "Organic Search", count: 34 },
  { source: "Direct", count: 21 },
  { source: "Social", count: 17 },
  { source: "Referrals", count: 12 },
  { source: "Email", count: 8 },
];

/* -------------------------------------------------------------------------- */
/* Website content                                                             */
/* -------------------------------------------------------------------------- */

export const demoContent: ContentItem[] = [
  { id: "ct-1", title: "What a Small Business Website Actually Needs", path: "/resources/what-a-small-business-website-actually-needs", status: "Published", updatedAt: "2026-07-18", authorId: "tm-4" },
  { id: "ct-2", title: "When Custom Software Is Worth It", path: "/resources/when-custom-software-is-worth-it", status: "Published", updatedAt: "2026-07-04", authorId: "tm-1" },
  { id: "ct-3", title: "Local SEO Basics for Calgary Businesses", path: "/resources/local-seo-basics-for-calgary-businesses", status: "Published", updatedAt: "2026-06-21", authorId: "tm-4" },
  { id: "ct-4", title: "Choosing Between a Rebuild and a Refresh", path: null, status: "Draft", updatedAt: "2026-07-29", authorId: "tm-4" },
];

export const demoSubscribers: Subscriber[] = [
  { id: "sb-1", email: "reader1@example.com", subscribedAt: "2026-07-28T08:00:00Z", confirmed: true },
  { id: "sb-2", email: "reader2@example.com", subscribedAt: "2026-07-25T19:30:00Z", confirmed: true },
  { id: "sb-3", email: "reader3@example.com", subscribedAt: "2026-07-21T12:10:00Z", confirmed: false },
];
