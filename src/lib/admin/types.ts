/**
 * ============================================================================
 * ADMIN DOMAIN MODELS
 * ============================================================================
 *
 * The single source of truth for every record the admin portal displays.
 *
 * These types are storage-agnostic on purpose. Today they are satisfied by the
 * demo fixtures in `src/data/admin-demo-data.ts`; tomorrow they should be
 * satisfied by database rows. Nothing in the UI imports the fixtures directly —
 * everything goes through `src/lib/admin/repository.ts`, so swapping the source
 * is a change in one file.
 *
 * Money is stored in CENTS as an integer. Never use a float for currency.
 */

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                           */
/* -------------------------------------------------------------------------- */

/** ISO-8601 date, `yyyy-mm-dd`. */
export type IsoDate = string;
/** ISO-8601 timestamp. */
export type IsoDateTime = string;

/** Integer minor units (cents). `125000` = $1,250.00 CAD. */
export type Cents = number;

export const CURRENCY = "CAD" as const;

/**
 * Tone drives the badge colour, but colour is never the only signal — every
 * status renders its own text label alongside. Mirrors `BadgeTone`.
 */
export type Tone = "success" | "info" | "warning" | "danger" | "neutral";

export type Priority = "High" | "Medium" | "Low";

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

/* -------------------------------------------------------------------------- */
/* Team & permissions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Role names are fixed; the permission matrix that maps them to capabilities
 * lives in `src/lib/admin/permissions.ts`.
 */
export type AdminRole =
  | "Super Admin"
  | "Project Manager"
  | "Developer"
  | "Marketing"
  | "Finance"
  | "Support"
  | "Viewer";

export const ADMIN_ROLES: AdminRole[] = [
  "Super Admin",
  "Project Manager",
  "Developer",
  "Marketing",
  "Finance",
  "Support",
  "Viewer",
];

export interface TeamMemberRecord {
  id: string;
  /** Matches `slug` in src/data/team.ts so the two never drift apart. */
  slug: string;
  name: string;
  /** Derived for avatars. No photographs are invented. */
  initials: string;
  role: AdminRole;
  /** Job title as published on the public team page. */
  title: string;
  assignedTasks: number;
  completedTasks: number;
  activeProjects: number;
  /** 0–100. Derived from assigned vs. capacity, not hand-written. */
  workloadPercent: number;
}

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

export type LeadStage =
  | "New"
  | "Contacted"
  | "Consultation"
  | "Proposal Sent"
  | "Converted";

export const LEAD_STAGES: LeadStage[] = [
  "New",
  "Contacted",
  "Consultation",
  "Proposal Sent",
  "Converted",
];

/**
 * Where the lead came from. `source` describes the marketing channel;
 * `origin` records which website form actually created the record, so the
 * admin can be traced back to the public site.
 */
export type LeadSource = "Organic Search" | "Direct" | "Social" | "Referrals" | "Email";

export const LEAD_SOURCES: LeadSource[] = [
  "Organic Search",
  "Direct",
  "Social",
  "Referrals",
  "Email",
];

/** Which public form produced this record. Mirrors the four API routes. */
export type SubmissionOrigin = "quote" | "contact" | "booking" | "newsletter";

export type FollowUpStatus = "Due today" | "Overdue" | "Scheduled" | "None";

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  /** Service requested, using the public site's own vocabulary. */
  service: string;
  /** Budget band as selected on the quote form. Free text, never parsed. */
  budget: string | null;
  stage: LeadStage;
  source: LeadSource;
  origin: SubmissionOrigin;
  /** Team member id, or null when nobody has picked it up yet. */
  assigneeId: string | null;
  submittedAt: IsoDateTime;
  followUp: FollowUpStatus;
  /** The message body from the originating form. */
  notes: string | null;
}

/* -------------------------------------------------------------------------- */
/* Consultations                                                               */
/* -------------------------------------------------------------------------- */

export type ConsultationStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

export interface Consultation {
  id: string;
  /** Display name of the lead or client being met. */
  contactName: string;
  company: string | null;
  service: string;
  date: IsoDate;
  /** 24h local time, `HH:mm`. */
  time: string;
  timeZone: string;
  status: ConsultationStatus;
  /**
   * Video-call URL. null until a calendar provider is configured — the UI must
   * not render an enabled Join button when this is null.
   */
  meetingUrl: string | null;
  leadId: string | null;
}

/* -------------------------------------------------------------------------- */
/* Clients & projects                                                          */
/* -------------------------------------------------------------------------- */

export type ClientStatus = "Active" | "Prospect" | "Dormant" | "Archived";

