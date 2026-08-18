import type { Metadata } from "next";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { FaqClient } from "@/components/faq/FaqClient";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { FaqGallery } from "@/components/faq/FaqGallery";
import { FaqLocationSection } from "@/components/faq/FaqLocationSection";
import { OkanaganGuide } from "@/components/faq/OkanaganGuide";
import { getPageBySlug, getPublishedFaqs, getSection } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("faq");
  const title = page?.seo?.title || "FAQ";
  const description =
    page?.seo?.description ||
    "Answers about complimentary consultations, pricing approach, due diligence, and preparing for a winery acquisition conversation.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/faq") },
    openGraph: { title, description, url: absoluteUrl("/faq") },
  };
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([
    getPageBySlug("faq"),
    getPublishedFaqs(),
  ]);

  const hero = page?.hero;
  const intro = getSection(page, "introduction");
  const readiness = getSection(page, "buyer-readiness");
  const advisors = getSection(page, "advisors");
  const gallery = getSection(page, "gallery") as
    | (ReturnType<typeof getSection> & {
        images?: Array<{ src?: string; url?: string; alt?: string }>;
      })
    | undefined;
  const cta = getSection(page, "consultation-cta");

  return (
    <>
      <CinematicHero
        eyebrow={hero?.eyebrow}
        heading={hero?.heading || "Frequently Asked Questions"}
        subheading={hero?.subheading}
        backgroundImage={hero?.backgroundImage || STOCK.documents}
        backgroundImageAlt={
          hero?.backgroundImageAlt ||
          imageAlt(hero?.backgroundImage, "Acquisition materials")
        }
      />

      {intro ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title={intro.heading || "Clarity Before Commitment"}
                description={intro.body}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      <FaqLocationSection
        heading={
          (getSection(page, "location") as { heading?: string } | undefined)
            ?.heading
        }
        body={
          (getSection(page, "location") as { body?: string } | undefined)?.body
        }
      />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 md:px-10">
          <FaqClient
            faqs={faqs.map((f) => ({
              id: String(f._id),
              question: f.question,
              answer: f.answer,
              category: f.category,
            }))}
          />
        </div>
      </section>

      <OkanaganGuide />

      {readiness ? (
        <section className="bg-plum/5 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                title={readiness.heading || "Buyer Readiness"}
                description={readiness.body}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ImageFrame
                src={imageSrc(readiness.primaryImage, STOCK.vineyardRows)}
                alt={
                  (readiness as { primaryImageAlt?: string }).primaryImageAlt ||
                  imageAlt(readiness.primaryImage, "Quiet vineyard rows")
                }
                width={900}
                height={700}
                className="aspect-[4/3] w-full"
                frameClassName="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {advisors ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="order-2 lg:order-1">
              <ImageFrame
                src={imageSrc(advisors.primaryImage, STOCK.meeting)}
                alt={
                  (advisors as { primaryImageAlt?: string }).primaryImageAlt ||
                  imageAlt(advisors.primaryImage, "Professional advisors")
                }
                width={900}
                height={700}
                className="aspect-[4/3] w-full"
                frameClassName="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>
            <Reveal delay={0.1} className="order-1 lg:order-2">
              <SectionHeading
                title={
                  advisors.heading || "Working with Professional Advisors"
                }
                description={advisors.body}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {gallery?.images?.length ? (
        <FaqGallery images={gallery.images} />
      ) : null}

      {cta ? (
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <h2 className="font-serif text-4xl text-aubergine md:text-5xl">
              {cta.heading || "Still Have Questions?"}
            </h2>
            {cta.body ? (
              <p className="mt-5 text-charcoal/75">{cta.body}</p>
            ) : null}
            <div className="mt-8">
              <Button
                href={cta.ctaHref || "/contact"}
                variant="magnetic"
                size="lg"
              >
                {cta.ctaLabel || "Book a Complimentary Call"}
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
