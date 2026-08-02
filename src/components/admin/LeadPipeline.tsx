"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/admin/format";
import { LEAD_STAGES, type Lead, type LeadStage, type TeamMemberRecord } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

interface LeadPipelineProps {
  leads: Lead[];
  team: TeamMemberRecord[];
}

const FOLLOW_UP_TONE = {
  Overdue: "danger",
  "Due today": "warning",
  Scheduled: "info",
  None: "neutral",
} as const;

/**
 * Kanban pipeline with accessible stage changes.
 *
 * Deliberately NOT drag-and-drop-only: every card carries a stage <select>, so
 * the board is fully operable by keyboard and on touch. Drag-and-drop can be
 * layered on later as an enhancement, but it must never be the sole means of
 * moving a lead.
 *
 * Stage changes are local state. With no database configured there is nothing
 * to persist to, and the UI says so rather than implying the change was saved.
 */
export function LeadPipeline({ leads, team }: LeadPipelineProps) {
  const [stages, setStages] = useState<Record<string, LeadStage>>(() =>
    Object.fromEntries(leads.map((lead) => [lead.id, lead.stage])),
  );
  const [announcement, setAnnouncement] = useState("");

  const memberById = new Map(team.map((member) => [member.id, member]));

  function move(lead: Lead, stage: LeadStage) {
    setStages((current) => ({ ...current, [lead.id]: stage }));
    setAnnouncement(`${lead.name} moved to ${stage}.`);
  }

  const byStage = LEAD_STAGES.map((stage) => ({
    stage,
    leads: leads.filter((lead) => (stages[lead.id] ?? lead.stage) === stage),
  }));

  return (
    <div>
      {/* Stage changes are announced for screen-reader users, who would
          otherwise get no feedback that the card moved. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/*
        The board scrolls inside its own container. Without this the five
        columns would push the entire page into horizontal overflow.
      */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5 [scrollbar-width:thin]">
        <ul className="flex min-w-max gap-3">
          {byStage.map(({ stage, leads: stageLeads }) => (
            <li key={stage} className="w-64 shrink-0">
              <div className="flex items-center justify-between gap-2 rounded-t-lg border border-line bg-mist px-3 py-2">
                <h3 className="truncate text-xs font-semibold text-ink">{stage}</h3>
                <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-2xs font-medium tabular-nums text-slate">
                  {stageLeads.length}
                </span>
              </div>

              <ul className="min-h-[6rem] space-y-2 rounded-b-lg border border-t-0 border-line bg-mist/40 p-2">
                {stageLeads.length === 0 && (
                  <li className="px-2 py-6 text-center text-2xs text-muted">No leads</li>
                )}
                {stageLeads.map((lead) => {
                  const assignee = lead.assigneeId ? memberById.get(lead.assigneeId) : null;
                  return (
                    <li key={lead.id} className="rounded-lg border border-line bg-paper p-2.5">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="block truncate text-sm font-medium text-ink hover:text-cobalt"
                      >
                        {lead.company ?? lead.name}
                      </Link>
                      <p className="mt-0.5 truncate text-2xs text-slate">{lead.service}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {lead.budget && (
                          <span className="rounded border border-line bg-mist px-1.5 py-0.5 text-2xs text-charcoal">
                            {lead.budget}
                          </span>
                        )}
                        <StatusBadge tone={FOLLOW_UP_TONE[lead.followUp]}>
                          {lead.followUp}
                        </StatusBadge>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        {assignee ? (
                          <Avatar
                            initials={assignee.initials}
                            name={assignee.name}
                            className="h-6 w-6"
                          />
                        ) : (
                          <span className="text-2xs text-muted">Unassigned</span>
                        )}
                        <span className="shrink-0 text-2xs text-muted">
                          {formatDate(lead.submittedAt)}
                        </span>
                      </div>

                      <label className="mt-2 block">
                        <span className="sr-only">Move {lead.name} to stage</span>
                        <select
                          value={stages[lead.id] ?? lead.stage}
                          onChange={(event) => move(lead, event.target.value as LeadStage)}
                          className="field-control min-h-[2rem] w-full py-1 text-2xs"
                        >
                          {LEAD_STAGES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {leads.length === 0 && (
        <EmptyState
          icon="Target"
          title="No leads yet"
          description="Quote requests, contact messages and consultation bookings from the website appear here."
        />
      )}

      <p className="mt-3 flex items-start gap-1.5 text-2xs text-slate">
        <Icon name="Info" className="mt-0.5 h-3 w-3 shrink-0" />
        Stage changes are not saved — no database is configured. Set{" "}
        <code className="rounded bg-mist px-1">DATABASE_URL</code> to enable persistence.
      </p>
    </div>
  );
}

/** Shown while the pipeline data is loading. */
export function LeadPipelineSkeleton() {
  return (
    <div className="-mx-4 overflow-hidden px-4 sm:-mx-5 sm:px-5">
      <div className="flex gap-3">
        {LEAD_STAGES.map((stage) => (
          <div key={stage} className="w-64 shrink-0">
            <div className="h-9 rounded-t-lg border border-line bg-mist" />
            <div className="space-y-2 rounded-b-lg border border-t-0 border-line p-2">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className={cn("h-24 rounded-lg border border-line bg-mist", "animate-pulse")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