export interface Client {
  id: string;
  name: string;
  /** Primary contact person. */
  contactName: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  industry: string | null;
  since: IsoDate;
  activeProjects: number;
  /** Lifetime billed, in cents. */
  lifetimeValue: Cents;
}

export type ProjectStatus =
  | "On Track"
  | "Waiting on Client"
  | "At Risk"
  | "On Hold"
  | "Completed";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "On Track",
  "Waiting on Client",
  "At Risk",
  "On Hold",
  "Completed",
];

export const PROJECT_STATUS_TONE: Record<ProjectStatus, Tone> = {
  "On Track": "success",
  "Waiting on Client": "info",
  "At Risk": "danger",
  "On Hold": "neutral",
  Completed: "success",
};

export type ProjectPhase =
  | "Discovery"
  | "Strategy"
  | "Design"
  | "Development"
  | "Launch";

export interface Project {
  id: string;
  name: string;
  clientId: string;
  service: string;
  /** 0–100. */
  progressPercent: number;
  phase: ProjectPhase;
  nextMilestone: string | null;
  deadline: IsoDate | null;
  ownerId: string;
  status: ProjectStatus;
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: IsoDate;
  assigneeId: string;
  projectId: string | null;
  completed: boolean;
}

/* -------------------------------------------------------------------------- */
/* Workflow records                                                            */
/* -------------------------------------------------------------------------- */

export type ApprovalStatus = "Awaiting Client" | "Approved" | "Changes Requested";

export interface Approval {
  id: string;
  title: string;
  projectId: string;
  version: string;
  status: ApprovalStatus;
  submittedAt: IsoDateTime;
  commentCount: number;
}

export interface Message {
  id: string;
  /** Thread subject. */
  subject: string;
  clientId: string;
  projectId: string | null;
  preview: string;
  lastActivityAt: IsoDateTime;
  unread: boolean;
  /** Who sent the most recent message. */
  lastSender: "client" | "team";
}

export type ProposalStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Declined";

export interface Proposal {
  id: string;
  reference: string;
  clientId: string;
  service: string;
  amount: Cents;
  status: ProposalStatus;
  sentAt: IsoDateTime | null;
  validUntil: IsoDate | null;
}

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Void";

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, Tone> = {
  Draft: "neutral",
  Sent: "info",
  Paid: "success",
  Overdue: "danger",
  Void: "neutral",
};

export interface Invoice {
  id: string;
  reference: string;
  clientId: string;
  projectId: string | null;
  amount: Cents;
  status: InvoiceStatus;
  issuedAt: IsoDate;
  dueAt: IsoDate;
  paidAt: IsoDate | null;
}

export interface AdminFile {
  id: string;
  name: string;
  /** Extension-derived label, e.g. "PDF", "Figma". */
  kind: string;
  sizeBytes: number;
  projectId: string;
  uploadedById: string;
  uploadedAt: IsoDateTime;
  /** Whether the client can see it in their portal. */
  visibleToClient: boolean;
}

export type SupportStatus = "Open" | "In Progress" | "Resolved";

export interface SupportTicket {
  id: string;
  reference: string;
  subject: string;
  clientId: string;
  priority: Priority;
  status: SupportStatus;
  openedAt: IsoDateTime;
  assigneeId: string | null;
}

/* -------------------------------------------------------------------------- */
/* Activity feed                                                               */
/* -------------------------------------------------------------------------- */

export type ActivityKind =
  | "design_approved"
  | "file_uploaded"
  | "revision_requested"
  | "invoice_paid"
  | "support_opened"
  | "lead_created"
  | "consultation_booked";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  /** Pre-composed summary line. */
  summary: string;
  /** Who or what the event concerns. */
  actor: string;
  occurredAt: IsoDateTime;
  /** Deep link into the admin, when the record has a page. */
  href: string | null;
}

/* -------------------------------------------------------------------------- */
/* Analytics                                                                   */
/* -------------------------------------------------------------------------- */

export interface RevenuePoint {
  /** Short month label, e.g. "Jan". */
  month: string;
  revenue: Cents;
  payments: Cents;
  outstanding: Cents;
}

export interface LeadSourcePoint {
  source: LeadSource;
  count: number;
}

/* -------------------------------------------------------------------------- */
/* Website content                                                             */
/* -------------------------------------------------------------------------- */

export type ContentStatus = "Published" | "Draft" | "Scheduled";

export interface ContentItem {
  id: string;
  title: string;
  /** Route the item is published at, when it has one. */
  path: string | null;
  status: ContentStatus;
  updatedAt: IsoDate;
  authorId: string | null;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: IsoDateTime;
  confirmed: boolean;
}
