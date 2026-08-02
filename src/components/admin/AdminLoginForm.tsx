"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { enterAdminAction } from "@/lib/admin/actions";
import { ADMIN_ROLES, type AdminRole } from "@/lib/domain/types";

/**
 * Demo sign-in for the admin.
 *
 * When no auth provider is configured this form does NOT validate credentials —
 * it says so plainly and the fields are disabled, because a password box that
 * accepts anything is worse than no password box at all.
 *
 * The role selector exists so the permission matrix can actually be exercised
 * during development. It is not a security control.
 */
export function AdminLoginForm({
  demoMode,
  demoAllowed,
}: {
  demoMode: boolean;
  demoAllowed: boolean;
}) {
  const [error, setError] = useState<string>();
  const [role, setRole] = useState<AdminRole>("Super Admin");
  const [pending, startTransition] = useTransition();

  function enter() {
    setError(undefined);
    startTransition(async () => {
      const data = new FormData();
      data.set("role", role);
      const result = await enterAdminAction(data);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mt-6">
      {demoMode && demoAllowed && (
        <ErrorState
          variant="config"
          title="Development mode — no real accounts exist"
          description="Authentication is not configured. The fields below are disabled and the admin opens with demo data only. Nothing shown inside is real business information."
        />
      )}

      {demoMode && !demoAllowed && (
        <ErrorState
          title="Admin access is disabled"
          description="This build is running in production without an authentication provider, so demo admin access is refused. Set AUTH_SECRET and AUTH_PROVIDER_URL and implement the adapter in src/lib/admin/auth.ts."
        />
      )}

      <div className="mt-5 space-y-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@oaxtech.com"
          disabled={demoMode}
          hint={demoMode ? "Disabled until authentication is connected." : undefined}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={demoMode}
        />

        {demoMode && demoAllowed && (
          <label className="block">
            <span className="field-label">Open the demo as</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminRole)}
              className="field-control"
            >
              {ADMIN_ROLES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="mt-1.5 block text-xs text-slate">
              Changes which controls are available, so permissions can be tested.
            </span>
          </label>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <ErrorState title="Couldn't sign in" description={error} />
        </div>
      )}

      <Button
        onClick={enter}
        variant="primary"
        fullWidth
        className="mt-6"
        loading={pending}
        loadingLabel="Opening…"
        disabled={demoMode && !demoAllowed}
      >
        {demoMode ? "Open Demo Admin" : "Sign In"}
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        No password is stored, transmitted or checked in demo mode. The session is a role
        string in a short-lived, http-only cookie scoped to <code>/admin</code>, and contains
        no personal data.
      </p>
    </div>
  );
}
