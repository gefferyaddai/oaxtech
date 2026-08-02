"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminNavList, AdminSidebarFooter } from "@/components/admin/AdminSidebar";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import type { AdminRole } from "@/lib/domain/types";

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Small-screen admin navigation: a trigger plus a modal drawer. Rendered once,
 * by the topbar, and hidden from `lg` up where the fixed rail takes over.
 *
 * Focus is moved into the dialog on open and handed back to the trigger on
 * close — without that, focus would sit outside the panel, the Tab trap below
 * would never match, and the first Tab would escape to the page behind.
 */
export function AdminMobileNavigation({ label, role }: { label: string; role: AdminRole }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line text-slate transition-colors hover:bg-mist lg:hidden"
      >
        <Icon name="Menu" className="h-5 w-5" label="Open admin menu" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 animate-fade-in"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-space p-3 animate-fade-in"
          >
            <div className="flex items-center justify-between px-2 py-2">
              <Logo variant="light" width={96} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-space-line text-white"
              >
                <Icon name="X" className="h-5 w-5" label="Close admin menu" />
              </button>
            </div>
            <nav
              aria-label="Admin sections menu"
              className="mt-4 flex-1 overflow-y-auto pb-4 [scrollbar-width:thin]"
            >
              <AdminNavList onNavigate={close} />
            </nav>
            <AdminSidebarFooter label={label} role={role} />
          </div>
        </div>
      )}
    </>
  );
}
