"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OkanaganMap } from "@/components/maps/OkanaganMap";
import type { PageSection } from "@/lib/types";

type HomeOkanaganSpotlightProps = {
  section?: PageSection;
};

export function HomeOkanaganSpotlight({ section }: HomeOkanaganSpotlightProps) {
  if (!section) return null;

  const subRegions =
    (section.items as string[] | undefined) ||
    (section.lists?.[0] as string[] | undefined) ||
    [];

  return (
    <section
      id="okanagan"
      className="relative w-full min-w-0 overflow-x-clip bg-aubergine py-16 text-ivory sm:py-24 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] vineyard-lines"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:gap-12 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow || "Key Wine Region"}
            title={
              section.heading ||
              "The Okanagan Valley — BC’s Premier Winery Region"
            }
            description={section.subheading || section.body}
            tone="light"
          />
          {subRegions.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {subRegions.map((region) => (
                <span
                  key={region}
                  className="font-label border border-lavender/35 bg-lavender/10 px-3 py-1.5 text-[0.58rem] tracking-[0.14em] text-lavender uppercase"
                >
                  {region}
                </span>
              ))}
            </div>
          ) : null}
          <Link
            href="/faq#where-are-we"
            className="font-label mt-8 inline-flex items-center gap-2 border-b border-champagne/50 pb-0.5 text-[0.65rem] tracking-[0.18em] text-champagne transition hover:border-champagne hover:text-ivory"
          >
            View map &amp; region guide →
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <OkanaganMap className="shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)]" />
        </Reveal>
      </div>
    </section>
  );
}
