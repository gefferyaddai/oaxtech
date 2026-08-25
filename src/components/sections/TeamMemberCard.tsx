import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  member: TeamMember;
  /** Compact variant used in the About page preview strip. */
  compact?: boolean;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

/**
 * Avatar handling:
 * `member.photo` is null for everyone until approved artwork is supplied, so a
 * neutral monogram is rendered instead. No AI-generated portrait is used, and
 * nothing here claims to be a photograph of a real person.
 */
function Avatar({ member, className }: { member: TeamMember; className?: string }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={`${member.name}, ${member.role} at OAX Tech`}
        width={320}
        height={320}
        className={cn("aspect-square w-full object-cover", className)}
      />
    );
  }
  /* No photograph exists for anyone yet, so the placeholder is drawn as a
     hatched plate with a monogram — the site's standing convention for a field
     deliberately left unfilled. No AI-generated portrait is used, and nothing
     here claims to be a photograph of a real person. */
  return (
    <div
      className={cn("relative flex aspect-square w-full items-center justify-center bg-sheet-sunk", className)}
      role="img"
      aria-label={`Placeholder avatar for ${member.name}`}
    >
      <span aria-hidden="true" className="hatch absolute inset-0" />
      <span className="relative bg-sheet-sunk px-3 font-display text-3xl font-extrabold uppercase tracking-wide text-graphite">
        {initials(member.name)}
      </span>
    </div>
  );
}

export function TeamMemberCard({ member, compact }: TeamMemberCardProps) {
  if (compact) {
    return (
      <article className="card card-interactive overflow-hidden">
        <Avatar member={member} />
        <div className="border-t border-line px-4 py-4 text-center">
          <h3 className="font-display text-sm font-semibold text-ink">{member.name}</h3>
          <p className="mt-1 text-xs leading-snug text-slate">{member.role}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="card card-interactive flex h-full flex-col overflow-hidden">
      <Avatar member={member} />
      <div className="flex flex-1 flex-col border-t border-line p-5">
        <h3 className="font-display text-base font-semibold text-ink">{member.name}</h3>
        <p className="mt-1 text-sm font-medium leading-snug text-slate">{member.role}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{member.bio}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {member.tags.map((tag) => (
            <li key={tag} className="tally border border-graphite px-2 py-1 font-mono text-graphite">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-line-subtle pt-4">
          {member.linkedIn ? (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-cobalt"
            >
              <Icon name="Linkedin" className="h-4 w-4" />
              LinkedIn
              <span className="sr-only"> profile for {member.name} (opens in a new tab)</span>
            </a>
          ) : (
            // No profile URL supplied — shown as inert text, never a dead link.
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <Icon name="Linkedin" className="h-4 w-4" />
              Profile link to be added
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
