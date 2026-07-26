import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/ui/States";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How OAX Tech handles personal information.",
  path: "/privacy",
  noIndex: true,
});

export default function Page() {
  return (
    <section className="section">
      <Container narrow>
        <h1 className="text-display-lg">Privacy Policy</h1>
        <div className="mt-8 max-w-prose">
          <ErrorState
            variant="config"
            title="This policy still needs to be written"
            description="A privacy policy must reflect what your site actually collects and who processes it, so it can't be templated here without being misleading. This page exists so the link isn't broken, and is excluded from search indexing until real content replaces it."
          />
        </div>
      </Container>
    </section>
  );
}
