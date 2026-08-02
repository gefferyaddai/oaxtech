/**
 * Database connection.
 *
 * SERVER-ONLY. This module holds credentials and must never be imported from a
 * file carrying "use client".
 *
 * The client is created lazily and cached on `globalThis`. Next's dev server
 * re-evaluates modules on every hot reload, so a module-level connection would
 * open a new pool on each edit until Postgres refused further connections.
 */

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __oaxSql?: ReturnType<typeof postgres>;
  __oaxDb?: Database;
};

/**
 * Returns the database, or null when DATABASE_URL is unset.
 *
 * Null rather than throwing: the site is designed to build and run with no
 * environment variables at all, falling back to fixtures. Callers check
 * `isLive()` before reaching for this.
 */
export function getDb(): Database | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!globalForDb.__oaxDb) {
    const sql = postgres(url, {
      // Serverless platforms cap connections per instance; keep the pool small.
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      // Postgres.js infers types from the first row otherwise; be explicit that
      // dates come back as strings so they match the domain's IsoDate.
      types: {
        date: {
          to: 1184,
          from: [1082, 1114, 1184],
          serialize: (value: unknown) => String(value),
          parse: (value: string) => value,
        },
      },
    });
    globalForDb.__oaxSql = sql;
    globalForDb.__oaxDb = drizzle(sql, { schema });
  }

  return globalForDb.__oaxDb;
}

/**
 * Closes the pool. Used by scripts (seeding, migrations) so the process can
 * exit; the app itself keeps the connection for the lifetime of the instance.
 */
export async function closeDb(): Promise<void> {
  await globalForDb.__oaxSql?.end({ timeout: 5 });
  globalForDb.__oaxSql = undefined;
  globalForDb.__oaxDb = undefined;
}
