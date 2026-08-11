/**
 * ============================================================================
 * DATABASE SCHEMA
 * ============================================================================
 *
 * The physical counterpart to `src/lib/domain/types.ts`. Every table here
 * exists to satisfy a domain type — the domain model came first and the schema
 * follows it, not the other way round.
 *
 * Conventions, applied consistently:
 *
 *   - Money is `integer` CENTS. Never `float`/`real` — binary floating point
 *     cannot represent 0.10 exactly and rounding errors compound across sums.
 *   - Dates that are calendar dates (a deadline, a due date) are `date`.
 *     Instants (when something happened) are `timestamptz`, so they carry a
 *     zone and cannot drift when the server's zone changes.
 *   - Status columns are Postgres enums, so the database rejects a value the
 *     TypeScript union would not permit. The two must be kept in step.
 *   - Foreign keys declare their delete behaviour explicitly. Nothing relies on
 *     the default.
 */

import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/* Enums — mirror the unions in src/lib/domain/types.ts                        */
/* -------------------------------------------------------------------------- */

export const adminRole = pgEnum("admin_role", [
  "Super Admin",
  "Project Manager",
  "Developer",
  "Marketing",
  "Finance",
  "Support",
  "Viewer",
]);

export const leadStage = pgEnum("lead_stage", [
  "New",
  "Contacted",
  "Consultation",
  "Proposal Sent",
  "Converted",
]);

export const leadSource = pgEnum("lead_source", [
  "Organic Search",
  "Direct",
  "Social",
  "Referrals",
  "Email",
]);

export const submissionOrigin = pgEnum("submission_origin", [
  "quote",
  "contact",
  "booking",
  "newsletter",
]);

export const followUpStatus = pgEnum("follow_up_status", [
  "Due today",
  "Overdue",
  "Scheduled",
  "None",
]);

export const consultationStatus = pgEnum("consultation_status", [
  "Confirmed",
  "Pending",
  "Cancelled",
  "Completed",
]);

export const clientStatus = pgEnum("client_status", [
  "Active",
  "Prospect",
  "Dormant",
  "Archived",
]);

export const projectStatus = pgEnum("project_status", [
  "On Track",
  "Waiting on Client",
  "At Risk",
  "On Hold",
  "Completed",
]);

export const projectPhase = pgEnum("project_phase", [
  "Discovery",
  "Strategy",
  "Design",
  "Development",
  "Review",
  "Launch",
]);

export const milestoneStatus = pgEnum("milestone_status", [
  "Completed",
  "Upcoming",
  "Scheduled",
  "Pending",
]);

export const priority = pgEnum("priority", ["High", "Medium", "Low"]);

export const approvalStatus = pgEnum("approval_status", [
  "Awaiting Client",
  "Approved",
  "Changes Requested",
]);

export const revisionStatus = pgEnum("revision_status", [
  "Requested",
  "In Review",
  "Completed",
]);

export const proposalStatus = pgEnum("proposal_status", [
  "Draft",
  "Sent",
  "Viewed",
  "Accepted",
  "Declined",
]);

export const invoiceStatus = pgEnum("invoice_status", [
  "Draft",
  "Sent",
  "Paid",
  "Overdue",
  "Void",
]);

export const supportStatus = pgEnum("support_status", ["Open", "In Progress", "Resolved"]);

export const contentStatus = pgEnum("content_status", ["Published", "Draft", "Scheduled"]);

export const fileFolder = pgEnum("file_folder", [
  "Brand Assets",
  "Content",
  "Designs",
  "Development",
  "Final Deliverables",
]);

export const messageSender = pgEnum("message_sender", ["team", "client"]);

export const activityKind = pgEnum("activity_kind", [
  "design_approved",
  "file_uploaded",
  "revision_requested",
  "invoice_paid",
  "support_opened",
  "lead_created",
  "consultation_booked",
]);

/* -------------------------------------------------------------------------- */
/* Identity — Auth.js tables plus our own membership                           */
/* -------------------------------------------------------------------------- */

/**
 * People who can sign in. Shape follows the Auth.js Drizzle adapter so OAuth
 * providers can be added later without a migration.
 *
 * `passwordHash` is argon2id and is NEVER selected into anything that reaches a
 * component — see `selectUserForSignIn` in queries.ts, the only read of it.
 *
 * `adminRole` null means "not staff". Staff access is the presence of a role,
 * not a boolean flag, so there is one source of truth for what someone may do.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  /** argon2id. Null for accounts that only use OAuth. */
  passwordHash: text("password_hash"),
  /** Null = client-side user. Set = staff, with these capabilities. */
  adminRole: adminRole("admin_role"),
  /** Disabled accounts keep their history but cannot sign in. */
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** OAuth provider links. Unused with credentials, required by the adapter. */
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerIdx: uniqueIndex("accounts_provider_idx").on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("verification_tokens_idx").on(table.identifier, table.token),
  }),
);

/**
 * Which clients a user may see. Many-to-many on purpose: one contact can cover
 * two brands, and two people at one company both need access. Modelling this as
 * a column on `users` would be wrong on day one.
 *
 * This table IS the portal's authorisation boundary. A session may only read a
 * client that appears here for that user.
 */
export const clientUsers = pgTable(
  "client_users",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    membershipIdx: uniqueIndex("client_users_membership_idx").on(table.userId, table.clientId),
  }),
);

/**
 * Failed sign-in attempts, for rate limiting.
 *
 * Credentials auth is an unauthenticated public endpoint that checks a secret,
 * so it must be throttled or it is a brute-force target. Keyed by email AND by
 * IP so neither a single account nor a single source can be hammered.
 */
