"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { STOCK } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useIntroGate } from "@/components/motion/IntroGate";

const GRAPES = [
  { cx: 42, cy: 38, fill: "#32173D" },
  { cx: 78, cy: 38, fill: "#741F45" },
  { cx: 28, cy: 68, fill: "#211328" },
  { cx: 92, cy: 68, fill: "#B42A61" },
  { cx: 42, cy: 90, fill: "#B9A7D8" },
  { cx: 78, cy: 90, fill: "#741F45" },
  { cx: 60, cy: 112, fill: "#4A102D" },
] as const;

type IntroAnimationProps = {
  websiteName: string;
  tagline?: string;
};

export function IntroAnimation({
  websiteName,
  tagline = "Guidance for BC Winery Buyers",
}: IntroAnimationProps) {
  const reduced = useReducedMotion();
  const { ready, showIntro, completeIntro } = useIntroGate();

  useEffect(() => {
    if (!showIntro || reduced) return;
    const timer = window.setTimeout(() => completeIntro(), 3800);
    return () => window.clearTimeout(timer);
  }, [showIntro, reduced, completeIntro]);

  // Solid cover until hydrated so the site never flashes first
  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-aubergine"
        aria-hidden="true"
      />
    );
  }

  return (
    <AnimatePresence>
      {showIntro ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-aubergine"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] },
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Website introduction"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: [0, 0, 0.55, 0.9],
              scale: [1.08, 1.08, 1.02, 1],
            }}
            transition={{
              duration: 3.6,
              times: [0, 0.62, 0.82, 1],
              ease: "easeOut",
            }}
          >
            <Image
              src={STOCK.heroVineyard}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-aubergine/55" />
          </motion.div>

          <svg
            className="pointer-events-none absolute top-[16%] left-1/2 h-20 w-[min(80vw,36rem)] -translate-x-1/2 sm:h-24"
            viewBox="0 0 600 40"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M10 28 C 120 8, 220 36, 300 18 S 500 8, 590 22"
              stroke="#B5965A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>

          <div className="relative z-10 flex max-w-[90vw] flex-col items-center px-5 text-center">
            <svg
              viewBox="0 0 120 140"
              className="h-24 w-20 sm:h-28 sm:w-24 md:h-36 md:w-32"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M48 28 C40 18 34 12 28 10 C38 8 52 14 58 24"
                stroke="#F7F3EC"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              />

              {GRAPES.map((grape, index) => (
                <motion.circle
                  key={`${grape.cx}-${grape.cy}`}
                  cx={grape.cx}
                  cy={grape.cy}
                  r="14"
                  fill={grape.fill}
                  stroke="#181619"
                  strokeWidth="3.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.35 + index * 0.12,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: `${grape.cx}px ${grape.cy}px` }}
                />
              ))}

              <motion.path
                d="M48 78 L60 66 L72 78 V90 H48 Z"
                fill="#741F45"
                stroke="#181619"
                strokeWidth="3"
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.35, duration: 0.35 }}
                style={{ transformOrigin: "60px 78px" }}
              />
              <motion.rect
                x="56"
                y="82"
                width="8"
                height="8"
                fill="#F7F3EC"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.25 }}
              />
            </svg>

            <motion.p
              className="font-serif mt-6 text-2xl text-ivory sm:mt-8 sm:text-3xl md:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.45 }}
            >
              {websiteName}
            </motion.p>

            <motion.p
              className="font-label mt-3 max-w-[18rem] text-[0.62rem] tracking-[0.22em] text-lavender uppercase sm:max-w-none sm:text-[0.68rem] sm:tracking-[0.24em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.05, duration: 0.4 }}
            >
              {tagline}
            </motion.p>
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-lavender/35 to-transparent"
            initial={{ x: "-40%", opacity: 0 }}
            animate={{ x: "140%", opacity: [0, 1, 0] }}
            transition={{ delay: 2.35, duration: 0.85, ease: "easeInOut" }}
          />

          <button
            type="button"
            onClick={completeIntro}
            className={cn(
              "font-label absolute right-4 bottom-4 z-20 border border-ivory/25 px-4 py-2 text-[0.62rem] tracking-[0.18em] text-ivory/80 uppercase transition hover:border-lavender hover:text-lavender sm:right-6 sm:bottom-6 md:right-10 md:bottom-10",
            )}
          >
            Skip Intro
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
