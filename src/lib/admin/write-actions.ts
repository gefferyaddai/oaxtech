"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/lib/admin/authorize";
import * as m from "@/lib/domain/mutations";
import { LEAD_STAGES, PRIORITIES, type LeadStage, type Priority } from "@/lib/domain/types";

/**
 * Admin write actions.
 *
 * EVERY action begins with `requireCapability()`. That is the real
 * authorisation check — `permissions.ts` only decides which buttons render, and
 * a hidden button stops nobody from crafting a POST.
 *
 * Actions return a plain result rather than throwing, so the UI can show an
 * inline message. An authorisation failure is caught and reported as a refusal,
 * never as a generic error that might be mistaken for a bug.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Turns a thrown AuthorizationError into a refusal the UI can render. */
async function guarded(
  capability: Parameters<typeof requireCapability>[0],
  work: () => Promise<m.MutationResult>,
): Promise<ActionResult> {
  try {
    await requireCapability(capability);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const result = await work();
  return result.ok ? { ok: true } : { ok: false, error: result.detail };
}

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

export async function moveLeadAction(leadId: string, stage: string): Promise<ActionResult> {
  if (!(LEAD_STAGES as string[]).includes(stage)) {
    return { ok: false, error: "Unknown stage." };
  }
  const result = await guarded("manage:records", () =>
    m.setLeadStage(leadId, stage as LeadStage),
  );
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
  }
  return result;
}

export async function assignLeadAction(
  leadId: string,
  assigneeId: string | null,
): Promise<ActionResult> {
  const result = await guarded("manage:records", () => m.assignLead(leadId, assigneeId));
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
  }
  return result;
}

export async function createLeadAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();

  if (!name || !email || !service) {
    return { ok: false, error: "Name, email and service are required." };
  }
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email address." };

  const result = await guarded("manage:records", () =>
    m.createLead({
      name,
      email,
      service,
      company: String(formData.get("company") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      budget: String(formData.get("budget") ?? "").trim() || null,
    }),
  );
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export async function setTaskCompletedAction(
  taskId: string,
  completed: boolean,
): Promise<ActionResult> {
  const result = await guarded("manage:records", () => m.setTaskCompleted(taskId, completed));
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/tasks");
  }
  return result;
}

export async function createTaskAction(formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const assigneeId = String(formData.get("assigneeId") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Medium");

  if (!title || !assigneeId || !dueDate) {
    return { ok: false, error: "Title, assignee and due date are required." };
  }
  if (!(PRIORITIES as string[]).includes(priority)) {
    return { ok: false, error: "Unknown priority." };
  }

  const result = await guarded("manage:records", () =>
    m.createTask({
      title,
      assigneeId,
      dueDate,
      priority: priority as Priority,
      projectId: String(formData.get("projectId") ?? "").trim() || null,
    }),
  );
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/tasks");
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */

export async function createClientAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !contactName || !email) {
    return { ok: false, error: "Business name, contact name and email are required." };
  }

  const result = await guarded("manage:records", () =>
    m.createClient({
      name,
      contactName,
      email,
      phone: String(formData.get("phone") ?? "").trim() || null,
      industry: String(formData.get("industry") ?? "").trim() || null,
    }),
  );
  if (result.ok) revalidatePath("/admin/clients");
  return result;
}

/* -------------------------------------------------------------------------- */
/* Support & revisions                                                         */
/* -------------------------------------------------------------------------- */

export async function setSupportStatusAction(
  ticketId: string,
  status: string,
): Promise<ActionResult> {
  if (!["Open", "In Progress", "Resolved"].includes(status)) {
    return { ok: false, error: "Unknown status." };
  }
  const result = await guarded("manage:support", () =>
    m.setSupportStatus(ticketId, status as "Open" | "In Progress" | "Resolved"),
  );
  if (result.ok) revalidatePath("/admin/support");
  return result;
}

export async function setRevisionStatusAction(
  revisionId: string,
  status: string,
): Promise<ActionResult> {
  if (!["Requested", "In Review", "Completed"].includes(status)) {
    return { ok: false, error: "Unknown status." };
  }
  const result = await guarded("manage:records", () =>
    m.setRevisionStatus(revisionId, status as "Requested" | "In Review" | "Completed"),
  );
  if (result.ok) revalidatePath("/admin");
  return result;
}