export const signInAttempts = pgTable("sign_in_attempts", {
  id: text("id").primaryKey(),
  /** Lowercased email, or `ip:1.2.3.4`. */
  key: text("key").notNull(),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/* Team                                                                        */
/* -------------------------------------------------------------------------- */

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  role: adminRole("role").notNull(),
  title: text("title").notNull(),
  /**
   * The sign-in account for this staff member, when they have one. Nullable
   * because a person can be assignable work before they have a login, and
   * unique because one account is one person.
   */
  userId: text("user_id")
    .references(() => users.id, { onDelete: "set null" })
    .unique(),
});

/* -------------------------------------------------------------------------- */
/* Clients & leads                                                             */
/* -------------------------------------------------------------------------- */

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: clientStatus("status").notNull().default("Prospect"),
  industry: text("industry"),
  since: date("since").notNull(),
  lifetimeValue: integer("lifetime_value_cents").notNull().default(0),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  budget: text("budget"),
  stage: leadStage("stage").notNull().default("New"),
  /** Nullable: no form collects attribution, so it is genuinely unknown. */
  source: leadSource("source"),
  origin: submissionOrigin("origin").notNull(),
  assigneeId: text("assignee_id").references(() => teamMembers.id, { onDelete: "set null" }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  followUp: followUpStatus("follow_up").notNull().default("Due today"),
  notes: text("notes"),
});

export const consultations = pgTable("consultations", {
  id: text("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  company: text("company"),
  service: text("service").notNull(),
  date: date("date").notNull(),
  /** 24h local time, HH:mm. Stored with its zone in `time_zone`. */
  time: text("time").notNull(),
  timeZone: text("time_zone").notNull(),
  status: consultationStatus("status").notNull().default("Pending"),
  meetingUrl: text("meeting_url"),
  /** Deleting a lead must not delete the record of the meeting. */
  leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
});

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  service: text("service").notNull(),
  progressPercent: integer("progress_percent").notNull().default(0),
  phase: projectPhase("phase").notNull().default("Discovery"),
  deadline: date("deadline"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "restrict" }),
  status: projectStatus("status").notNull().default("On Track"),
  // No `next_milestone` column: it is derived from `milestones`, and storing it
  // would let the two disagree.
});

export const milestones = pgTable("milestones", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dueDate: date("due_date").notNull(),
  status: milestoneStatus("status").notNull().default("Pending"),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  priority: priority("priority").notNull().default("Medium"),
  dueDate: date("due_date").notNull(),
  assigneeId: text("assignee_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "restrict" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
});

/* -------------------------------------------------------------------------- */
/* Workflow                                                                    */
/* -------------------------------------------------------------------------- */

export const approvals = pgTable("approvals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  status: approvalStatus("status").notNull().default("Awaiting Client"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  commentCount: integer("comment_count").notNull().default(0),
});

export const revisions = pgTable("revisions", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  priority: priority("priority").notNull().default("Medium"),
  status: revisionStatus("status").notNull().default("Requested"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  commentCount: integer("comment_count").notNull().default(0),
});

export const messageThreads = pgTable("message_threads", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  preview: text("preview").notNull(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull().defaultNow(),
  unread: boolean("unread").notNull().default(false),
  lastSender: messageSender("last_sender").notNull(),
});

export const messageEntries = pgTable("message_entries", {
  id: text("id").primaryKey(),
  threadId: text("thread_id")
    .notNull()
    .references(() => messageThreads.id, { onDelete: "cascade" }),
  from: messageSender("sender").notNull(),
  body: text("body").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  title: text("title").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  service: text("service").notNull(),
  amount: integer("amount_cents").notNull(),
  status: proposalStatus("status").notNull().default("Draft"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  validUntil: date("valid_until"),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  amount: integer("amount_cents").notNull(),
  status: invoiceStatus("status").notNull().default("Draft"),
  issuedAt: date("issued_at").notNull(),
  dueAt: date("due_at").notNull(),
  paidAt: date("paid_at"),
});

export const projectFiles = pgTable("project_files", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  folder: fileFolder("folder").notNull(),
  uploadedById: text("uploaded_by_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "restrict" }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  /** Security-relevant: the portal filters on this. Defaults to hidden. */
  visibleToClient: boolean("visible_to_client").notNull().default(false),
});

export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  subject: text("subject").notNull(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  priority: priority("priority").notNull().default("Medium"),
  status: supportStatus("status").notNull().default("Open"),
  openedAt: timestamp("opened_at", { withTimezone: true }).notNull().defaultNow(),
  assigneeId: text("assignee_id").references(() => teamMembers.id, { onDelete: "set null" }),
});

/* -------------------------------------------------------------------------- */
/* Activity & content                                                          */
/* -------------------------------------------------------------------------- */

export const activityEvents = pgTable("activity_events", {
  id: text("id").primaryKey(),
  kind: activityKind("kind").notNull(),
  summary: text("summary").notNull(),
  actor: text("actor").notNull(),
  /** Set when the event concerns a specific client, for portal scoping. */
  clientId: text("client_id").references(() => clients.id, { onDelete: "cascade" }),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  href: text("href"),
});

export const contentItems = pgTable("content_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  path: text("path"),
  status: contentStatus("status").notNull().default("Draft"),
  updatedAt: date("updated_at").notNull(),
  authorId: text("author_id").references(() => teamMembers.id, { onDelete: "set null" }),
});

export const subscribers = pgTable(
  "subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
    /** False until a double opt-in is confirmed. Never default to true. */
    confirmed: boolean("confirmed").notNull().default(false),
  },
  (table) => ({
    // Re-subscribing must not create a duplicate row.
    emailIdx: uniqueIndex("subscribers_email_idx").on(table.email),
  }),
);
