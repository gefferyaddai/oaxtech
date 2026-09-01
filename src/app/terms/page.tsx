import { LegalDocument } from "@/components/sections/LegalDocument";
import { termsOfService } from "@/data/legal";
import { buildMetadata } from "@/lib/metadata";

/** Indexable, for the same reason as the privacy policy. */
export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms governing use of the OAX Tech website. Project work is governed by the signed proposal and agreement, not by this page.",
  path: "/terms",
});

export default function Page() {
  return <LegalDocument document={termsOfService} />;
}
