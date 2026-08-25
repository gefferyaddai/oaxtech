"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { primaryNav, utilityNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Mobile menu implemented as a modal dialog:
 * - Escape closes it
 * - focus is trapped while open and restored to the trigger on close
 * - background scroll is locked
 * - the rest of the page is hidden from assistive tech via aria-hidden on the
 *   dialog's siblings (handled by the overlay + role="dialog" + aria-modal)
 */
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured now: reading triggerRef.current during cleanup could see a stale node.
    const trigger = triggerRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the panel once it exists.
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
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
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      (previouslyFocused ?? trigger)?.focus();
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
        /* The header sits on the ink ground, so this trigger is light-on-dark.
           It was `text-ink`, which rendered an invisible icon inside a visible
           box once the header stopped being a light surface. */
        className="inline-flex h-11 w-11 items-center justify-center border border-ink-line text-white transition-colors hover:border-revision hover:bg-revision lg:hidden"
      >
        <Icon name="Menu" className="h-5 w-5" label="Open menu" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 animate-fade-in"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-float animate-fade-in"
          >
            <div className="flex h-[var(--header-height)] items-center justify-between border-b border-line px-5">
              <span className="font-display text-sm font-semibold text-ink">Menu</span>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink"
              >
                <Icon name="X" className="h-5 w-5" label="Close menu" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={cn(
                        "flex min-h-[2.75rem] items-center justify-between rounded-lg px-3 text-base transition-colors",
                        isActive(pathname, item.href)
                          ? "bg-cobalt-soft font-medium text-cobalt"
                          : "text-charcoal hover:bg-mist",
                      )}
                    >
                      {item.label}
                      <Icon name="ChevronRight" className="h-4 w-4 opacity-40" />
                    </Link>
                    {item.children && (
                      <ul className="ml-3 mt-1 space-y-1 border-l border-line pl-3">
                        {item.children
                          .filter((child) => child.href !== item.href)
                          .map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="flex min-h-[2.5rem] items-center rounded-lg px-3 text-sm text-slate transition-colors hover:bg-mist hover:text-ink"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-line" />

              <ul className="space-y-1">
                {utilityNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[2.75rem] items-center rounded-lg px-3 text-sm text-slate transition-colors hover:bg-mist hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-line px-5 py-5">
              <Link href="/quote" className="btn btn-neutral w-full">
                Request a Quote
              </Link>
              <Link href="/book" className="btn btn-dark w-full">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
