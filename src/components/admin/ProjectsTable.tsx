"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DataTable,
  FilterDropdown,
  SearchInput,
  type Column,
} from "@/components/admin/controls";
import { Avatar, ProgressBar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/admin/format";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_TONE,
  type Client,
  type Project,
  type ProjectStatus,
  type TeamMemberRecord,
} from "@/lib/domain/types";

interface ProjectsTableProps {
  projects: Project[];
  clients: Client[];
  team: TeamMemberRecord[];
  /** Hides the search/filter row on the compact dashboard card. */
  compact?: boolean;
}

export function ProjectsTable({ projects, clients, team, compact }: ProjectsTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const clientById = useMemo(() => new Map(clients.map((c) => [c.id, c])), [clients]);
  const memberById = useMemo(() => new Map(team.map((m) => [m.id, m])), [team]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (status && project.status !== status) return false;
      if (!q) return true;
      const client = clientById.get(project.clientId);
      return (
        project.name.toLowerCase().includes(q) ||
        project.service.toLowerCase().includes(q) ||
        (client?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [projects, query, status, clientById]);

  const columns: Column<Project>[] = [
    {
      key: "name",
      header: "Project",
      sortValue: (row) => row.name,
      cell: (row) => (
        <Link
          href={`/admin/projects/${row.id}`}
          className="font-medium text-ink hover:text-cobalt"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "client",
      header: "Client",
      sortValue: (row) => clientById.get(row.clientId)?.name ?? "",
      hideBelow: "md",
      cell: (row) => {
        const client = clientById.get(row.clientId);
        return client ? (
          <Link href={`/admin/clients/${client.id}`} className="text-slate hover:text-cobalt">
            {client.name}
          </Link>
        ) : (
          <span className="text-muted">—</span>
        );
      },
    },
    {
      key: "service",
      header: "Service",
      sortValue: (row) => row.service,
      hideBelow: "xl",
      cell: (row) => <span className="text-slate">{row.service}</span>,
    },
    {
      key: "progress",
      header: "Progress",
      sortValue: (row) => row.progressPercent,
      className: "w-32",
      cell: (row) => (
        <ProgressBar
          value={row.progressPercent}
          label={`${row.name} progress`}
          showValue
          tone={row.status === "At Risk" ? "danger" : "cobalt"}
        />
      ),
    },
    {
      key: "milestone",
      header: "Next milestone",
      hideBelow: "xl",
      cell: (row) =>
        row.nextMilestone ? (
          <span className="text-slate">{row.nextMilestone}</span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: "deadline",
      header: "Deadline",
      sortValue: (row) => row.deadline ?? "",
      hideBelow: "lg",
      cell: (row) =>
        row.deadline ? (
          <span className="whitespace-nowrap text-slate">{formatDate(row.deadline)}</span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: "owner",
      header: "Owner",
      hideBelow: "sm",
      cell: (row) => {
        const owner = memberById.get(row.ownerId);
        return owner ? (
          <Avatar initials={owner.initials} name={owner.name} />
        ) : (
          <span className="text-muted">—</span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge tone={PROJECT_STATUS_TONE[row.status]} showIcon>
          {row.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      className: "w-12",
      cell: (row) => (
        <div className="relative inline-block">
          <button
            type="button"
            aria-expanded={openMenu === row.id}
            aria-haspopup="menu"
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu(openMenu === row.id ? null : row.id);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist"
          >
            <Icon name="MoreHorizontal" className="h-4 w-4" label={`Actions for ${row.name}`} />
          </button>
          {openMenu === row.id && (
            <div
              role="menu"
              className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-paper p-1 text-left shadow-float"
            >
              <Link
                href={`/admin/projects/${row.id}`}
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className="block rounded px-3 py-2 text-sm text-charcoal transition-colors hover:bg-mist"
              >
                View project
              </Link>
              <Link
                href={`/admin/tasks?project=${row.id}`}
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className="block rounded px-3 py-2 text-sm text-charcoal transition-colors hover:bg-mist"
              >
                View tasks
              </Link>
              <Link
                href={`/admin/invoices?project=${row.id}`}
                role="menuitem"
                onClick={() => setOpenMenu(null)}
                className="block rounded px-3 py-2 text-sm text-charcoal transition-colors hover:bg-mist"
              >
                View invoices
              </Link>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-w-0">
      {!compact && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            label="Search projects"
            value={query}
            onChange={setQuery}
            placeholder="Search projects, clients, services…"
            className="sm:max-w-xs"
          />
          <FilterDropdown
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={PROJECT_STATUSES as readonly ProjectStatus[]}
            allLabel="All statuses"
            className="sm:w-48"
          />
          <p className="text-xs text-slate sm:ml-auto">
            {filtered.length} of {projects.length}
          </p>
        </div>
      )}

      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={(row) => row.id}
        caption="Active projects"
        minWidth="52rem"
        empty={
          <EmptyState
            icon="Layers"
            title={query || status ? "No projects match those filters" : "No active projects"}
            description={
              query || status
                ? "Try a different search term or clear the status filter."
                : "Projects created from converted leads appear here."
            }
          />
        }
      />
    </div>
  );
}
