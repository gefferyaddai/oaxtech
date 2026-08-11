"use client";

import { useState, useTransition } from "react";
import { ConfirmationDialog } from "@/components/admin/controls";
import { Icon } from "@/components/ui/Icon";
import { decideApprovalAction } from "@/lib/portal/write-actions";

/**
 * Approve / request changes on a deliverable.
 *
 * Both decisions are confirmed first. Approving a design is a sign-off the team
 * will act on — it is exactly the kind of action that should not happen from a
 * mis-click, and "request changes" resets work that may already be underway.
 */
export function ApprovalActions({
  approvalId,
  title,
  canPersist,
}: {
  approvalId: string;
  title: string;
  canPersist: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [confirming, setConfirming] = useState<"Approved" | "Changes Requested" | null>(null);

  if (!canPersist) {
    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            className="btn btn-sm btn-primary"
            title="Available once the portal is connected"
          >
            Approve Design
          </button>
          <button
            type="button"
            disabled
            className="btn btn-sm btn-neutral"
            title="Available once the portal is connected"
          >
            Request Changes
          </button>
        </div>
        <p className="mt-2 text-2xs text-slate">
          Approval actions are disabled — no database is configured, so a decision here would not
          be recorded anywhere.
        </p>
      </div>
    );
  }

  function decide(decision: "Approved" | "Changes Requested") {
    setConfirming(null);
    setError(undefined);
    startTransition(async () => {
      const result = await decideApprovalAction(approvalId, decision);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setConfirming("Approved")}
          disabled={pending}
          className="btn btn-sm btn-primary"
        >
          {pending ? <Icon name="Loader2" className="h-4 w-4 animate-spin" /> : null}
          Approve Design
        </button>
        <button
          type="button"
          onClick={() => setConfirming("Changes Requested")}
          disabled={pending}
          className="btn btn-sm btn-neutral"
        >
          Request Changes
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-2xs text-danger">
          <Icon name="AlertCircle" className="mt-0.5 h-3 w-3 shrink-0" />
          {error}
        </p>
      )}

      <ConfirmationDialog
        open={confirming !== null}
        onCancel={() => setConfirming(null)}
        onConfirm={() => confirming && decide(confirming)}
        title={confirming === "Approved" ? `Approve “${title}”?` : `Request changes to “${title}”?`}
        description={
          confirming === "Approved"
            ? "The team will treat this as signed off and move on to the next stage."
            : "The team will pause and revisit this deliverable."
        }
        confirmLabel={confirming === "Approved" ? "Approve" : "Request changes"}
      />
    </div>
  );
}
