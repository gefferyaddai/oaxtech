/**
 * ============================================================================
 * CLIENT PORTAL — DEMONSTRATION DATA
 * ============================================================================
 *
 * Everything in this file is fictional sample content used to demonstrate the
 * portal interface. It is not connected to a database, a payment processor, or
 * a document-signing service.
 *
 * Every value that would normally be a real date is prefixed "Demo:" so it can
 * never be mistaken for live project information, and the portal renders a
 * persistent demo banner.
 */

export const PORTAL_IS_DEMO = true;

export const DEMO_NOTICE =
  "Demo mode. Everything shown in the portal is sample content — no real project data, payments or signatures.";

export interface DemoProject {
  id: string;
  name: string;
  progressPercent: number;
  phase: string;
  status: string;
}

export const demoProjects: DemoProject[] = [
  {
    id: "demo-project-1",
    name: "Website Redesign Project",
    progressPercent: 68,
    phase: "Design phase in progress",
    status: "On Track",
  },
];

export type StatusTone = "success" | "info" | "warning" | "neutral" | "danger";

export interface DemoMilestone {
  name: string;
  dueLabel: string;
  status: string;
  tone: StatusTone;
}

export const demoMilestones: DemoMilestone[] = [
  { name: "Project Kickoff", dueLabel: "Demo: May 5", status: "Completed", tone: "success" },
  { name: "Homepage Design Review", dueLabel: "Demo: May 19", status: "Upcoming", tone: "info" },
  { name: "Development Handoff", dueLabel: "Demo: Jun 2", status: "Scheduled", tone: "warning" },
  { name: "Final Review", dueLabel: "Demo: Jun 16", status: "Pending", tone: "neutral" },
];

export interface DemoPhase {
  label: string;
  state: "complete" | "in-progress" | "upcoming";
}

export const demoPhases: DemoPhase[] = [
  { label: "Discovery", state: "complete" },
  { label: "Strategy", state: "complete" },
  { label: "Design", state: "in-progress" },
  { label: "Development", state: "upcoming" },
  { label: "Review", state: "upcoming" },
  { label: "Launch", state: "upcoming" },
];

export interface DemoActivity {
  title: string;
  detail: string;
  dateLabel: string;
  icon: string;
}

export const demoActivity: DemoActivity[] = [
  { title: "New design uploaded", detail: "Homepage Concept v2 was uploaded", dateLabel: "Demo: May 15", icon: "FileText" },
  { title: "Revision request received", detail: "Update hero headline", dateLabel: "Demo: May 14", icon: "PenSquare" },
  { title: "Invoice available", detail: "Invoice INV-2025-001 is ready", dateLabel: "Demo: May 13", icon: "Receipt" },
  { title: "Message from project team", detail: "We've scheduled a design review", dateLabel: "Demo: May 12", icon: "MessageSquare" },
];

export interface DemoFolder {
  name: string;
  fileCount: number;
}

export const demoFolders: DemoFolder[] = [
  { name: "Brand Assets", fileCount: 12 },
  { name: "Content", fileCount: 8 },
  { name: "Designs", fileCount: 15 },
  { name: "Development", fileCount: 22 },
  { name: "Final Deliverables", fileCount: 5 },
];

export interface DemoFile {
  name: string;
  type: string;
  updatedLabel: string;
  status: string;
  tone: StatusTone;
}

export const demoFiles: DemoFile[] = [
  { name: "homepage-concept-v2.pdf", type: "PDF", updatedLabel: "Demo: May 15", status: "New", tone: "success" },
  { name: "brand-assets.zip", type: "ZIP", updatedLabel: "Demo: May 15", status: "New", tone: "success" },
  { name: "services-page-v1.pdf", type: "PDF", updatedLabel: "Demo: May 14", status: "Review", tone: "info" },
  { name: "content-guide.docx", type: "DOCX", updatedLabel: "Demo: May 13", status: "Published", tone: "neutral" },
  { name: "logo-variants.png", type: "PNG", updatedLabel: "Demo: May 12", status: "Published", tone: "neutral" },
];

