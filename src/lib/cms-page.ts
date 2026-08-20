import type { HeroContent } from "@/lib/types";
import type { SiteSettings } from "@/lib/settings";
import { STOCK } from "@/lib/images";

type LooseHero = HeroContent & {
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImageAlt?: string;
  floatingLabel?: string;
};

function imagePath(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "url" in value) {
    return String((value as { url?: string }).url || "");
  }
  return "";
}

/** Build the homepage hero from CMS data — CMS fields always win over defaults. */
export function buildHomeHero(
  cmsHero: LooseHero | undefined,
  settings: Pick<SiteSettings, "headerCtaLabel" | "headerCtaHref">,
): LooseHero {
  const hero = cmsHero || {};
  const backgroundImagePath = imagePath(hero.backgroundImage);

  return {
    ...hero,
    primaryCtaLabel:
      hero.primaryCtaLabel ||
      hero.primaryCta?.label ||
      settings.headerCtaLabel ||
      "Book a Complimentary Call",
    primaryCtaHref:
      hero.primaryCtaHref ||
      hero.primaryCta?.href ||
      settings.headerCtaHref ||
      "/contact",
    secondaryCtaLabel:
      hero.secondaryCtaLabel ||
      hero.secondaryCta?.label ||
      "Explore Buyer Services",
    secondaryCtaHref:
      hero.secondaryCtaHref ||
      hero.secondaryCta?.href ||
      "/services",
    backgroundImage: backgroundImagePath.startsWith("/uploads/")
      ? backgroundImagePath
      : backgroundImagePath || STOCK.heroVineyard,
  };
}
