/**
 * ============================================================================
 * SUBMISSION STORE
 * ============================================================================
 *
 * Where captured submissions are written, and read back by the admin.
 *
 * Three adapters, chosen automatically:
 *
 *   databaseStore  DATABASE_URL is set. The real one. Not implemented yet —
 *                  fails loudly rather than silently dropping a submission.
 *   devFileStore   Development, no database. Appends to a gitignored JSON file
 *                  so the full pipeline (form → store → admin) is demonstrable
 *                  and testable before any infrastructure exists.
 *   nullStore      Production with no database. Refuses to accept anything and
 *                  says so, so the form's honest "not configured" reply stays
 *                  accurate instead of implying the enquiry was saved.
 *
 * ⚠️  devFileStore is DEVELOPMENT ONLY. It writes to the local filesystem,
 * which is ephemeral or read-only on most hosts, has no concurrency control,
 * and is not a database. It must never be the store in production — the
 * NODE_ENV guard in `getStore()` enforces that.
 *
 * SERVER-ONLY.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { integrationStatus } from "@/lib/integrations";
import type { Consultation, Lead, Subscriber } from "@/lib/domain/types";

export interface StoredSubmissions {
  leads: Lead[];
  consultations: Consultation[];
  subscribers: Subscriber[];
}

const EMPTY: StoredSubmissions = { leads: [], consultations: [], subscribers: [] };

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "failed"; detail: string };

export interface SubmissionStore {
  /** Human-readable name, surfaced in the admin's system status. */
  readonly name: string;
  /** True when writes are actually retained somewhere durable. */
  readonly persists: boolean;
  read(): Promise<StoredSubmissions>;
  addLead(lead: Lead): Promise<WriteResult>;
  addConsultation(consultation: Consultation, lead: Lead): Promise<WriteResult>;
  addSubscriber(subscriber: Subscriber): Promise<WriteResult>;
}

/* -------------------------------------------------------------------------- */
/* Development file store                                                      */
/* -------------------------------------------------------------------------- */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function readFileStore(): Promise<StoredSubmissions> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredSubmissions>;
    return {
      leads: parsed.leads ?? [],
      consultations: parsed.consultations ?? [],
      subscribers: parsed.subscribers ?? [],
    };
  } catch {
    // Missing or unreadable file simply means nothing has been captured yet.
    return { ...EMPTY };
  }
}

async function writeFileStore(data: StoredSubmissions): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Serialises writes within this process. Two forms submitted at the same moment
 * would otherwise read-modify-write the same file and lose one of them. This is
 * a single-process mitigation, not real concurrency control — another reason
 * this adapter is development-only.
 */
let writeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.catch(() => undefined);
  return result;
}

const devFileStore: SubmissionStore = {
  name: "Development file store (.data/submissions.json)",
  persists: true,

  read: readFileStore,

  async addLead(lead) {
    return enqueue(async () => {
      try {
        const data = await readFileStore();
        data.leads.unshift(lead);
        await writeFileStore(data);
        return { ok: true as const };
      } catch (error) {
        return { ok: false as const, reason: "failed" as const, detail: (error as Error).message };
      }
    });
  },

  async addConsultation(consultation, lead) {
    return enqueue(async () => {
      try {
        const data = await readFileStore();
        data.leads.unshift(lead);
        data.consultations.unshift(consultation);
        await writeFileStore(data);
        return { ok: true as const };
      } catch (error) {
        return { ok: false as const, reason: "failed" as const, detail: (error as Error).message };
      }
    });
  },

  async addSubscriber(subscriber) {
    return enqueue(async () => {
      try {
        const data = await readFileStore();
        // Idempotent: re-subscribing must not create a duplicate row.
        if (data.subscribers.some((s) => s.email === subscriber.email)) {
          return { ok: true as const };
        }
        data.subscribers.unshift(subscriber);
        await writeFileStore(data);
        return { ok: true as const };
      } catch (error) {
        return { ok: false as const, reason: "failed" as const, detail: (error as Error).message };
      }
    });
  },
};

/* -------------------------------------------------------------------------- */
/* Database store                                                              */
/* -------------------------------------------------------------------------- */

const NOT_IMPLEMENTED: WriteResult = {
  ok: false,
  reason: "not_configured",
  detail:
    "DATABASE_URL is set but the database store has not been implemented yet. See src/lib/domain/store.ts.",
};

/**
 * Fails loudly rather than falling back to the file store, so a half-configured
 * database can never look like it is working.
 */
const databaseStore: SubmissionStore = {
  name: "Database",
  persists: true,
  async read() {
    // return { leads: await db.select()…, … }
    return { ...EMPTY };
  },
  async addLead() {
    return NOT_IMPLEMENTED;
  },
  async addConsultation() {
    return NOT_IMPLEMENTED;
  },
  async addSubscriber() {
    return NOT_IMPLEMENTED;
  },
};

/* -------------------------------------------------------------------------- */
/* Null store                                                                  */
/* -------------------------------------------------------------------------- */

const NO_STORE: WriteResult = {
  ok: false,
  reason: "not_configured",
  detail:
    "No database is configured, so this submission was not saved. Set DATABASE_URL to capture enquiries.",
};

const nullStore: SubmissionStore = {
  name: "None",
  persists: false,
  async read() {
    return { ...EMPTY };
  },
  async addLead() {
    return NO_STORE;
  },
  async addConsultation() {
    return NO_STORE;
  },
  async addSubscriber() {
    return NO_STORE;
  },
};

/* -------------------------------------------------------------------------- */
/* Selection                                                                   */
/* -------------------------------------------------------------------------- */

export function getStore(): SubmissionStore {
  if (integrationStatus.database()) return databaseStore;
  // The file store is a development convenience and never runs in production.
  if (process.env.NODE_ENV !== "production") return devFileStore;
  return nullStore;
}

/** Whether captured submissions are being retained anywhere. */
export function submissionsArePersisted(): boolean {
  return getStore().persists;
}
