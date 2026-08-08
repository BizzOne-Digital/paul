"use client";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MarqueeProps = {
  items: string[];
  className?: string;
  speed?: number;
  separator?: string;
};

export function Marquee({
  items,
  className,
  speed = 55,
  separator = "·",
}: MarqueeProps) {
  const reduced = usePrefersReducedMotion();
  const sequence = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden border-y border-aubergine/10 py-4",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex w-max max-w-none gap-8 whitespace-nowrap will-change-transform",
          !reduced && "animate-marquee",
        )}
        style={
          reduced
            ? undefined
            : ({
                ["--marquee-duration" as string]: `${speed}s`,
              } as React.CSSProperties)
        }
      >
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-label flex items-center gap-8 text-[0.7rem] tracking-[0.28em] text-aubergine/70"
          >
            {item}
            <span className="text-champagne">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