export interface DemoApproval {
  title: string;
  version: string;
  status: string;
  tone: StatusTone;
  uploadedLabel: string;
  comments: number;
  awaitingAction: boolean;
}

export const demoApprovals: DemoApproval[] = [
  {
    title: "Homepage Concept",
    version: "v2",
    status: "Awaiting Approval",
    tone: "warning",
    uploadedLabel: "Uploaded Demo: May 15",
    comments: 3,
    awaitingAction: true,
  },
  {
    title: "Services Page",
    version: "v1",
    status: "Approved",
    tone: "success",
    uploadedLabel: "Approved Demo: May 12",
    comments: 2,
    awaitingAction: false,
  },
];

export interface DemoRevision {
  title: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  tone: StatusTone;
  requestedLabel: string;
  comments: number;
}

export const demoRevisions: DemoRevision[] = [
  { title: "Update hero headline", priority: "High", status: "In Review", tone: "info", requestedLabel: "Requested Demo: May 14", comments: 2 },
  { title: "Adjust mobile navigation", priority: "Medium", status: "Completed", tone: "success", requestedLabel: "Requested Demo: May 10", comments: 1 },
];

export interface DemoMessage {
  author: string;
  preview: string;
  timeLabel: string;
  unread: boolean;
}

export const demoThreads: DemoMessage[] = [
  { author: "OAX Project Team", preview: "Great! The updated design…", timeLabel: "Demo: 10:24 AM", unread: true },
  { author: "OAX Project Team", preview: "Design review scheduled", timeLabel: "Demo: Yesterday", unread: false },
  { author: "OAX Project Team", preview: "Invoice is now available", timeLabel: "Demo: May 13", unread: false },
];

export interface DemoChatEntry {
  from: "team" | "client";
  body: string;
  timeLabel: string;
}

export const demoConversation: DemoChatEntry[] = [
  {
    from: "team",
    body: "Hi there! Just wanted to let you know the updated homepage concept is ready for your review.",
    timeLabel: "Demo: 10:20 AM",
  },
  {
    from: "client",
    body: "Great! The updated design looks fantastic. A few minor tweaks and we're good to go.",
    timeLabel: "Demo: 10:24 AM",
  },
];

export interface DemoDocument {
  name: string;
  status: string;
  tone: StatusTone;
}

export const demoDocuments: DemoDocument[] = [
  { name: "Project Proposal", status: "Accepted", tone: "success" },
  { name: "Service Agreement", status: "Signed", tone: "success" },
  { name: "Scope of Work", status: "Signed", tone: "success" },
];

export interface DemoInvoice {
  reference: string;
  issuedLabel: string;
  amountLabel: string;
  status: string;
  tone: StatusTone;
}

/**
 * Amounts are intentionally withheld. Showing dollar figures here would imply a
 * real billing relationship and a live payment integration, neither of which
 * exists in demo mode.
 */
export const demoInvoices: DemoInvoice[] = [
  { reference: "INV-2025-001 (Demo)", issuedLabel: "Demo: May 13", amountLabel: "—", status: "Due Soon", tone: "warning" },
  { reference: "INV-2025-002 (Demo)", issuedLabel: "Demo: Apr 13", amountLabel: "—", status: "Paid", tone: "success" },
  { reference: "INV-2025-003 (Demo)", issuedLabel: "Demo: Mar 13", amountLabel: "—", status: "Paid", tone: "success" },
];

export interface DemoSupportRequest {
  title: string;
  priority: "High" | "Medium" | "Low";
  updatedLabel: string;
  status: string;
  tone: StatusTone;
  comments: number;
}

export const demoSupportRequests: DemoSupportRequest[] = [
  { title: "Login issue", priority: "Medium", updatedLabel: "Updated Demo: May 12", status: "In Progress", tone: "info", comments: 1 },
  { title: "File access request", priority: "Low", updatedLabel: "Updated Demo: May 8", status: "Resolved", tone: "success", comments: 2 },
];

export const demoCompletedCategories = [
  { name: "Source Files", note: "Coming soon" },
  { name: "Credentials & Handover", note: "Coming soon" },
  { name: "Final Assets", note: "Coming soon" },
];
