import Link from "next/link";
import { Avatar, ProgressBar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatDate, formatRelative, formatTime } from "@/lib/admin/format";
import type { SystemService } from "@/lib/admin/repository";
import type {
  ActivityEvent,
  ActivityKind,
  Consultation,
  ConsultationStatus,
  TeamMemberRecord,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Upcoming consultations                                                      */
/* -------------------------------------------------------------------------- */

const CONSULTATION_TONE: Record<ConsultationStatus, BadgeTone> = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Completed: "neutral",
};

export function UpcomingConsultations({ consultations }: { consultations: Consultation[] }) {
  if (consultations.length === 0) {
    return (
      <EmptyState
        icon="Calendar"
        title="No upcoming consultations"
        description="Bookings made through the website's consultation form appear here."
      />
    );
  }

  return (
    <ul className="divide-y divide-line-subtle">
      {consultations.map((consultation) => (
        <li key={consultation.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex w-14 shrink-0 flex-col items-center rounded-lg border border-line bg-mist py-1.5">
            <span className="text-2xs uppercase tracking-wide text-slate">
              {formatDate(consultation.date).split(" ")[0]}
            </span>
            <span className="font-display text-base font-semibold leading-none text-ink">
              {formatDate(consultation.date).split(" ")[1]}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {consultation.company ?? consultation.contactName}
            </p>
            <p className="truncate text-xs text-slate">{consultation.service}</p>
            <p className="mt-0.5 text-2xs text-muted">
              {formatTime(consultation.time)} · {consultation.timeZone.split("/")[1]?.replace("_", " ")}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge tone={CONSULTATION_TONE[consultation.status]} showIcon>
              {consultation.status}
            </StatusBadge>
            <Link href="/admin/consultations" className="btn btn-sm btn-neutral">
              View
            </Link>
            {/*
              No calendar provider is configured, so `meetingUrl` is always null
              and there is nothing to join. Rendering a disabled button that
              says why is honest; linking nowhere is not.
            */}
            {consultation.meetingUrl ? (
              <a
                href={consultation.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                Join
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="No meeting link — connect a calendar provider (CALENDAR_API_KEY) to generate one"
                className="btn btn-sm btn-neutral disabled:cursor-not-allowed disabled:opacity-55"
              >
                Join
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent client activity                                                      */
/* -------------------------------------------------------------------------- */

const ACTIVITY_ICON: Record<ActivityKind, string> = {
  design_approved: "CheckCircle2",
  file_uploaded: "Upload",
  revision_requested: "PenSquare",
  invoice_paid: "Receipt",
  support_opened: "LifeBuoy",
  lead_created: "Target",
  consultation_booked: "Calendar",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon="Activity"
        title="No recent activity"
        description="Client actions across projects, approvals and invoices appear here."
      />
    );
  }

  return (
    <ol className="space-y-3.5">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mist text-cobalt"
          >
            <Icon name={ACTIVITY_ICON[event.kind]} className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug text-ink">
              {event.href ? (
                <Link href={event.href} className="hover:text-cobalt">
                  {event.summary}
                </Link>
              ) : (
                event.summary
              )}
            </p>
            <p className="mt-0.5 truncate text-2xs text-slate">{event.actor}</p>
          </div>
          <time className="shrink-0 text-2xs text-muted">{formatRelative(event.occurredAt)}</time>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Team workload                                                               */
/* -------------------------------------------------------------------------- */

export function TeamWorkload({ team }: { team: TeamMemberRecord[] }) {
  return (
    <ul className="space-y-3.5">
      {team.map((member) => {
        const tone =
          member.workloadPercent >= 85
            ? "danger"
            : member.workloadPercent >= 70
              ? "warning"
              : "cobalt";
        return (
          <li key={member.id}>
            <div className="flex items-center gap-2.5">
              <Avatar initials={member.initials} name={member.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{member.name}</p>
                <p className="truncate text-2xs text-slate">
                  {member.assignedTasks} assigned · {member.completedTasks} done ·{" "}
                  {member.activeProjects} projects
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium tabular-nums",
                  tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-slate",
                )}
              >
                {member.workloadPercent}%
              </span>
            </div>
            <ProgressBar
              value={member.workloadPercent}
              label={`${member.name} workload`}
              tone={tone}
              className="mt-1.5"
            />
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* System overview                                                             */
/* -------------------------------------------------------------------------- */

interface SystemOverviewProps {
  services: SystemService[];
  counts: { teamMembers: number; activeClients: number; activeProjects: number; openTasks: number };
}

/**
 * Reports what is genuinely configured. An unconfigured integration is shown as
 * "Not configured" with the variable that would enable it — never as healthy.
 */
export function SystemOverview({ services, counts }: SystemOverviewProps) {
  const stats = [
    { label: "Team members", value: counts.teamMembers },
    { label: "Active clients", value: counts.activeClients },
    { label: "Active projects", value: counts.activeProjects },
    { label: "Open tasks", value: counts.openTasks },
  ];

  return (
    <div>
      <dl className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line bg-mist px-3 py-2.5">
            <dt className="text-2xs text-slate">{stat.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-4 text-2xs font-semibold uppercase tracking-wide text-slate">
        System status
      </h3>
      <ul className="mt-2 space-y-1.5">
        {services.map((service) => (
          <li key={service.label} className="flex items-center gap-2 text-xs">
            <Icon
              name={service.configured ? "CheckCircle2" : "Minus"}
              className={cn("h-3.5 w-3.5 shrink-0", service.configured ? "text-success" : "text-muted")}
            />
            <span className="min-w-0 flex-1 truncate text-charcoal">{service.label}</span>
            <span
              className={cn(
                "shrink-0 font-medium",
                service.configured ? "text-success" : "text-muted",
              )}
              title={service.configured ? undefined : `Requires ${service.requires}`}
            >
              {service.configured ? "Configured" : "Not configured"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick actions                                                               */
/* -------------------------------------------------------------------------- */

const QUICK_ACTIONS = [
  { label: "Add Lead", icon: "Target", href: "/admin/leads?create=lead" },
  { label: "Add Client", icon: "UserPlus", href: "/admin/clients?create=client" },
  { label: "Create Project", icon: "Layers", href: "/admin/projects?create=project" },
  { label: "Send Proposal", icon: "FileText", href: "/admin/proposals?create=proposal" },
  { label: "Create Invoice", icon: "Receipt", href: "/admin/invoices?create=invoice" },
  { label: "Publish Article", icon: "PenSquare", href: "/admin/content?create=article" },
];

export function QuickActions() {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {QUICK_ACTIONS.map((action) => (
        <li key={action.label}>
          <Link
            href={action.href}
            className="flex h-full items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-xs font-medium text-charcoal transition-colors hover:border-cobalt-border hover:bg-cobalt-soft hover:text-cobalt"
          >
            <Icon name={action.icon} className="h-4 w-4 shrink-0 text-cobalt" />
            <span className="truncate">{action.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
