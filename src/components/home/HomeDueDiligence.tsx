"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { PageSection } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { asTextList, mediaAlt, mediaUrl } from "@/lib/media";

type HomeDueDiligenceProps = {
  section?: PageSection & {
    items?: string[];
    primaryImageAlt?: string;
  };
};

export function HomeDueDiligence({ section }: HomeDueDiligenceProps) {
  const reduced = useReducedMotion();
  if (!section) return null;

  const items = asTextList(section.items || section.lists);
  const imageSrc = mediaUrl(section.primaryImage, STOCK.documents);
  const imageAltText = mediaAlt(
    section.primaryImage,
    section.primaryImageAlt || "Professional document review at a desk",
  );

  return (
    <section className="relative overflow-hidden bg-aubergine text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] vineyard-lines"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-[18rem] w-[18rem] translate-x-1/3 rounded-full bg-lavender/20 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[14rem] w-[14rem] -translate-x-1/3 rounded-full bg-burgundy/30 blur-3xl sm:h-[22rem] sm:w-[22rem]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow={section.eyebrow || "Evaluation Themes"}
                title={section.heading || "What Buyers May Need to Evaluate"}
                description={section.subheading || section.body}
                tone="light"
              />
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="relative overflow-hidden border border-white/10 bg-white/5">
              <div className="grid md:grid-cols-12">
                <div className="relative aspect-[16/11] md:col-span-5 md:aspect-auto md:min-h-[18rem]">
                  <ImageFrame
                    src={imageSrc}
                    alt={imageAltText}
                    frameClassName="absolute inset-0 h-full w-full"
                    sizes="(max-width: 768px) 100vw, 30vw"
                    zoomOnHover
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-aubergine/55 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-aubergine/40" />
                </div>
                <div className="flex flex-col justify-between gap-6 p-6 md:col-span-7 md:p-8">
                  <p className="max-w-md text-sm leading-relaxed text-ivory/75 md:text-base">
                    Every opportunity is different. Use these themes to organise
                    questions before deeper specialist review.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/contact"
                      className="font-label inline-flex items-center border border-lavender/50 bg-lavender/15 px-5 py-3 text-[0.68rem] tracking-[0.18em] text-lavender transition hover:bg-lavender hover:text-aubergine"
                    >
                      Discuss Your Priorities
                    </Link>
                    <span className="font-label text-[0.62rem] tracking-[0.18em] text-champagne/80">
                      {String(items.length).padStart(2, "0")} themes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.li
              key={item}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.04, 0.35),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden border border-white/10 bg-white/[0.04] p-5 transition duration-500 hover:border-lavender/40 hover:bg-white/[0.08] md:p-6"
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-champagne via-lavender to-transparent transition duration-500 group-hover:scale-x-100" />
              <div className="flex items-start gap-4">
                <span className="font-label mt-1 text-[0.62rem] tracking-[0.2em] text-champagne">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-serif text-xl leading-snug text-ivory transition group-hover:text-lavender-soft md:text-[1.35rem]">
                  {item}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-3xl border-l border-champagne/50 pl-5 text-sm leading-relaxed text-ivory/65 md:mt-12 md:text-[0.95rem]">
            Specialist legal, tax, accounting, appraisal, agricultural,
            environmental, licensing, and brokerage advice should be obtained
            from appropriately qualified professionals.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
