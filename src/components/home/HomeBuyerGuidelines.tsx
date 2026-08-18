"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { PageSection } from "@/lib/types";

type GuidelineRow = {
  title?: string;
  description?: string;
  body?: string;
  meta?: string;
};

type HomeBuyerGuidelinesProps = {
  section?: PageSection & { cards?: GuidelineRow[] };
};

export function HomeBuyerGuidelines({ section }: HomeBuyerGuidelinesProps) {
  if (!section) return null;

  const rows = section.cards || [];

  return (
      <section
        id="buyer-guidelines"
        className="relative w-full min-w-0 overflow-x-clip bg-ivory py-16 sm:py-24 md:py-28"
      >
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow || "Buyer Guidelines"}
            title={
              section.heading ||
              "Production Capacity & Vineyard Acreage Guidelines"
            }
            description={section.subheading || section.body}
          />
        </Reveal>

        {rows.length > 0 ? (
          <Reveal delay={0.08} className="mt-10 overflow-x-auto sm:mt-12">
            <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-aubergine/20 bg-plum/5">
                  <th className="font-label px-4 py-3 text-[0.62rem] tracking-[0.16em] text-aubergine uppercase sm:px-6">
                    Annual Production
                  </th>
                  <th className="font-label px-4 py-3 text-[0.62rem] tracking-[0.16em] text-aubergine uppercase sm:px-6">
                    Vineyard Acres
                    <span className="mt-0.5 block font-sans text-[0.65rem] font-normal normal-case tracking-normal text-charcoal/55">
                      Owned or leased · mature vines
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.title || index}
                    className="border-b border-aubergine/10 transition hover:bg-plum/[0.04]"
                  >
                    <td className="font-serif px-4 py-4 text-lg text-aubergine sm:px-6 sm:text-xl">
                      {row.title}
                    </td>
                    <td className="px-4 py-4 text-charcoal/75 sm:px-6">
                      {row.description || row.body || row.meta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : null}

        <Reveal delay={0.12}>
          <p className="mt-8 max-w-3xl border-l-2 border-champagne/60 pl-5 text-sm leading-relaxed text-charcoal/70 sm:mt-10">
            These figures are guidelines only and assume well cared-for mature
            vineyards with limited pre-harvest fruit dropping. Certain varietals
            may produce lower yields. Purchased grapes are excluded from these
            acreage assumptions. Recent yield records and inspection by a
            qualified viticulturist are essential.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={section.ctaHref || "/contact"} variant="magnetic">
              {section.ctaLabel || "Discuss Expected Yields"}
            </Button>
            <Link
              href="/faq#buyer-guidelines"
              className="font-label inline-flex items-center self-center text-[0.65rem] tracking-[0.16em] text-burgundy uppercase transition hover:text-aubergine"
            >
              Read full guidelines →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
