"use client";

import { ErrorState, SuccessState } from "@/components/ui/States";
import type { SubmissionOutcome } from "@/lib/integrations";

/**
 * Shared client-side submit helper.
 *
 * Returns the server's `SubmissionOutcome` untouched, so a form never invents a
 * success state. A network failure becomes an explicit error rather than a
 * silent no-op.
 */
export async function submitForm(
  endpoint: string,
  payload: unknown,
): Promise<SubmissionOutcome> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as SubmissionOutcome;
    return data;
  } catch {
    return {
      status: "error",
      detail:
        "We couldn't reach the server. Check your connection and try again — your answers are still here.",
    };
  }
}

interface FormOutcomeProps {
  outcome: SubmissionOutcome | null;
  /** What the visitor should do next when nothing is configured yet. */
  fallbackAction?: React.ReactNode;
  successTitle: string;
  successBody?: React.ReactNode;
  successAction?: React.ReactNode;
  /** Heading for the `received` outcome. Defaults to a generic acknowledgement. */
  receivedTitle?: string;
}

/**
 * Renders the four possible outcomes honestly.
 *
 * `not_configured` is deliberately NOT shown as a success. It tells the visitor
 * their details were validated but not delivered, and points them at a route
 * that does work.
 */
export function FormOutcome({
  outcome,
  fallbackAction,
  successTitle,
  successBody,
  successAction,
  receivedTitle,
}: FormOutcomeProps) {
  if (!outcome) return null;

  if (outcome.status === "delivered") {
    return <SuccessState title={successTitle} description={successBody} action={successAction} />;
  }

  /*
   * Received, but not completed. Shown as a success — the enquiry did reach us
   * — while stating exactly what did not happen, so the visitor is never left
   * assuming a slot was reserved or a subscription confirmed.
   */
  if (outcome.status === "received") {
    return (
      <SuccessState
        title={receivedTitle ?? "Received — thank you"}
        description={outcome.detail}
        action={successAction}
      />
    );
  }

  if (outcome.status === "not_configured") {
    return (
      <ErrorState
        variant="config"
        title="Message not sent — delivery isn't connected yet"
        description={outcome.detail}
        action={fallbackAction}
      />
    );
  }

  if (outcome.status === "invalid") {
    const messages = Object.values(outcome.fieldErrors).flat();
    return (
      <ErrorState
        title="Check the highlighted fields"
        description={
          messages.length > 0
            ? messages.join(" ")
            : "Some fields need attention before this can be submitted."
        }
      />
    );
  }

  return <ErrorState title="Something went wrong" description={outcome.detail} action={fallbackAction} />;
}
