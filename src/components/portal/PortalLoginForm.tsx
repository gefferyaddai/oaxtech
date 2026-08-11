"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { FormField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { signInWithPassword } from "@/lib/auth/actions";
import { enterPortalAction } from "@/lib/portal/actions";

/**
 * Portal sign-in.
 *
 * Two modes, decided by whether authentication is configured:
 *
 * REAL — email and password, checked server-side against an argon2id hash and
 * rate limited. The error message is deliberately the same for a wrong password
 * and an unknown address, so the form cannot be used to discover which email
 * addresses have accounts.
 *
 * DEMO — no credentials are checked, because none exist. The fields are
 * disabled and the form says so, because a password box that accepts anything
 * is worse than no password box at all.
 */
export function PortalLoginForm({ demoMode }: { demoMode: boolean }) {
  if (demoMode) return <DemoSignIn />;
  return <CredentialsSignIn />;
}

function CredentialsSignIn() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signInWithPassword, null);

  // A successful action returns no error; the session cookie is already set.
  useEffect(() => {
    if (state && !state.error) router.push("/portal");
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6">
      <div className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {state?.error && (
        <div className="mt-4">
          <ErrorState title="Couldn't sign in" description={state.error} />
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="mt-6"
        loading={pending}
        loadingLabel="Signing in…"
      >
        Sign In
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        Trouble signing in? Contact your project manager — for security, we can&apos;t confirm
        whether an email address has an account.
      </p>
    </form>
  );
}

function DemoSignIn() {
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
      <ErrorState
        variant="config"
        title="Demo mode — no real accounts exist"
        description="Authentication isn't configured on this site yet. The fields below are disabled, and the portal opens with sample data only. Nothing you see there is real project information."
      />

      <div className="mt-5 space-y-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          disabled
          hint="Disabled until authentication is connected."
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled
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
        Open Demo Portal
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        No password is stored, transmitted or checked in demo mode. The demo session is a single
        flag in a short-lived, http-only cookie and contains no personal data.
      </p>
    </div>
  );
}
