"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollIndicatorProps = {
  label?: string;
  className?: string;
  href?: string;
};

export function ScrollIndicator({
  label = "Scroll to Explore",
  className,
  href = "#main-content",
}: ScrollIndicatorProps) {
  const reduced = useReducedMotion();

  return (
    <a
      href={href}
      className={cn(
        "group inline-flex flex-col items-center gap-3 text-ivory/80 transition hover:text-lavender",
        className,
      )}
    >
      <span className="font-label text-[0.65rem] tracking-[0.24em] uppercase">
        {label}
      </span>
      <span className="relative flex h-12 w-6 items-start justify-center rounded-full border border-ivory/35 pt-2">
        <motion.span
          className="h-2 w-1 rounded-full bg-lavender"
          animate={
            reduced
              ? undefined
              : {
                  y: [0, 14, 0],
                  opacity: [1, 0.35, 1],
                }
          }
          transition={
            reduced
              ? undefined
              : {
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      </span>
    </a>
  );
}
