/**
 * Seeds the database with the demo dataset.
 *
 *   DATABASE_URL=... npx tsx scripts/seed.ts
 *
 * DEVELOPMENT ONLY. Everything inserted is the invented sample data from
 * `src/data/demo-data.ts` — no real client, project or financial record. The
 * script refuses to run against a production database.
 *
 * Idempotent: it clears the tables it owns first, in foreign-key order, so
 * running it twice leaves the same state rather than duplicating rows.
 */

import {
  demoActivity,
  demoApprovals,
  demoClients,
  demoConsultations,
  demoContent,
  demoFiles,
  demoInvoices,
  demoLeads,
  demoMessageEntries,
  demoMessages,
  demoMilestones,
  demoProjects,
  demoProposals,
  demoRevisions,
  demoSubscribers,
  demoSupportTickets,
  demoTasks,
  demoTeam,
} from "@/data/demo-data";
import { closeDb, getDb } from "@/lib/db/client";
import * as t from "@/lib/db/schema";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo data into a production database.");
  }

  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");

  console.log("Clearing existing rows…");
  // Children before parents — the foreign keys are enforced.
  await db.delete(t.messageEntries);
  await db.delete(t.messageThreads);
  await db.delete(t.activityEvents);
  await db.delete(t.projectFiles);
  await db.delete(t.approvals);
  await db.delete(t.revisions);
  await db.delete(t.tasks);
  await db.delete(t.milestones);
  await db.delete(t.invoices);
  await db.delete(t.proposals);
  await db.delete(t.supportTickets);
  await db.delete(t.consultations);
  await db.delete(t.leads);
  await db.delete(t.projects);
  await db.delete(t.clients);
  await db.delete(t.contentItems);
  await db.delete(t.subscribers);
  await db.delete(t.teamMembers);

  console.log("Inserting demo data…");

  await db.insert(t.teamMembers).values(
    demoTeam.map(({ id, slug, name, initials, role, title }) => ({
      id,
      slug,
      name,
      initials,
      role,
      title,
    })),
  );

  await db.insert(t.clients).values(
    demoClients.map(({ activeProjects: _derived, ...client }) => client),
  );

  await db.insert(t.projects).values(demoProjects);
  await db.insert(t.milestones).values(demoMilestones);

  await db
    .insert(t.leads)
    .values(demoLeads.map((lead) => ({ ...lead, submittedAt: new Date(lead.submittedAt) })));

  await db.insert(t.consultations).values(demoConsultations);
  await db.insert(t.tasks).values(demoTasks);

  await db
    .insert(t.approvals)
    .values(demoApprovals.map((a) => ({ ...a, submittedAt: new Date(a.submittedAt) })));

  await db
    .insert(t.revisions)
    .values(demoRevisions.map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) })));

  await db
    .insert(t.messageThreads)
    .values(demoMessages.map((m) => ({ ...m, lastActivityAt: new Date(m.lastActivityAt) })));

  await db
    .insert(t.messageEntries)
    .values(demoMessageEntries.map((e) => ({ ...e, sentAt: new Date(e.sentAt) })));

  await db
    .insert(t.proposals)
    .values(
      demoProposals.map((p) => ({ ...p, sentAt: p.sentAt ? new Date(p.sentAt) : null })),
    );

  await db.insert(t.invoices).values(demoInvoices);

  await db
    .insert(t.projectFiles)
    .values(demoFiles.map((f) => ({ ...f, uploadedAt: new Date(f.uploadedAt) })));

  await db
    .insert(t.supportTickets)
    .values(demoSupportTickets.map((s) => ({ ...s, openedAt: new Date(s.openedAt) })));

  /*
   * Activity gets a real client_id so the portal can scope with a WHERE clause
   * instead of matching on the display name, which the fixtures had to do.
   */
  const clientByName = new Map(demoClients.map((client) => [client.name, client.id]));
  await db.insert(t.activityEvents).values(
    demoActivity.map((event) => ({
      ...event,
      clientId: clientByName.get(event.actor) ?? null,
      occurredAt: new Date(event.occurredAt),
    })),
  );

  await db.insert(t.contentItems).values(demoContent);

  await db
    .insert(t.subscribers)
    .values(demoSubscribers.map((s) => ({ ...s, subscribedAt: new Date(s.subscribedAt) })));

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(closeDb);
