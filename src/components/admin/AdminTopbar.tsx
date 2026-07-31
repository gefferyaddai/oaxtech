"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AdminMobileNavigation } from "@/components/admin/AdminMobileNavigation";
import { QuickCreateModal } from "@/components/admin/QuickCreateModal";
import { Icon } from "@/components/ui/Icon";
import { adminNavFlat } from "@/data/admin-navigation";
import type { AdminRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

/** A record the global search can resolve to. Supplied by the layout. */
export interface SearchRecord {
  id: string;
  label: string;
  /** "Client", "Project", "Lead" — shown as the result's category. */
  kind: string;
  href: string;
}

interface AdminTopbarProps {
  label: string;
  role: AdminRole;
  searchIndex: SearchRecord[];
  unreadCount: number;
}

export function AdminTopbar({ label, role, searchIndex, unreadCount }: AdminTopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  /**
   * Sections are searchable alongside records, so typing "invoice" reaches the
   * Invoices screen even when no invoice matches by name.
   */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const sections: SearchRecord[] = adminNavFlat.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      kind: "Section",
      href: item.href,
    }));
    return [...searchIndex, ...sections]
      .filter((record) => record.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, searchIndex]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function go(href: string) {
    setQuery("");
    setOpenResults(false);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-paper px-3 sm:gap-3 sm:px-5">
      <AdminMobileNavigation label={label} role={role} />

      {/* Global search ---------------------------------------------------- */}
      <div ref={searchRef} className="relative min-w-0 flex-1 sm:max-w-md">
        <label htmlFor="admin-global-search" className="sr-only">
          Search clients, projects, leads
        </label>
        <Icon
          name="Search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          id="admin-global-search"
          type="search"
          role="combobox"
          aria-expanded={openResults && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpenResults(true);
          }}
          onFocus={() => setOpenResults(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpenResults(false);
            if (event.key === "Enter" && results[0]) go(results[0].href);
          }}
          placeholder="Search clients, projects, leads…"
          className="field-control min-h-[2.25rem] py-1.5 pl-9 pr-3 text-sm"
        />

        {openResults && query.trim().length >= 2 && (
          <div
            id={listId}
            role="listbox"
            aria-label="Search results"
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-line bg-paper shadow-float"
          >
            {results.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-slate">
                No matches for “{query.trim()}”.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((record) => (
                  <li key={record.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => go(record.href)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-mist"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-ink">
                        {record.label}
                      </span>
                      <span className="shrink-0 rounded border border-line bg-mist px-1.5 py-0.5 text-2xs text-slate">
                        {record.kind}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => setQuickCreateOpen(true)}
          className="btn btn-sm btn-primary hidden sm:inline-flex"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Quick Create
        </button>
        <button
          type="button"
          onClick={() => setQuickCreateOpen(true)}
          className="btn btn-sm btn-primary !px-2 sm:hidden"
        >
          <Icon name="Plus" className="h-4 w-4" label="Quick create" />
        </button>

        <Link
          href="/admin/messages"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist"
        >
          <Icon name="Bell" className="h-4.5 w-4.5" label="Notifications" />
          {unreadCount > 0 && (
            <>
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.625rem] font-semibold leading-none text-white"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
              <span className="sr-only">{unreadCount} unread</span>
            </>
          )}
        </Link>

        <Link
          href="/admin/support"
          className="hidden h-9 w-9 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist sm:inline-flex"
        >
          <Icon name="HelpCircle" className="h-4.5 w-4.5" label="Help and support" />
        </Link>

        {/* Profile menu --------------------------------------------------- */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-md border border-line px-1.5 py-1 transition-colors hover:bg-mist"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cobalt-soft text-2xs font-semibold text-cobalt"
            >
              {label
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="hidden text-xs font-medium text-ink lg:inline">{label}</span>
            <Icon
              name="ChevronDown"
              className={cn("h-3.5 w-3.5 text-muted transition-transform", profileOpen && "rotate-180")}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Administrator menu"
              className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-line bg-paper p-1 shadow-float animate-fade-up"
            >
              <div className="border-b border-line-subtle px-3 py-2">
                <p className="truncate text-sm font-medium text-ink">{label}</p>
                <p className="truncate text-2xs text-slate">{role}</p>
              </div>
              <Link
                href="/admin/team"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-charcoal transition-colors hover:bg-mist"
              >
                <Icon name="Users" className="h-4 w-4 text-muted" />
                Team
              </Link>
              <Link
                href="/admin/settings"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-charcoal transition-colors hover:bg-mist"
              >
                <Icon name="Settings" className="h-4 w-4 text-muted" />
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>

      <QuickCreateModal open={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} />
    </header>
  );
}
