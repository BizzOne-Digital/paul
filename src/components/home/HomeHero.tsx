"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Award, CalendarDays, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollIndicator } from "@/components/motion/ScrollIndicator";
import type { HeroContent } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { mediaAlt, mediaUrl } from "@/lib/media";

type LooseHero = HeroContent & {
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  floatingLabel?: string;
  backgroundImageAlt?: string;
};

type HomeHeroProps = {
  hero: LooseHero;
};

const FEATURES = [
  { label: "Buyer-Focused", icon: Shield },
  { label: "Professional Guidance", icon: Award },
  { label: "British Columbia Wine Country", icon: MapPin },
] as const;

export function HomeHero({ hero }: HomeHeroProps) {
  const reduced = useReducedMotion();
  // Prefer the cinematic local hero art; CMS can still override later
  const bg = mediaUrl(hero.backgroundImage, STOCK.heroVineyard);
  const alt = mediaAlt(
    hero.backgroundImage,
    hero.backgroundImageAlt ||
      "Sunset over a British Columbia vineyard and winery estate — illustrative atmosphere, not a listed property",
  );
  const primaryLabel =
    hero.primaryCtaLabel ||
    hero.primaryCta?.label ||
    "Book a Complimentary Call";
  const primaryHref = hero.primaryCtaHref || hero.primaryCta?.href || "/contact";
  const secondaryLabel =
    hero.secondaryCtaLabel ||
    hero.secondaryCta?.label ||
    "Explore Buyer Services";
  const secondaryHref =
    hero.secondaryCtaHref || hero.secondaryCta?.href || "/services";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-aubergine text-ivory">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={bg || STOCK.heroVineyard}
            alt={alt}
            fill
            priority
            className="object-cover object-[72%_center]"
            sizes="100vw"
          />
        </motion.div>
        {/* Left readability veil matching reference */}
        <div className="absolute inset-0 bg-gradient-to-r from-aubergine via-aubergine/78 to-aubergine/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-aubergine/90 via-transparent to-aubergine/45" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col px-5 pt-24 sm:px-6 sm:pt-28 md:px-10 lg:px-12">
        <div className="flex flex-1 flex-col justify-center pb-8 pt-6 sm:pb-10 sm:pt-8 lg:max-w-[38rem] lg:pb-6">
          {hero.eyebrow ? (
            <motion.p
              className="font-label mb-4 text-[0.62rem] tracking-[0.22em] text-ivory/90 sm:mb-5 sm:text-[0.68rem] sm:tracking-[0.28em]"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              {hero.eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            className="font-serif text-[2.25rem] leading-[1.08] tracking-tight text-balance uppercase sm:text-5xl md:text-6xl lg:text-[4.15rem]"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.heading || "Want to Buy a BC Winery?"}
          </motion.h1>

          <motion.div
            className="mt-6 h-px w-20 bg-champagne"
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformOrigin: "left" }}
            aria-hidden="true"
          />

          {hero.subheading || hero.body ? (
            <motion.p
              className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/85 sm:mt-6 sm:text-base md:text-lg"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.48 }}
            >
              {hero.subheading || hero.body}
            </motion.p>
          ) : null}

          <motion.div
            className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center md:gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              href={primaryHref}
              variant="magnetic"
              size="lg"
              className="w-full rounded-none sm:w-auto"
            >
              {primaryLabel}
            </Button>
            <Button
              href={secondaryHref}
              variant="outline-light"
              size="lg"
              className="w-full rounded-none sm:w-auto"
            >
              {secondaryLabel}
            </Button>
          </motion.div>

          <motion.p
            className="font-label mt-6 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-lavender"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            <CalendarDays className="h-3.5 w-3.5 text-champagne" aria-hidden />
            Initial consultation is complimentary
          </motion.p>

          <motion.div
            className="mt-10"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ScrollIndicator href="#introduction" className="text-champagne" />
          </motion.div>
        </div>

        <div className="mt-auto border-t border-champagne/35">
          <ul className="grid divide-y divide-champagne/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.li
                  key={feature.label}
                  className="flex items-center gap-3 px-1 py-4 sm:px-5 sm:py-5"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.85 + index * 0.08 }}
                >
                  <Icon className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                  <span className="font-label text-[0.62rem] tracking-[0.18em] text-ivory/90 uppercase md:text-[0.68rem]">
                    {feature.label}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
