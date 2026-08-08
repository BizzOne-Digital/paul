import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";

type LooseSection = PageSection & {
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

type HomeFinalCtaProps = {
  section?: LooseSection;
};

export function HomeFinalCta({ section }: HomeFinalCtaProps) {
  if (!section) return null;

  const primaryLabel = section.primaryCtaLabel || section.ctaLabel;
  const primaryHref = section.primaryCtaHref || section.ctaHref || "/contact";
  const secondaryLabel = section.secondaryCtaLabel;
  const secondaryHref = section.secondaryCtaHref || "/contact";

  return (
    <section className="relative overflow-x-clip py-16 sm:py-24 md:py-36">
      <div className="aubergine-gradient absolute inset-0" />
      <div className="grape-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-3xl px-5 text-center text-ivory sm:px-6 md:px-10">
        <Reveal>
          <h2 className="font-serif text-[1.85rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {section.heading ||
              "Your BC Winery Search Starts with the Right Questions"}
          </h2>
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {primaryLabel ? (
              <Button
                href={primaryHref}
                variant="magnetic"
                size="lg"
                className="w-full sm:w-auto"
              >
                {primaryLabel}
              </Button>
            ) : null}
            {secondaryLabel ? (
              <Button
                href={secondaryHref}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
