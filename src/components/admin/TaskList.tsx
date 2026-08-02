"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/admin/format";
import type { Priority, Project, Task, TeamMemberRecord } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const PRIORITY_TONE: Record<Priority, "danger" | "warning" | "neutral"> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

interface TaskListProps {
  tasks: Task[];
  team: TeamMemberRecord[];
  projects: Project[];
}

/**
 * Tasks requiring attention.
 *
 * Completion toggles local state and gives immediate visual feedback. With no
 * database configured nothing is persisted, and the footnote says so — the
 * checkbox does not silently pretend to have saved.
 */
export function TaskList({ tasks, team, projects }: TaskListProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tasks.map((task) => [task.id, task.completed])),
  );
  const [announcement, setAnnouncement] = useState("");

  const memberById = new Map(team.map((member) => [member.id, member]));
  const projectById = new Map(projects.map((project) => [project.id, project]));

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="ClipboardCheck"
        title="Nothing needs attention"
        description="Tasks assigned across active projects appear here, highest priority first."
      />
    );
  }

  function toggle(task: Task) {
    const next = !completed[task.id];
    setCompleted((current) => ({ ...current, [task.id]: next }));
    setAnnouncement(`${task.title} marked ${next ? "complete" : "incomplete"}.`);
  }

  return (
    <div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <ul className="divide-y divide-line-subtle">
        {tasks.map((task) => {
          const assignee = memberById.get(task.assigneeId);
          const project = task.projectId ? projectById.get(task.projectId) : null;
          const done = completed[task.id];

          return (
            <li key={task.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(task)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line-strong text-cobalt accent-cobalt"
                />
                <span className="sr-only">Mark “{task.title}” complete</span>
              </label>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm text-ink transition-colors",
                    done && "text-muted line-through",
                  )}
                >
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-slate">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="Calendar" className="h-3 w-3 shrink-0" />
                    {formatDate(task.dueDate)}
                  </span>
                  {project && (
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="truncate hover:text-cobalt"
                    >
                      {project.name}
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge tone={PRIORITY_TONE[task.priority]}>{task.priority}</StatusBadge>
                {assignee && (
                  <Avatar initials={assignee.initials} name={assignee.name} className="h-6 w-6" />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 flex items-start gap-1.5 text-2xs text-slate">
        <Icon name="Info" className="mt-0.5 h-3 w-3 shrink-0" />
        Completion is not saved — no database is configured.
      </p>
    </div>
  );
}
