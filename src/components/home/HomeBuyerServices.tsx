"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesHorizontal } from "@/components/services/ServicesHorizontal";
import type { PageSection } from "@/lib/types";
import type { PlainService } from "@/lib/data";

type HomeBuyerServicesProps = {
  section?: PageSection;
  services: PlainService[];
};

export function HomeBuyerServices({
  section,
  services,
}: HomeBuyerServicesProps) {
  if (!section || services.length === 0) return null;

  return (
    // Do not use overflow-hidden here — it breaks GSAP pin / horizontal scroll
    <section className="relative w-full min-w-0 bg-ivory py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={
                section.heading ||
                "Guidance Tailored to Your Acquisition Stage"
              }
              description={section.subheading}
            />
            {section.ctaLabel ? (
              <Button
                href={section.ctaHref || "/services"}
                variant="secondary"
                className="w-full shrink-0 sm:w-auto"
              >
                {section.ctaLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>

      <div className="mt-12 lg:mt-10">
        <ServicesHorizontal services={services} />
      </div>
    </section>
  );
}
