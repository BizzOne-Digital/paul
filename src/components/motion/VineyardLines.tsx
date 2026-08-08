"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type VineyardLinesProps = {
  className?: string;
  tone?: "gold" | "lavender" | "ivory";
  density?: number;
};

const strokeMap = {
  gold: "rgba(181,150,90,0.35)",
  lavender: "rgba(185,167,216,0.4)",
  ivory: "rgba(247,243,236,0.28)",
};

export default function VineyardLines({
  className,
  tone = "gold",
  density = 7,
}: VineyardLinesProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const lines = Array.from({ length: density }, (_, i) => i);

  useEffect(() => {
    if (reduced || !ref.current) return;

    const paths = ref.current.querySelectorAll("path");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paths,
        { strokeDashoffset: 420 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 240"
      className={cn("pointer-events-none h-full w-full", className)}
      aria-hidden="true"
      fill="none"
    >
      {lines.map((line) => {
        const y = 28 + line * 28;
        const curve = 40 + (line % 3) * 18;
        return (
          <path
            key={line}
            d={`M0 ${y} C 220 ${y - curve}, 420 ${y + curve}, 800 ${y}`}
            stroke={strokeMap[tone]}
            strokeWidth="1.25"
            strokeDasharray="420"
            strokeDashoffset={reduced ? 0 : 420}
          />
        );
      })}
    </svg>
  );
}
