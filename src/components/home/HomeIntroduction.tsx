"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { mediaAlt, mediaUrl } from "@/lib/media";

type LooseSection = PageSection & {
  primaryImageAlt?: string;
  secondaryImageAlt?: string;
  cards?: Array<{
    title?: string;
    image?: unknown;
    imageAlt?: string;
  }>;
};

type HomeIntroductionProps = {
  section?: LooseSection;
};

export function HomeIntroduction({ section }: HomeIntroductionProps) {
  const reduced = useReducedMotion();
  if (!section) return null;

  const cards = section.cards || [];

  const gallery = [
    {
      title: "Vineyard Landscape",
      src: mediaUrl(section.primaryImage, STOCK.vineyardRows),
      alt: mediaAlt(
        section.primaryImage,
        section.primaryImageAlt || "Vineyard landscape with orderly rows",
      ),
      className: "col-span-7 aspect-[4/5]",
    },
    {
      title: "Production",
      src: mediaUrl(section.secondaryImage, STOCK.production),
      alt: mediaAlt(
        section.secondaryImage,
        section.secondaryImageAlt || "Winery production facility",
      ),
      className: "col-span-5 aspect-[3/4] mt-10 md:mt-16",
    },
    {
      title: cards[0]?.title || "Barrel Cellar",
      src: mediaUrl(cards[0]?.image, STOCK.barrelCellar),
      alt: mediaAlt(
        cards[0]?.image,
        cards[0]?.imageAlt || "Wine barrel cellar atmosphere",
      ),
      className: "col-span-5 aspect-[5/4] -mt-6 md:-mt-10",
    },
    {
      title: cards[1]?.title || "Hospitality Space",
      src: mediaUrl(cards[1]?.image, STOCK.tastingRoom),
      alt: mediaAlt(
        cards[1]?.image,
        cards[1]?.imageAlt || "Tasting room and hospitality setting",
      ),
      className: "col-span-7 aspect-[16/11] mt-4",
    },
  ];

  return (
    <section
      id="introduction"
      className="relative overflow-x-clip overflow-y-visible bg-[#f8f5f0] py-14 sm:py-20 md:py-28"
    >
      <div
        className="grape-pattern absolute inset-0 opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-start gap-10 px-5 sm:gap-12 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionHeading
              eyebrow={section.eyebrow || "A More Informed Path to Ownership"}
              title={
                section.heading ||
                "Buying a Winery Is More Than Buying Property"
              }
              description={undefined}
              className="[&_p.font-label]:!text-champagne"
            />
            {section.body ? (
              <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal/75 md:text-lg">
                {section.body.split(/\n\n+/).map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            {gallery.map((item, index) => (
              <motion.figure
                key={`${item.title}-${index}`}
                className={item.className}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.75,
                  delay: Math.min(index * 0.08, 0.32),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="group relative h-full min-h-[12rem] w-full overflow-hidden bg-plum/15 shadow-[0_18px_50px_-32px_rgba(33,19,40,0.55)]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-[1.35s] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <figcaption className="font-label mt-3 text-[0.62rem] tracking-[0.2em] text-aubergine/65 uppercase">
                  {item.title}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
