"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { Reveal } from "@/components/ui/Reveal";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";

type GalleryImage = {
  src?: string;
  url?: string;
  alt?: string;
};

type FaqGalleryProps = {
  images: GalleryImage[];
};

/** Simple gallery without ImageFrame/fill edge cases that can break page height. */
export function FaqGallery({ images }: FaqGalleryProps) {
  if (!images?.length) return null;

  return (
    <section className="w-full min-w-0 overflow-x-clip bg-aubergine py-14 sm:py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 md:px-10">
        {images.map((image, i) => {
          const src = imageSrc(image, STOCK.vineyardRows);
          const alt = imageAlt(image, "Wine-country atmosphere");
          return (
            <Reveal key={`${src}-${i}`} delay={Math.min(i * 0.04, 0.2)}>
              <div className="relative aspect-[4/3] overflow-hidden bg-plum/30">
                <CmsImage
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
