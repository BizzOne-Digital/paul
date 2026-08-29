"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import type { PageSection } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { mediaAlt, mediaUrl } from "@/lib/media";

type Card = {
  title?: string;
  description?: string;
  body?: string;
  image?: unknown;
  imageAlt?: string;
};

type HomeRegionsProps = {
  section?: PageSection & { cards?: Card[] };
};

const REGION_FALLBACKS = [
  STOCK.duskVineyard,
  STOCK.hillside,
  STOCK.goldenHour,
  STOCK.lakeMountains,
  STOCK.architecture,
  STOCK.vineyardRows,
] as const;

export function HomeRegions({ section }: HomeRegionsProps) {
  const reduced = useReducedMotion();
  if (!section) return null;
  const cards = section.cards || [];

  return (
    <section className="relative overflow-x-clip bg-ivory py-14 sm:py-20 md:py-28">
      <div className="grape-pattern absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow || "British Columbia"}
            title={section.heading || "Regions Buyers May Explore"}
            description={section.subheading || section.body}
          />
        </Reveal>
      </div>

      {cards.length > 0 ? (
        <div className="relative mt-10">
          <Marquee items={cards.map((c) => c.title || "").filter(Boolean)} />
        </div>
      ) : null}

      <div className="relative mx-auto mt-10 grid w-full max-w-7xl gap-4 px-5 sm:mt-12 sm:grid-cols-2 sm:gap-5 sm:px-6 lg:grid-cols-3 md:px-10 md:gap-6">
        {cards.map((card, index) => {
          const src = mediaUrl(
            card.image,
            REGION_FALLBACKS[index % REGION_FALLBACKS.length],
          );
          const alt = mediaAlt(
            card.image,
            card.imageAlt || card.title || "British Columbia wine region",
          );

          return (
            <motion.article
              key={card.title || index}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.06, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group overflow-hidden border border-aubergine/10 bg-white/70 shadow-[0_18px_50px_-36px_rgba(33,19,40,0.55)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-plum/20">
                <CmsImage
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-[1.35s] ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aubergine/55 via-aubergine/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-90" />
                <p className="font-label absolute bottom-4 left-4 text-[0.62rem] tracking-[0.2em] text-lavender">
                  Region {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="font-serif text-2xl text-aubergine md:text-[1.65rem]">
                  {card.title}
                </h3>
                {card.description || card.body ? (
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                    {card.description || card.body}
                  </p>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
