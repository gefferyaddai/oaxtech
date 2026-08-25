import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CornerTicks, TitleBlock } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import { ClipReveal, SlideIn } from "@/components/ui/Motion";
import { services } from "@/data/services";
import { layerFor } from "@/lib/layers";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * THE COVER SHEET
 * ============================================================================
 *
 * The homepage's first viewport, built here rather than through the shared
 * `PageHero` because this one carries the whole direction: it is the sheet
 * every other sheet in the set is a detail of, and a shared hero component
 * would flatten it to match the interior pages.
 *
 * The composition, in the order it reads:
 *   - a border with registration ticks, establishing that this is a drawing;
 *   - the headline in four tight lines across the left two-thirds, set at the
 *     scale a drawing's title is actually set;
 *   - a dimension line measuring from the headline down to the booking action,
 *     labelled with what the action costs — free, thirty minutes. The one
 *     genuinely persuasive number available, drawn as a measurement;
 *   - the four services as a numbered legend down the right, which is what a
 *     cover sheet carries: an index of the sheets that follow;
 *   - a title block at the foot recording who drew it, which sheet it is, and
 *     where the work is done.
 *
 * There is no photograph and no product screenshot, because the business has
 * neither. The scale of the type is doing the work a full-bleed image would
 * normally do, which is why the headline is set as large as it is: at a
 * smaller size this composition would read as a plain page with an unusual
 * font, not as a drawing.
 */
export function HomeHero() {
  return (
    <section id="sheet-01" className="relative border-b-[6px] border-graphite bg-sheet">
      <Container className="py-6 md:py-8 lg:py-10">
        <div className="relative border border-line px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-11">
          <CornerTicks size="1.125rem" />

          {/* Top register strip */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4 lg:mb-10">
            <span className="tally font-mono text-graphite">
              OAX Tech · Technology &amp; digital growth
            </span>
            <span className="tally font-mono text-faint">
              Est. {siteConfig.foundedYear} · {siteConfig.location.display}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
            {/* ---- Title field ------------------------------------------ */}
            <div className="min-w-0">
              {/*
                Sized to land the booking block inside the first viewport at a
                laptop height. The headline still has to be the largest thing
                on the page by a wide margin — that scale is what makes this
                read as a drawing's title rather than a page with a big font —
                but a hero whose only action is below the fold has failed the
                one job a Persuade surface has.
              */}
              {/* The headline rises from behind the register rule above it.
                  A clipping wrapper plus a translate, not a per-line split:
                  the line count changes with the viewport, so anything that
                  depends on where the lines break is wrong at some width. */}
              <ClipReveal as="h1" className="text-display-xl">
                <span className="text-graphite">
                  Digital solutions built to move your business forward
                  <span className="accent-dot">.</span>
                </span>
              </ClipReveal>

              <p className="mt-6 max-w-prose animate-sheet-in text-lg leading-relaxed text-pencil [animation-delay:80ms]">
                We design high-performing websites, build custom software, and create marketing
                and SEO strategies that help businesses grow.
              </p>

              {/* The dimension line: a measurement from the copy to the
                  action, carrying the offer's actual terms. */}
              <div
                className="mt-7 flex animate-sheet-in items-center gap-4 [animation-delay:140ms]"
                aria-hidden="true"
              >
                <span className="h-4 w-0.5 shrink-0 bg-revision" />
                <span className="h-0.5 flex-1 origin-left bg-revision motion-safe:animate-rule-draw" />
                <span className="tally shrink-0 whitespace-nowrap font-mono text-revision-text">
                  {siteConfig.consultation.price} · {siteConfig.consultation.durationMinutes} min
                </span>
                <span className="h-0.5 w-8 bg-revision" />
                <span className="h-4 w-0.5 shrink-0 bg-revision" />
              </div>

              {/* Full-width blocks on a phone, where two differently-sized
                  buttons stacked left-aligned read as leftovers rather than as
                  the page's primary action. */}
              <div className="mt-6 flex animate-sheet-in flex-col gap-4 xs:flex-row xs:flex-wrap [animation-delay:200ms]">
                <ButtonLink
                  href="/book"
                  variant="primary"
                  size="lg"
                  iconLeft="Calendar"
                  className="w-full xs:w-auto"
                >
                  Book a free consultation
                </ButtonLink>
                <ButtonLink href="/work" variant="outline" size="lg" className="w-full xs:w-auto">
                  Explore our work
                </ButtonLink>
              </div>
            </div>

            {/* ---- Legend ------------------------------------------------ */}
            <div className="min-w-0 lg:pt-2">
              <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
                <span className="tally font-mono text-graphite">Legend</span>
                <span className="tally font-mono text-faint nums">
                  {String(services.length).padStart(2, "0")} services
                </span>
              </div>

              <ul>
                {services.map((service, index) => (
                  <SlideIn
                    as="li"
                    key={service.slug}
                    from="right"
                    delay={220 + index * 90}
                    className="group border-b border-line"
                  >
                    <a
                      href={service.href}
                      className="flex items-center gap-4 py-4 transition-colors duration-200"
                    >
                      {/* The discipline's layer number and pen colour — the
                          same pairing that appears on its service card and on
                          the services page. */}
                      <span
                        aria-hidden="true"
                        className={cn("tally shrink-0 font-mono", layerFor(service.slug).text)}
                      >
                        {layerFor(service.slug).no}
                      </span>
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center border border-graphite text-white transition-colors duration-200 group-hover:bg-graphite",
                          layerFor(service.slug).fill,
                        )}
                      >
                        <Icon name={service.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 font-display text-lg font-bold uppercase leading-tight text-graphite">
                        {service.shortTitle}
                      </span>
                      <Icon
                        name="ArrowRight"
                        className="h-4 w-4 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-revision"
                      />
                    </a>
                  </SlideIn>
                ))}
              </ul>
            </div>
          </div>

          <TitleBlock
            className="mt-10 lg:mt-12"
            fields={[
              { label: "Drawn by", value: siteConfig.name },
              { label: "Sheet", value: "01 of 10" },
              { label: "Location", value: "Calgary AB" },
              { label: "Revision", value: "2026.08" },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
