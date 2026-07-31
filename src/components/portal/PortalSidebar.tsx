"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { portalNav } from "@/data/navigation";
import { signOutAction } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

/** Everything inside the drawer that can hold focus, in DOM order. */
const FOCUSABLE = 'a[href], button:not([disabled])';

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {portalNav.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[2.75rem] items-center gap-3 rounded-lg px-3 text-sm transition-colors",
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
  );
}

function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={cn(
          "flex min-h-[2.75rem] w-full items-center gap-3 rounded-lg px-3 text-sm text-space-text transition-colors hover:bg-white/5 hover:text-white",
          className,
        )}
      >
        <Icon name="LogOut" className="h-4.5 w-4.5 shrink-0" />
        Sign Out
      </button>
    </form>
  );
}

/**
 * The fixed navigation rail, shown from `lg` up. Rendered once, by the portal
 * layout. The small-screen equivalent is `PortalMobileNav`, which the topbar
 * owns — the two are deliberately separate components so neither the rail nor
 * the drawer can end up in the DOM twice.
 */
export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-space p-4 lg:flex">
      <div className="px-2 py-3">
        <Logo variant="light" width={112} />
      </div>
      <nav aria-label="Client portal" className="mt-6 flex-1 overflow-y-auto">
        <NavList pathname={pathname} />
      </nav>
      <div className="mt-4 border-t border-space-line pt-4">
        <SignOutButton />
      </div>
    </aside>
  );
}

/**
 * Small-screen portal navigation: a trigger plus a modal drawer. Rendered once,
 * by the topbar, and hidden from `lg` up where the rail takes over.
 */
export function PortalMobileNav() {
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

    /*
     * Move focus into the dialog. Without this, focus stays on the trigger —
     * outside the panel — so the Tab trap below never matches and the first
     * Tab escapes to the content behind the overlay. The close button is the
     * entry point rather than the first focusable, which is the home link.
     */
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
      // Hand focus back to whatever opened the dialog, so keyboard users
      // resume where they left off instead of at the top of the document.
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
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line lg:hidden"
      >
        <Icon name="Menu" className="h-5 w-5" label="Open portal menu" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={close} aria-hidden="true" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Client portal menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-space p-4 animate-fade-in"
          >
            <div className="flex items-center justify-between px-2 py-2">
              <Logo variant="light" width={104} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-space-line text-white"
              >
                <Icon name="X" className="h-5 w-5" label="Close portal menu" />
              </button>
            </div>
            <nav aria-label="Client portal menu" className="mt-5 flex-1 overflow-y-auto">
              <NavList pathname={pathname} onNavigate={close} />
            </nav>
            <div className="mt-4 border-t border-space-line pt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
