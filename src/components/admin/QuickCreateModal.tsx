"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "@/components/admin/controls";
import { Icon } from "@/components/ui/Icon";

interface QuickCreateAction {
  label: string;
  description: string;
  icon: string;
  /** Where the creation flow lives. */
  href: string;
}

/**
 * Every action navigates to the section that owns the record. Creation forms
 * are not wired to a backend yet, so each destination states plainly what will
 * happen once persistence is configured — rather than opening a form that
 * silently discards what you type.
 */
const ACTIONS: QuickCreateAction[] = [
  { label: "Add Lead", description: "Record an enquiry that arrived outside the website forms.", icon: "Target", href: "/admin/leads?create=lead" },
  { label: "Add Client", description: "Convert a lead or add an existing client.", icon: "Users", href: "/admin/clients?create=client" },
  { label: "Create Project", description: "Start a project against an existing client.", icon: "Layers", href: "/admin/projects?create=project" },
  { label: "Send Proposal", description: "Draft a proposal for review before sending.", icon: "FileText", href: "/admin/proposals?create=proposal" },
  { label: "Create Invoice", description: "Raise an invoice against a project.", icon: "Receipt", href: "/admin/invoices?create=invoice" },
  { label: "Publish Article", description: "Add a resource article to the public site.", icon: "PenSquare", href: "/admin/content?create=article" },
];

export function QuickCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Quick create"
      description="Jump straight to the section that owns the record you want to add."
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <li key={action.label}>
            <button
              type="button"
              onClick={() => go(action.href)}
              className="flex h-full w-full items-start gap-3 rounded-lg border border-line p-3 text-left transition-colors hover:border-cobalt-border hover:bg-cobalt-soft"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cobalt-soft text-cobalt"
              >
                <Icon name={action.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{action.label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate">
                  {action.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
