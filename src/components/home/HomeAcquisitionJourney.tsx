"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";

type Card = {
  title?: string;
  description?: string;
  body?: string;
};

type HomeAcquisitionJourneyProps = {
  section?: PageSection & { cards?: Card[] };
};

export function HomeAcquisitionJourney({
  section,
}: HomeAcquisitionJourneyProps) {
  const reduced = useReducedMotion();
  if (!section) return null;
  const cards = section.cards || [];

  return (
    <section className="relative overflow-x-clip bg-ivory pb-8 pt-16 sm:pb-10 sm:pt-20 md:pb-12 md:pt-28">
      <div className="vineyard-lines absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.heading || "From First Interest to Informed Decision"}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <ol className="relative mx-auto mt-14 max-w-4xl space-y-0">
          <div
            className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-champagne via-lavender to-burgundy/40 md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />
          {cards.map((card, index) => {
            const odd = index % 2 === 0;
            return (
              <li key={card.title || index} className="relative py-5 md:py-6">
                <Reveal direction={odd ? "left" : "right"} delay={index * 0.04}>
                  <div
                    className={`grid items-start gap-6 md:grid-cols-2 ${
                      odd ? "" : "md:[&>*:first-child]:order-2"
                    }`}
                  >
                    <div
                      className={`pl-12 md:pl-0 ${odd ? "md:pr-16 md:text-right" : "md:pl-16"}`}
                    >
                      <p className="font-label text-[0.65rem] tracking-[0.22em] text-burgundy">
                        Step {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif mt-2 text-2xl text-aubergine md:text-3xl">
                        {card.title}
                      </h3>
                      {card.description || card.body ? (
                        <p className="mt-3 text-sm leading-relaxed text-charcoal/70 md:text-base">
                          {card.description || card.body}
                        </p>
                      ) : null}
                    </div>
                    <div className="hidden md:block" />
                  </div>
                </Reveal>
                <motion.span
                  className="absolute left-3 top-10 h-4 w-4 rounded-full border border-champagne bg-ivory md:left-1/2 md:-translate-x-1/2"
                  initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
