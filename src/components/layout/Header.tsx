"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The sheet's title bar.
 *
 * Set on the ink ground with a revision-orange rule beneath it, so the top of
 * every page reads as the header strip of a drawing rather than a floating
 * translucent bar. Active navigation is marked by a solid orange block under
 * the label — a mark, not a tint — and the booking action is the only filled
 * block in the strip, which is what makes it findable in one glance.
 *
 * Scroll only deepens the bottom rule. There is no blur and no shadow: the
 * header is opaque stock, and stock does not blur what is behind it.
 */
export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close the dropdown on route change, outside click, or Escape.
  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-ink transition-[border-color] duration-300",
        scrolled ? "border-b-[3px] border-revision" : "border-b border-ink-line",
      )}
    >
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {/*
            The logo sits on a paper nameplate rather than directly on the ink.
            Both files in /public/brand are still placeholders and the "white"
            one is not actually white, so a light-on-dark lockup disappears
            entirely against this header. A nameplate is legible whichever
            artwork lands there, and it reads as a stamped plate on the title
            bar, which is the world this header is already in.
          */}
          <Link
            href="/"
            aria-label="OAX Tech — home"
            className="inline-flex shrink-0 items-center bg-sheet px-3 py-2"
          >
            <Logo asStatic width={96} />
          </Link>
          {/* The tally strip. Establishes the document register immediately,
              and disappears below lg where the space belongs to navigation. */}
          <span
            aria-hidden="true"
            className="tally hidden font-mono text-ink-muted xl:inline"
          >
            EST. 2024 · CALGARY AB
          </span>
        </div>

        <div ref={navRef} className="hidden items-center gap-2 lg:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                const linkClass = cn(
                  "relative inline-flex h-[var(--header-height)] items-center gap-1.5 px-3.5",
                  "font-display text-base font-bold uppercase tracking-wide transition-colors",
                  active ? "text-white" : "text-ink-text hover:text-white",
                );
                const marker = active && (
                  <span className="absolute inset-x-3 bottom-0 h-1 bg-revision" />
                );

                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={linkClass}
                      >
                        {item.label}
                        {marker}
                      </Link>
                    </li>
                  );
                }

                const expanded = openMenu === item.label;
                return (
                  <li key={item.href} className="relative">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`${menuId}-${item.label}`}
                      onClick={() => setOpenMenu(expanded ? null : item.label)}
                      className={linkClass}
                    >
                      {item.label}
                      <Icon
                        name="ChevronDown"
                        className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
                      />
                      {marker}
                    </button>

                    {expanded && (
                      <div
                        id={`${menuId}-${item.label}`}
                        className="absolute left-0 top-full z-50 w-80 animate-sheet-in border-rule border-revision bg-ink-raised p-1.5 shadow-overlay"
                      >
                        <ul>
                          {item.children.map((child) => (
                            <li key={child.href} className="border-b border-ink-line last:border-b-0">
                              <Link
                                href={child.href}
                                className="group/item block px-3 py-3 transition-colors hover:bg-ink-card"
                              >
                                <span className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-wide text-white">
                                  {child.label}
                                  <Icon
                                    name="ArrowRight"
                                    className="h-3.5 w-3.5 shrink-0 text-revision-onInk transition-transform duration-200 group-hover/item:translate-x-1"
                                  />
                                </span>
                                {child.description && (
                                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-3 flex items-center gap-3">
            <Link
              href="/quote"
              className="font-display text-base font-bold uppercase tracking-wide text-ink-text underline decoration-ink-line decoration-2 underline-offset-[6px] transition-colors hover:text-white hover:decoration-revision"
            >
              Get a quote
            </Link>
            <Link
              href="/book"
              className="inline-flex h-11 items-center bg-revision px-5 font-display text-base font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-revision-hover"
            >
              Book a consult
            </Link>
          </div>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
