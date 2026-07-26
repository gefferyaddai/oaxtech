"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { enterPortalAction } from "@/lib/portal/actions";

/**
 * Demo sign-in.
 *
 * When no auth provider is configured this form does NOT validate credentials —
 * it says so plainly and the fields are disabled, because a password box that
 * accepts anything is worse than no password box at all.
 */
export function PortalLoginForm({ demoMode }: { demoMode: boolean }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function enter() {
    setError(undefined);
    startTransition(async () => {
      const result = await enterPortalAction();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mt-6">
      {demoMode && (
        <ErrorState
          variant="config"
          title="Demo mode — no real accounts exist"
          description="Authentication isn't configured on this site yet. The fields below are disabled, and the portal opens with sample data only. Nothing you see there is real project information."
        />
      )}

      <div className="mt-5 space-y-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
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
      >
        {demoMode ? "Open Demo Portal" : "Sign In"}
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        No password is stored, transmitted or checked in demo mode. The demo session is a single
        flag in a short-lived, http-only cookie and contains no personal data.
      </p>
    </div>
  );
}
