import type { Metadata } from "next";
import { AdminCard, PageHeader } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminSession } from "@/lib/admin/auth";
import { capabilitiesFor } from "@/lib/admin/permissions";
import { getSystemStatus } from "@/lib/domain/repository";
import { ADMIN_ROLES } from "@/lib/domain/types";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Settings" };

const CAPABILITY_LABEL: Record<string, string> = {
  "manage:records": "Create and edit records",
  "manage:finance": "Invoices and proposals",
  "manage:content": "Publish website content",
  "manage:team": "Manage team accounts",
  "manage:settings": "Change settings",
  "delete:records": "Delete records",
  "manage:support": "Respond to support",
};

export default async function SettingsPage() {
  const session = await getAdminSession();
  const services = getSystemStatus();

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Settings"
        description="Organisation details, integrations and access."
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <AdminCard title="Organisation">
          <dl className="space-y-3 text-sm">
            {[
              { label: "Business name", value: siteConfig.name },
              { label: "Location", value: siteConfig.location.display },
              { label: "Website", value: siteConfig.url },
              { label: "Established", value: String(siteConfig.foundedYear) },
              { label: "Contact email", value: siteConfig.contact.email ?? "Not set" },
              { label: "Phone", value: siteConfig.contact.phone ?? "Not set" },
            ].map((row) => (
              <div key={row.label} className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2 last:border-0 last:pb-0">
                <dt className="text-slate">{row.label}</dt>
                <dd className="font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-start gap-1.5 text-2xs text-slate">
            <Icon name="Info" className="mt-0.5 h-3 w-3 shrink-0" />
            Edited in <code className="rounded bg-mist px-1">src/lib/site.ts</code>, the single
            source of truth for business information.
          </p>
        </AdminCard>

        <AdminCard title="Integrations" description="What is actually configured right now.">
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.label}
                className="flex flex-wrap items-center gap-2 border-b border-line-subtle pb-2 text-sm last:border-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 truncate text-charcoal">{service.label}</span>
                <StatusBadge tone={service.configured ? "success" : "neutral"} showIcon>
                  {service.configured ? "Configured" : "Not configured"}
                </StatusBadge>
                {!service.configured && (
                  <code className="w-full shrink-0 truncate rounded bg-mist px-1.5 py-0.5 text-2xs text-slate sm:w-auto">
                    {service.requires}
                  </code>
                )}
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard title="Your access" className="xl:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="info">{session?.role ?? "Unknown"}</StatusBadge>
            {session?.isDemo && <StatusBadge tone="warning">Demo session</StatusBadge>}
          </div>

          <h3 className="mt-4 text-2xs font-semibold uppercase tracking-wide text-slate">
            Capabilities granted to this role
          </h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {session ? (
              capabilitiesFor(session.role).length > 0 ? (
                capabilitiesFor(session.role).map((capability) => (
                  <li
                    key={capability}
                    className="rounded-md border border-line bg-mist px-2 py-1 text-xs text-charcoal"
                  >
                    {CAPABILITY_LABEL[capability] ?? capability}
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate">Read-only. No write capabilities.</li>
              )
            ) : null}
          </ul>

          <h3 className="mt-5 text-2xs font-semibold uppercase tracking-wide text-slate">
            All roles
          </h3>
          <div className="table-scroll mt-2">
            <table className="w-full min-w-[36rem] text-sm">
              <caption className="sr-only">Role permission matrix</caption>
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="px-3 py-2 text-2xs font-semibold uppercase tracking-wide text-slate">Role</th>
                  <th scope="col" className="px-3 py-2 text-2xs font-semibold uppercase tracking-wide text-slate">Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {ADMIN_ROLES.map((role) => (
                  <tr key={role} className="border-b border-line-subtle last:border-0">
                    <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left font-medium text-ink">{role}</th>
                    <td className="px-3 py-2.5 text-slate">
                      {capabilitiesFor(role).length === 0
                        ? "Read-only"
                        : capabilitiesFor(role).map((c) => CAPABILITY_LABEL[c] ?? c).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/25 bg-warning-soft p-3">
            <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs leading-relaxed text-charcoal">
              <span className="font-semibold">Permissions are a UI guard only.</span> They hide
              controls a role should not use. They are not a security boundary — once a backend
              exists, every mutation must re-check the caller&apos;s role on the server.
            </p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
