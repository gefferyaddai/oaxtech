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
        "sticky top-0 z-50 border-b bg-cream/90 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "border-line shadow-[0_1px_0_0_rgb(9_11_18_/_0.04),0_12px_24px_-16px_rgb(9_11_18_/_0.18)]" : "border-transparent",
      )}
    >
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <Logo />

        <div ref={navRef} className="hidden items-center gap-1 lg:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative inline-flex h-10 items-center rounded-md px-3 text-sm transition-colors",
                          active ? "text-ink font-medium" : "text-slate hover:text-ink",
                        )}
                      >
                        {item.label}
                        {active && (
                          <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cobalt" />
                        )}
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
                      className={cn(
                        "relative inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm transition-colors",
                        active ? "text-ink font-medium" : "text-slate hover:text-ink",
                      )}
                    >
                      {item.label}
                      <Icon
                        name="ChevronDown"
                        className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                      />
                      {active && (
                        <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cobalt" />
                      )}
                    </button>

                    {expanded && (
                      <div
                        id={`${menuId}-${item.label}`}
                        className="absolute left-0 top-full z-50 mt-2 w-72 animate-fade-up rounded-xl border border-line bg-paper p-2 shadow-float"
                      >
                        <ul>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-mist"
                              >
                                <span className="block text-sm font-medium text-ink">{child.label}</span>
                                {child.description && (
                                  <span className="mt-0.5 block text-xs text-muted">{child.description}</span>
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

          <div className="ml-4 flex items-center gap-2">
            <Link href="/quote" className="btn btn-sm btn-neutral">
              Request a Quote
            </Link>
            <Link href="/book" className="btn btn-sm btn-dark">
              Book a Consultation
            </Link>
          </div>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
