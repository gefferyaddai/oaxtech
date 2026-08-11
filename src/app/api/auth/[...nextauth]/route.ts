/**
 * Auth.js request handlers.
 *
 * Serves /api/auth/* — sign-in, sign-out, session and CSRF endpoints.
 */

import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;
