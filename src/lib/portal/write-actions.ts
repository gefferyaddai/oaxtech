"use server";

import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/admin/authorize";
import * as m from "@/lib/domain/mutations";
import { PRIORITIES, type Priority } from "@/lib/domain/types";

/**
 * Portal write actions.
 *
 * The client id ALWAYS comes from the session, never from the form. Every
 * mutation below also re-checks ownership in its WHERE clause, so knowing a
 * record's id is not enough to act on it.
 *
 * That is deliberate belt-and-braces: the session check could be correct and a
 * future refactor could still pass the wrong id, so the database is the last
 * line rather than the only one.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function session() {
  try {
    return { session: await requireClient(), error: null as string | null };
  } catch (error) {
    return { session: null, error: (error as Error).message };
  }
}

/* -------------------------------------------------------------------------- */
/* Approvals                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A client's decision on a deliverable. This is the write that shows up on the
 * admin's Approvals screen — the same record, both surfaces.
 */
export async function decideApprovalAction(
  approvalId: string,
  decision: "Approved" | "Changes Requested",
): Promise<ActionResult> {
  const { session: s, error } = await session();
  if (!s) return { ok: false, error: error ?? "Not signed in." };

  if (decision !== "Approved" && decision !== "Changes Requested") {
    return { ok: false, error: "Unknown decision." };
  }

  const result = await m.decideApproval(approvalId, s.clientId, decision, s.label);
  if (result.ok) {
    revalidatePath("/portal");
    revalidatePath("/portal/approvals");
    revalidatePath("/admin");
    revalidatePath("/admin/approvals");
  }
  return result.ok ? { ok: true } : { ok: false, error: result.detail };
}

/* -------------------------------------------------------------------------- */
/* Revisions                                                                   */
/* -------------------------------------------------------------------------- */

export async function requestRevisionAction(formData: FormData): Promise<ActionResult> {
  const { session: s, error } = await session();
  if (!s) return { ok: false, error: error ?? "Not signed in." };

  const title = String(formData.get("title") ?? "").trim();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Medium");

  if (!title) return { ok: false, error: "Describe the change you'd like." };
  if (title.length > 200) return { ok: false, error: "Keep it to 200 characters or fewer." };
  if (!projectId) return { ok: false, error: "No project selected." };
  if (!(PRIORITIES as string[]).includes(priority)) {
    return { ok: false, error: "Unknown priority." };
  }

  const result = await m.createRevision({
    projectId,
    clientId: s.clientId,
    title,
    priority: priority as Priority,
    actor: s.label,
  });

  if (result.ok) {
    revalidatePath("/portal");
    revalidatePath("/portal/revisions");
    revalidatePath("/admin");
  }
  return result.ok ? { ok: true } : { ok: false, error: result.detail };
}

/* -------------------------------------------------------------------------- */
/* Support                                                                     */
/* -------------------------------------------------------------------------- */

export async function createSupportTicketAction(formData: FormData): Promise<ActionResult> {
  const { session: s, error } = await session();
  if (!s) return { ok: false, error: error ?? "Not signed in." };

  const subject = String(formData.get("subject") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Medium");

  if (!subject) return { ok: false, error: "Describe what you need help with." };
  if (subject.length > 200) return { ok: false, error: "Keep it to 200 characters or fewer." };
  if (!(PRIORITIES as string[]).includes(priority)) {
    return { ok: false, error: "Unknown priority." };
  }

  const result = await m.createSupportTicket({
    clientId: s.clientId,
    subject,
    priority: priority as Priority,
    actor: s.label,
  });

  if (result.ok) {
    revalidatePath("/portal");
    revalidatePath("/portal/support");
    revalidatePath("/admin/support");
  }
  return result.ok ? { ok: true } : { ok: false, error: result.detail };
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                    */
/* -------------------------------------------------------------------------- */

export async function sendMessageAction(formData: FormData): Promise<ActionResult> {
  const { session: s, error } = await session();
  if (!s) return { ok: false, error: error ?? "Not signed in." };

  const threadId = String(formData.get("threadId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!body) return { ok: false, error: "Write a message first." };
  if (body.length > 4000) return { ok: false, error: "Message must be 4000 characters or fewer." };
  if (!threadId) return { ok: false, error: "No conversation selected." };

  const result = await m.postMessage({
    threadId,
    clientId: s.clientId,
    from: "client",
    body,
  });

  if (result.ok) {
    revalidatePath("/portal");
    revalidatePath("/portal/messages");
    revalidatePath("/admin/messages");
  }
  return result.ok ? { ok: true } : { ok: false, error: result.detail };
}
