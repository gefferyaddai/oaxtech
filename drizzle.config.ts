import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit reads this for `generate` and `migrate`.
 *
 * DATABASE_URL is read from the environment rather than committed. Generating
 * migrations does not need a live connection; applying them does.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  // Fail loudly on a destructive change rather than silently dropping data.
  strict: true,
  verbose: true,
} satisfies Config;
