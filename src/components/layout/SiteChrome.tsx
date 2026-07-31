"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the marketing header and footer on internal application surfaces.
 *
 * The admin has its own sidebar, topbar and identity; wrapping it in the public
 * site's navigation and footer would be confusing and would put a "Book a
 * Consultation" call-to-action inside a staff tool.
 *
 * `usePathname` resolves during server rendering too, so the chrome is absent
 * from the initial HTML — there is no flash of the marketing header.
 */
const APP_SURFACES = ["/admin"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppSurface = APP_SURFACES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAppSurface) return null;
  return <>{children}</>;
}
