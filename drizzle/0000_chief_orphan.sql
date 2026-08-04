CREATE TYPE "public"."activity_kind" AS ENUM('design_approved', 'file_uploaded', 'revision_requested', 'invoice_paid', 'support_opened', 'lead_created', 'consultation_booked');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('Super Admin', 'Project Manager', 'Developer', 'Marketing', 'Finance', 'Support', 'Viewer');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('Awaiting Client', 'Approved', 'Changes Requested');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('Active', 'Prospect', 'Dormant', 'Archived');--> statement-breakpoint
CREATE TYPE "public"."consultation_status" AS ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('Published', 'Draft', 'Scheduled');--> statement-breakpoint
CREATE TYPE "public"."file_folder" AS ENUM('Brand Assets', 'Content', 'Designs', 'Development', 'Final Deliverables');--> statement-breakpoint
CREATE TYPE "public"."follow_up_status" AS ENUM('Due today', 'Overdue', 'Scheduled', 'None');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Void');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('Organic Search', 'Direct', 'Social', 'Referrals', 'Email');--> statement-breakpoint
CREATE TYPE "public"."lead_stage" AS ENUM('New', 'Contacted', 'Consultation', 'Proposal Sent', 'Converted');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('team', 'client');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('Completed', 'Upcoming', 'Scheduled', 'Pending');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('High', 'Medium', 'Low');--> statement-breakpoint
CREATE TYPE "public"."project_phase" AS ENUM('Discovery', 'Strategy', 'Design', 'Development', 'Review', 'Launch');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('On Track', 'Waiting on Client', 'At Risk', 'On Hold', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('Draft', 'Sent', 'Viewed', 'Accepted', 'Declined');--> statement-breakpoint
CREATE TYPE "public"."revision_status" AS ENUM('Requested', 'In Review', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."submission_origin" AS ENUM('quote', 'contact', 'booking', 'newsletter');--> statement-breakpoint
CREATE TYPE "public"."support_status" AS ENUM('Open', 'In Progress', 'Resolved');--> statement-breakpoint
CREATE TABLE "activity_events" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" "activity_kind" NOT NULL,
	"summary" text NOT NULL,
	"actor" text NOT NULL,
	"client_id" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"href" text
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"project_id" text NOT NULL,
	"version" text NOT NULL,
	"status" "approval_status" DEFAULT 'Awaiting Client' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"status" "client_status" DEFAULT 'Prospect' NOT NULL,
	"industry" text,
	"since" date NOT NULL,
	"lifetime_value_cents" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_name" text NOT NULL,
	"company" text,
	"service" text NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"time_zone" text NOT NULL,
	"status" "consultation_status" DEFAULT 'Pending' NOT NULL,
	"meeting_url" text,
	"lead_id" text
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"path" text,
	"status" "content_status" DEFAULT 'Draft' NOT NULL,
	"updated_at" date NOT NULL,
	"author_id" text
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"client_id" text NOT NULL,
	"project_id" text,
	"amount_cents" integer NOT NULL,
	"status" "invoice_status" DEFAULT 'Draft' NOT NULL,
	"issued_at" date NOT NULL,
	"due_at" date NOT NULL,
	"paid_at" date,
	CONSTRAINT "invoices_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text,
	"service" text NOT NULL,
	"budget" text,
	"stage" "lead_stage" DEFAULT 'New' NOT NULL,
	"source" "lead_source",
	"origin" "submission_origin" NOT NULL,
	"assignee_id" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"follow_up" "follow_up_status" DEFAULT 'Due today' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "message_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"sender" "message_sender" NOT NULL,
	"body" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"client_id" text NOT NULL,
	"project_id" text,
	"preview" text NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unread" boolean DEFAULT false NOT NULL,
	"last_sender" "message_sender" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"due_date" date NOT NULL,
	"status" "milestone_status" DEFAULT 'Pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_files" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"project_id" text NOT NULL,
	"folder" "file_folder" NOT NULL,
	"uploaded_by_id" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visible_to_client" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"client_id" text NOT NULL,
	"service" text NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"phase" "project_phase" DEFAULT 'Discovery' NOT NULL,
	"deadline" date,
	"owner_id" text NOT NULL,
	"status" "project_status" DEFAULT 'On Track' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"title" text NOT NULL,
	"client_id" text NOT NULL,
	"service" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" "proposal_status" DEFAULT 'Draft' NOT NULL,
	"sent_at" timestamp with time zone,
	"valid_until" date,
	CONSTRAINT "proposals_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"priority" "priority" DEFAULT 'Medium' NOT NULL,
	"status" "revision_status" DEFAULT 'Requested' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"subject" text NOT NULL,
	"client_id" text NOT NULL,
	"priority" "priority" DEFAULT 'Medium' NOT NULL,
	"status" "support_status" DEFAULT 'Open' NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assignee_id" text,
	CONSTRAINT "support_tickets_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"priority" "priority" DEFAULT 'Medium' NOT NULL,
	"due_date" date NOT NULL,
	"assignee_id" text NOT NULL,
	"project_id" text,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"initials" text NOT NULL,
	"role" "admin_role" NOT NULL,
	"title" text NOT NULL,
	CONSTRAINT "team_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignee_id_team_members_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_entries" ADD CONSTRAINT "message_entries_thread_id_message_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."message_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_uploaded_by_id_team_members_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."team_members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_team_members_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."team_members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignee_id_team_members_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_team_members_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."team_members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");