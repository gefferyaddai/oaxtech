import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { demoAccessAllowed, isAdminDemoMode } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: { absolute: "Admin Sign In | OAX Tech" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-screen items-center bg-mist py-12">
      <Container narrow>
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex justify-center">
            <Logo width={132} />
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <Icon name="ShieldCheck" className="h-5 w-5 text-cobalt" />
              <h1 className="font-display text-lg font-semibold text-ink">
                Sign in to Admin
              </h1>
            </div>

            <AdminLoginForm
              demoMode={isAdminDemoMode()}
              demoAllowed={demoAccessAllowed()}
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate">
            Looking for the client portal?{" "}
            <Link
              href="/portal/login"
              className="font-medium text-cobalt underline underline-offset-2"
            >
              Sign in there instead
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
