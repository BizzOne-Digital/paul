import { CmsImage } from "@/components/ui/CmsImage";
import { Button } from "@/components/ui/Button";
import { imageAlt, imageSrc, type ImageLike, STOCK } from "@/lib/images";
import { cn } from "@/lib/utils";

type CinematicHeroProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  backgroundImage?: ImageLike;
  backgroundImageAlt?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  minHeightClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

export function CinematicHero({
  eyebrow,
  heading,
  subheading,
  backgroundImage,
  backgroundImageAlt,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  minHeightClassName = "min-h-[60vh]",
  className,
  children,
}: CinematicHeroProps) {
  const src = imageSrc(backgroundImage, STOCK.aerialVineyard);
  const alt = backgroundImageAlt || imageAlt(backgroundImage, heading);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-aubergine text-ivory",
        minHeightClassName,
        className,
      )}
    >
      <CmsImage
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover opacity-50"
        sizes="100vw"
      />
      <div className="lavender-veil absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-aubergine via-aubergine/20 to-aubergine/50" />
      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 md:px-10",
          minHeightClassName,
        )}
      >
        {eyebrow ? (
          <p className="font-label mb-3 text-[0.62rem] tracking-[0.18em] text-lavender sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.22em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif max-w-3xl text-[2.15rem] leading-[1.1] sm:text-5xl md:text-6xl">
          {heading}
        </h1>
        {subheading ? (
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-ivory/80 sm:mt-6 sm:text-base md:text-lg">
            {subheading}
          </p>
        ) : null}
        {(primaryCtaLabel || secondaryCtaLabel) && (
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            {primaryCtaLabel ? (
              <Button
                href={primaryCtaHref || "/contact"}
                variant="magnetic"
                size="lg"
                className="w-full sm:w-auto"
              >
                {primaryCtaLabel}
              </Button>
            ) : null}
            {secondaryCtaLabel ? (
              <Button
                href={secondaryCtaHref || "/services"}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                {secondaryCtaLabel}
              </Button>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
