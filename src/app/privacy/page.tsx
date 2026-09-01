import { LegalDocument } from "@/components/sections/LegalDocument";
import { privacyPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/metadata";

/**
 * Indexable. It was `noindex` only while the page was an empty stub — a real
 * privacy policy should be findable, and a search engine that cannot see it
 * cannot show it to someone checking whether we are legitimate.
 */
export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "What personal information OAX Tech collects through this website, why, who processes it, how long it is kept, and how to ask us to delete it.",
  path: "/privacy",
});

export default function Page() {
  return <LegalDocument document={privacyPolicy} />;
}
