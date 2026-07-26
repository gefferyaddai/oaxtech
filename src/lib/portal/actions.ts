"use server";

import { redirect } from "next/navigation";
import { getAuthAdapter } from "@/lib/portal/auth";

export async function enterPortalAction(): Promise<{ error?: string }> {
  const result = await getAuthAdapter().signIn();
  if (!result.ok) return { error: result.message };
  redirect("/portal");
}

export async function signOutAction(): Promise<void> {
  await getAuthAdapter().signOut();
  redirect("/portal/login");
}
