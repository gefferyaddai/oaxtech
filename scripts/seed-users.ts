/**
 * Creates sign-in accounts for local development.
 *
 *   DATABASE_URL=... npx tsx scripts/seed-users.ts
 *
 * DEVELOPMENT ONLY. Refuses to run against production.
 *
 * Passwords are read from the environment, never hardcoded — a password
 * committed to a repository is a password that has to be rotated everywhere it
 * was ever copied to. Set them, or the script generates random ones and prints
 * them once:
 *
 *   SEED_ADMIN_PASSWORD=...  SEED_CLIENT_PASSWORD=...
 */

import { randomBytes, randomUUID } from "node:crypto";
import { demoClients, demoTeam } from "@/data/demo-data";
import { hashPassword, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";
import { closeDb, getDb } from "@/lib/db/client";
import * as t from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function generatePassword(): string {
  // 24 URL-safe characters — comfortably above the minimum.
  return randomBytes(18).toString("base64url");
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to create development accounts in production.");
  }

  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || generatePassword();
  const clientPassword = process.env.SEED_CLIENT_PASSWORD || generatePassword();

  for (const [label, value] of [
    ["SEED_ADMIN_PASSWORD", adminPassword],
    ["SEED_CLIENT_PASSWORD", clientPassword],
  ] as const) {
    if (value.length < PASSWORD_MIN_LENGTH) {
      throw new Error(`${label} must be at least ${PASSWORD_MIN_LENGTH} characters.`);
    }
  }

  /* --- Staff account ----------------------------------------------------- */

  const staff = demoTeam[0];
  if (!staff) throw new Error("No demo team member to attach a staff account to.");

  const adminEmail = "admin@oaxtech.local";
  const adminId = `usr_${randomUUID()}`;

  await db.delete(t.users).where(eq(t.users.email, adminEmail));
  await db.insert(t.users).values({
    id: adminId,
    name: staff.name,
    email: adminEmail,
    emailVerified: new Date(),
    passwordHash: await hashPassword(adminPassword),
    adminRole: staff.role,
  });
  // Link the login to the person, so "assigned to me" can work later.
  await db.update(t.teamMembers).set({ userId: adminId }).where(eq(t.teamMembers.id, staff.id));

  /* --- Client contact ---------------------------------------------------- */

  const client = demoClients[0];
  if (!client) throw new Error("No demo client to attach a portal account to.");

  const clientEmail = "client@oaxtech.local";
  const clientId = `usr_${randomUUID()}`;

  await db.delete(t.users).where(eq(t.users.email, clientEmail));
  await db.insert(t.users).values({
    id: clientId,
    name: client.contactName,
    email: clientEmail,
    emailVerified: new Date(),
    passwordHash: await hashPassword(clientPassword),
    // No adminRole: this account is a client contact, not staff.
    adminRole: null,
  });
  await db
    .insert(t.clientUsers)
    .values({ userId: clientId, clientId: client.id })
    .onConflictDoNothing();

  /* --- A second client, to test that scoping actually holds -------------- */

  const other = demoClients[1];
  let otherEmail: string | null = null;
  if (other) {
    otherEmail = "client2@oaxtech.local";
    const otherId = `usr_${randomUUID()}`;
    await db.delete(t.users).where(eq(t.users.email, otherEmail));
    await db.insert(t.users).values({
      id: otherId,
      name: other.contactName,
      email: otherEmail,
      emailVerified: new Date(),
      passwordHash: await hashPassword(clientPassword),
      adminRole: null,
    });
    await db
      .insert(t.clientUsers)
      .values({ userId: otherId, clientId: other.id })
      .onConflictDoNothing();
  }

  console.log("\nDevelopment accounts created:\n");
  console.log(`  STAFF   ${adminEmail}`);
  console.log(`          role: ${staff.role}`);
  console.log(`          password: ${adminPassword}`);
  console.log(`\n  CLIENT  ${clientEmail}  →  ${client.name}`);
  console.log(`          password: ${clientPassword}`);
  if (otherEmail && other) {
    console.log(`\n  CLIENT  ${otherEmail}  →  ${other.name}`);
    console.log(`          password: ${clientPassword}`);
  }
  console.log("\nThese are local development credentials. Never reuse them anywhere real.\n");
}

main()
  .catch((error) => {
    console.error("Failed:", error);
    process.exitCode = 1;
  })
  .finally(closeDb);
