import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <section className="section">
      <Container narrow>
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
            <Icon name="Search" className="h-6 w-6" />
          </span>
          <h1 className="text-display-md">This page doesn&apos;t exist</h1>
          <p className="mt-4 text-base text-slate">
            The link may be out of date, or the address may have a typo. Here are the places people
            usually want.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" variant="primary">Go home</ButtonLink>
            <ButtonLink href="/services" variant="neutral">Services</ButtonLink>
            <ButtonLink href="/work" variant="neutral">Our work</ButtonLink>
            <ButtonLink href="/contact" variant="neutral">Contact</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
