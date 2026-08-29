"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { motion, useReducedMotion } from "framer-motion";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ImageFrameProps = Omit<ImageProps, "alt" | "fill" | "width" | "height"> & {
  alt: string;
  src: string;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  zoomOnHover?: boolean;
  width?: number;
  height?: number;
};

export function ImageFrame({
  alt,
  src,
  className,
  frameClassName,
  priority,
  zoomOnHover = true,
  width,
  height,
  sizes = "100vw",
  ...imageProps
}: ImageFrameProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "relative isolate overflow-hidden bg-plum/15",
        frameClassName,
      )}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "relative h-full min-h-[12rem] w-full overflow-hidden",
          zoomOnHover && !reduced && "group",
        )}
      >
        <CmsImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-[1.4s] ease-out",
            zoomOnHover && !reduced && "group-hover:scale-[1.04]",
            className,
          )}
          {...imageProps}
        />
        {/* Preserve intended ratio when parent doesn't set aspect */}
        {width && height && !frameClassName?.includes("aspect-") ? (
          <span
            aria-hidden
            className="block w-full"
            style={{ paddingBottom: `${(height / width) * 100}%` }}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
