import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/ui/States";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms governing use of the OAX Tech website and services.",
  path: "/terms",
  noIndex: true,
});

export default function Page() {
  return (
    <section className="section">
      <Container narrow>
        <h1 className="text-display-lg">Terms of Service</h1>
        <div className="mt-8 max-w-prose">
          <ErrorState
            variant="config"
            title="This policy still needs to be written"
            description="Terms of service are a legal document specific to your business and should be reviewed before publishing, so no placeholder text is presented as binding. This page exists so the link isn't broken, and is excluded from search indexing until real content replaces it."
          />
        </div>
      </Container>
    </section>
  );
}
