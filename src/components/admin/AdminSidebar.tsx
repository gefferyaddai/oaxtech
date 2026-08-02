"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/data/admin-navigation";
import { signOutAdminAction } from "@/lib/admin/actions";
import type { AdminRole } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Overview lives at `/admin`, which is a prefix of every other admin route, so
 * it must match exactly. Everything else matches its own subtree so that
 * `/admin/leads/ld-1` still highlights "Leads".
 */
export function isAdminItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {adminNav.map((section) => (
        <div key={section.heading}>
          <h2 className="px-3 text-2xs font-semibold uppercase tracking-[0.12em] text-space-text/60">
            {section.heading}
          </h2>
          <ul className="mt-2 space-y-0.5">
            {section.items.map((item) => {
              const active = isAdminItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[2.5rem] items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                      active
                        ? "bg-cobalt font-medium text-white"
                        : "text-space-text hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Administrator identity and sign-out, pinned to the bottom of the rail. */
export function AdminSidebarFooter({ label, role }: { label: string; role: AdminRole }) {
  return (
    <div className="border-t border-space-line pt-3">
      <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xs font-semibold text-white"
        >
          {label
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium text-white">{label}</span>
          <span className="block truncate text-2xs text-space-text">{role}</span>
        </span>
      </div>
      <form action={signOutAdminAction}>
        <button
          type="submit"
          className="mt-1 flex min-h-[2.5rem] w-full items-center gap-3 rounded-lg px-3 text-sm text-space-text transition-colors hover:bg-white/5 hover:text-white"
        >
          <Icon name="LogOut" className="h-4.5 w-4.5 shrink-0" />
          Sign Out
        </button>
      </form>
    </div>
  );
}

/**
 * The fixed navigation rail, shown from `lg` up. Rendered once, by the admin
 * layout — the small-screen equivalent is `AdminMobileNavigation`, owned by the
 * topbar. Keeping them as separate components means neither can end up in the
 * DOM twice.
 */
export function AdminSidebar({ label, role }: { label: string; role: AdminRole }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-space p-3 lg:flex">
      <div className="px-3 py-3">
        <Logo variant="light" width={104} />
      </div>
      <nav
        aria-label="Admin sections"
        className="mt-4 flex-1 overflow-y-auto pb-4 [scrollbar-width:thin]"
      >
        <AdminNavList />
      </nav>
      <AdminSidebarFooter label={label} role={role} />
    </aside>
  );
}
