"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { useEffect, useRef } from "react";
import type { ImageProps } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ParallaxImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  className?: string;
  frameClassName?: string;
  intensity?: number;
};

export default function ParallaxImage({
  alt,
  className,
  frameClassName,
  intensity = 18,
  ...imageProps
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !frameRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -intensity / 2 },
        {
          yPercent: intensity / 2,
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, frameRef);

    return () => ctx.revert();
  }, [intensity, reduced]);

  return (
    <div
      ref={frameRef}
      className={cn("relative overflow-hidden", frameClassName)}
    >
      <div ref={imageRef} className="relative h-[115%] w-full -translate-y-[7.5%]">
        <CmsImage
          alt={alt}
          className={cn("h-full w-full object-cover", className)}
          {...imageProps}
        />
      </div>
    </div>
  );
}
