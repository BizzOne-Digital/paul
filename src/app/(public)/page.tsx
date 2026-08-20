import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeIntroduction } from "@/components/home/HomeIntroduction";
import { HomeOkanaganSpotlight } from "@/components/home/HomeOkanaganSpotlight";
import { HomeAcquisitionCategories } from "@/components/home/HomeAcquisitionCategories";
import { HomeBuyerServices } from "@/components/home/HomeBuyerServices";
import { HomeProfessionalResources } from "@/components/home/HomeProfessionalResources";
import { HomeBuyerGuidelines } from "@/components/home/HomeBuyerGuidelines";
import { HomeAcquisitionJourney } from "@/components/home/HomeAcquisitionJourney";
import { HomeDueDiligence } from "@/components/home/HomeDueDiligence";
import { HomeRegions } from "@/components/home/HomeRegions";
import { HomeConsultationCta } from "@/components/home/HomeConsultationCta";
import { HomeInsightsPreview } from "@/components/home/HomeInsightsPreview";
import { HomeFaqPreview } from "@/components/home/HomeFaqPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import {
  getPageBySlug,
  getPublishedFaqs,
  getPublishedPosts,
  getPublishedServices,
  getSection,
} from "@/lib/data";
import { buildHomeHero } from "@/lib/cms-page";
import { getSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("home"),
    getSettings(),
  ]);

  const title =
    page?.seo?.title ||
    settings.defaultSeoTitle ||
    "Want to Buy a BC Winery?";
  const description =
    page?.seo?.description || settings.defaultSeoDescription;
  const keywords =
    page?.seo?.keywords || settings.defaultSeoKeywords || undefined;
  const ogImage = mediaUrl(page?.hero?.backgroundImage);

  return {
    title,
    description,
    keywords: keywords
      ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: { canonical: absoluteUrl("/") },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/"),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function HomePage() {
  const [page, services, posts, faqs, settings] = await Promise.all([
    getPageBySlug("home"),
    getPublishedServices(),
    getPublishedPosts({ limit: 3 }),
    getPublishedFaqs(4),
    getSettings(),
  ]);

  const hero = buildHomeHero(page?.hero, settings);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.websiteName,
    description: settings.companyDescription,
    url: absoluteUrl("/"),
    email: settings.email,
    telephone: settings.phoneTel || settings.phone,
    areaServed: settings.serviceArea,
    image: settings.logo,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero hero={hero} />
      <HomeIntroduction section={getSection(page, "introduction")} />
      <HomeOkanaganSpotlight section={getSection(page, "okanagan-spotlight")} />
      <HomeAcquisitionCategories
        section={getSection(page, "acquisition-categories")}
      />
      <HomeBuyerServices
        section={getSection(page, "buyer-services")}
        services={services}
      />
      <HomeProfessionalResources
        section={getSection(page, "professional-resources")}
      />
      <HomeBuyerGuidelines section={getSection(page, "buyer-guidelines")} />
      <HomeAcquisitionJourney
        section={getSection(page, "acquisition-journey")}
      />
      <HomeDueDiligence section={getSection(page, "due-diligence")} />
      <HomeRegions section={getSection(page, "regions")} />
      <HomeConsultationCta section={getSection(page, "consultation-cta")} />
      <HomeInsightsPreview
        section={getSection(page, "insights-preview")}
        posts={posts}
      />
      <HomeFaqPreview
        section={getSection(page, "faq-preview")}
        faqs={faqs}
      />
      <HomeFinalCta section={getSection(page, "final-cta")} />
    </>
  );
}
