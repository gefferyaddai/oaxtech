"use server";

import { redirect } from "next/navigation";
import { getAdminAuthAdapter } from "@/lib/admin/auth";
import { ADMIN_ROLES, type AdminRole } from "@/lib/domain/types";

function parseRole(value: FormDataEntryValue | null): AdminRole {
  const raw = typeof value === "string" ? value : "";
  return (ADMIN_ROLES as string[]).includes(raw) ? (raw as AdminRole) : "Super Admin";
}

/**
 * Opens a demo admin session. The role is chosen on the sign-in screen so the
 * permission matrix can actually be exercised during development.
 */
export async function enterAdminAction(formData?: FormData): Promise<{ error?: string }> {
  const role = parseRole(formData?.get("role") ?? null);
  const result = await getAdminAuthAdapter().signIn(role);
  if (!result.ok) return { error: result.message };
  redirect("/admin");
}

export async function signOutAdminAction(): Promise<void> {
  await getAdminAuthAdapter().signOut();
  redirect("/admin/login");
}
