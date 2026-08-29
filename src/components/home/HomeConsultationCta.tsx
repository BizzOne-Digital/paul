import { CmsImage } from "@/components/ui/CmsImage";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { mediaAlt, mediaUrl } from "@/lib/media";

type HomeConsultationCtaProps = {
  section?: PageSection & { backgroundImageAlt?: string };
};

export function HomeConsultationCta({ section }: HomeConsultationCtaProps) {
  if (!section) return null;

  return (
    <section className="relative overflow-x-clip py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0">
        <CmsImage
          src={mediaUrl(section.backgroundImage, STOCK.estateWinery)}
          alt={mediaAlt(
            section.backgroundImage,
            section.backgroundImageAlt ||
              "Winery estate surrounded by vines — illustrative imagery",
          )}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-aubergine/78" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center text-ivory sm:px-6 md:px-10">
        <Reveal>
          <h2 className="font-serif text-[1.85rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {section.heading || "Start with a Complimentary Conversation"}
          </h2>
          {section.body ? (
            <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-ivory/80 sm:mt-6 sm:text-base md:text-lg">
              {section.body}
            </p>
          ) : null}
          {section.ctaLabel ? (
            <div className="mt-8 sm:mt-10">
              <Button
                href={section.ctaHref || "/contact"}
                variant="magnetic"
                size="lg"
                className="w-full sm:w-auto"
              >
                {section.ctaLabel}
              </Button>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
