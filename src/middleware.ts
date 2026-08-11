import { NextResponse, type NextRequest } from "next/server";

/**
 * ============================================================================
 * ROUTE PROTECTION
 * ============================================================================
 *
 * Structural, rather than by convention.
 *
 * `/admin` and `/portal` are also guarded by a `redirect()` in their route-group
 * layouts, and that is where the REAL authorisation decision is made — the
 * layout can read the database, resolve memberships and check roles. This
 * middleware is a second, coarser gate whose job is to make sure a route added
 * outside those groups cannot end up silently public. That has already happened
 * once in this codebase.
 *
 * WHY IT ONLY CHECKS FOR A COOKIE
 * Middleware runs on the edge runtime, where `node:crypto`, `@node-rs/argon2`
 * and the Postgres driver are unavailable — so it cannot verify a JWT signature
 * or read the database. It therefore performs a presence check only, and the
 * layout does the verification. Treating this as sufficient authentication
 * would be a mistake.
 */

/** Auth.js session cookie, `__Secure-` prefixed when served over HTTPS. */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  // Demo-mode cookies, used when AUTH_SECRET is unset.
  "oax_portal_demo",
  "oax_admin_demo",
];

function hasAnySessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => request.cookies.has(name));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The sign-in screens and the Auth.js endpoints must stay reachable.
  if (
    pathname === "/admin/login" ||
    pathname === "/portal/login" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/portal");
  if (!isProtected) return NextResponse.next();

  if (!hasAnySessionCookie(request)) {
    const loginPath = pathname.startsWith("/admin") ? "/admin/login" : "/portal/login";
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // A cookie exists. The layout decides whether it actually grants access.
  const response = NextResponse.next();
  // Never let an authenticated page sit in a shared cache.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  /*
   * Matches the two application surfaces only. Static assets, images and the
   * marketing site are excluded so the middleware costs nothing on public
   * traffic.
   */
  matcher: ["/admin/:path*", "/portal/:path*"],
};
