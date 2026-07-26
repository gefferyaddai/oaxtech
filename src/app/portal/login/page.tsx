import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";
import { Icon } from "@/components/ui/Icon";
import { buildMetadata } from "@/lib/metadata";
import { isDemoMode } from "@/lib/portal/auth";

export const metadata = buildMetadata({
  title: "Client Portal Sign In",
  description: "Sign in to the OAX Tech client portal.",
  path: "/portal/login",
  noIndex: true,
});

export default function PortalLoginPage() {
  return (
    <section className="section">
      <Container narrow>
        <div className="mx-auto max-w-md">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <Icon name="Lock" className="h-4.5 w-4.5 text-cobalt" />
              <h1 className="font-display text-lg font-semibold text-ink">
                Sign in to Client Portal
              </h1>
            </div>

            <PortalLoginForm demoMode={isDemoMode()} />
          </div>

          <p className="mt-6 text-center text-sm text-slate">
            Not a client yet?{" "}
            <Link href="/quote" className="font-medium text-cobalt underline underline-offset-2">
              Request a quote
            </Link>{" "}
            or{" "}
            <Link href="/book" className="font-medium text-cobalt underline underline-offset-2">
              book a consultation
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
