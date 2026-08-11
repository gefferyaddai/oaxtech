"use client";

import { useActionState, useEffect, useRef } from "react";
import { Dialog } from "@/components/admin/controls";
import { Icon } from "@/components/ui/Icon";
import { PRIORITIES } from "@/lib/domain/types";
import { createSupportTicketAction, requestRevisionAction } from "@/lib/portal/write-actions";
import { useState } from "react";

/**
 * The two things a client can create from the portal: a revision request
 * against a project, and a support ticket.
 *
 * Both submit through a Server Action that takes the client id from the
 * session, never from this form — so there is no field here an attacker could
 * tamper with to file against someone else's project.
 */

interface FormState {
  ok?: boolean;
  error?: string;
}

function useDialogAction(
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>,
  onDone: () => void,
) {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormState | null, formData: FormData): Promise<FormState> => action(formData),
    null,
  );

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return { state, formAction, pending };
}

/* -------------------------------------------------------------------------- */
/* Revision request                                                            */
/* -------------------------------------------------------------------------- */

export function RequestRevisionButton({
  projectId,
  canPersist,
}: {
  projectId: string | null;
  canPersist: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = useRef(() => setOpen(false)).current;
  const { state, formAction, pending } = useDialogAction(requestRevisionAction, close);

  const disabled = !canPersist || !projectId;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={
          !canPersist
            ? "Available once the portal is connected"
            : !projectId
              ? "No active project to request changes on"
              : undefined
        }
        className="btn btn-sm btn-primary disabled:cursor-not-allowed disabled:opacity-55"
      >
        New Revision Request
      </button>

      <Dialog
        open={open}
        onClose={close}
        title="Request a revision"
        description="Tell us what you'd like changed and how urgent it is."
      >
        <form action={formAction} id="revision-form" className="space-y-4">
          <input type="hidden" name="projectId" value={projectId ?? ""} />

          <label className="block">
            <span className="field-label">What would you like changed?</span>
            <input
              name="title"
              required
              maxLength={200}
              placeholder="e.g. Update the hero headline"
              className="field-control"
            />
          </label>

          <label className="block">
            <span className="field-label">Priority</span>
            <select name="priority" defaultValue="Medium" className="field-control">
              {PRIORITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {state?.error && (
            <p role="alert" className="flex items-start gap-1.5 text-xs text-danger">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-sm btn-primary w-full">
            {pending ? "Sending…" : "Send request"}
          </button>
        </form>
      </Dialog>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Support ticket                                                              */
/* -------------------------------------------------------------------------- */

export function CreateSupportButton({ canPersist }: { canPersist: boolean }) {
  const [open, setOpen] = useState(false);
  const close = useRef(() => setOpen(false)).current;
  const { state, formAction, pending } = useDialogAction(createSupportTicketAction, close);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!canPersist}
        title={canPersist ? undefined : "Available once the portal is connected"}
        className="btn btn-sm btn-primary disabled:cursor-not-allowed disabled:opacity-55"
      >
        Create Support Request
      </button>

      <Dialog
        open={open}
        onClose={close}
        title="Create a support request"
        description="Describe the issue and we'll pick it up."
      >
        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="field-label">What do you need help with?</span>
            <input
              name="subject"
              required
              maxLength={200}
              placeholder="e.g. Contact form isn't sending"
              className="field-control"
            />
          </label>

          <label className="block">
            <span className="field-label">Priority</span>
            <select name="priority" defaultValue="Medium" className="field-control">
              {PRIORITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {state?.error && (
            <p role="alert" className="flex items-start gap-1.5 text-xs text-danger">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-sm btn-primary w-full">
            {pending ? "Sending…" : "Create request"}
          </button>
        </form>
      </Dialog>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Message composer                                                            */
/* -------------------------------------------------------------------------- */

export function MessageComposer({
  threadId,
  canPersist,
}: {
  threadId: string | null;
  canPersist: boolean;
}) {
  const noop = useRef(() => {}).current;
  const { state, formAction, pending } = useDialogAction(
    async (formData) => {
      const { sendMessageAction } = await import("@/lib/portal/write-actions");
      return sendMessageAction(formData);
    },
    noop,
  );
  const disabled = !canPersist || !threadId;

  return (
    <form action={formAction} className="border-t border-line-subtle p-3">
      <input type="hidden" name="threadId" value={threadId ?? ""} />
      <div className="flex items-center gap-2">
        <label htmlFor="portal-message" className="sr-only">
          Write a message
        </label>
        <input
          id="portal-message"
          name="body"
          maxLength={4000}
          required
          className="field-control min-h-[2.25rem] flex-1 py-1.5 text-sm"
          placeholder={
            disabled ? "Messaging is disabled until the portal is connected" : "Write a message…"
          }
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || pending} className="btn btn-sm btn-primary">
          <Icon name="Send" className="h-4 w-4" />
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
      {state?.error && (
        <p role="alert" className="mt-2 text-2xs text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
