"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";

type Card = {
  title?: string;
  description?: string;
  body?: string;
  value?: string;
  meta?: string;
  key?: string;
};

type HomeAcquisitionCategoriesProps = {
  section?: PageSection & { cards?: Card[] };
};

export function HomeAcquisitionCategories({
  section,
}: HomeAcquisitionCategoriesProps) {
  const reduced = useReducedMotion();
  if (!section) return null;
  const cards = section.cards || [];

  return (
    <section className="w-full min-w-0 overflow-x-clip bg-aubergine py-16 text-ivory sm:py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.heading || "What Are You Looking to Acquire?"}
            description={section.subheading || section.body}
            tone="light"
          />
        </Reveal>

        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {cards.map((card, index) => {
            const value = card.value || card.meta || card.key || "";
            const href = `/contact?acquisitionType=${encodeURIComponent(value)}`;
            return (
              <Reveal key={value || card.title || index} delay={index * 0.05}>
                <Link href={href} className="group block h-full">
                  <motion.article
                    className="relative flex h-full flex-col justify-between overflow-hidden border border-lavender/20 bg-plum/40 p-5 transition-colors duration-300 hover:border-lavender/50 hover:bg-plum/70 sm:p-7"
                    whileHover={reduced ? undefined : { y: -4 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div>
                      <p className="font-label text-[0.65rem] tracking-[0.22em] text-champagne">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif mt-4 text-2xl text-ivory md:text-[1.7rem]">
                        {card.title}
                      </h3>
                      {card.description || card.body ? (
                        <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                          {card.description || card.body}
                        </p>
                      ) : null}
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 font-label text-[0.65rem] tracking-[0.18em] text-lavender transition-colors group-hover:text-lavender-soft">
                      Begin inquiry
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </motion.article>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
