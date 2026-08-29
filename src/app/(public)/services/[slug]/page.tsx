import type { Metadata } from "next";
import { CmsImage } from "@/components/ui/CmsImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { getPublishedServices, getServiceBySlug } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };

  const title = service.seo?.title || service.name;
  const description =
    service.seo?.description || service.shortDescription;
  const ogImage = imageSrc(service.listingImage);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/services/${service.slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/services/${service.slug}`),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedServices(),
    getSettings(),
  ]);

  if (!service) notFound();

  const detail = service.detailPage || {};
  const hero = detail.hero || {};
  const relatedSlugs = detail.relatedServiceSlugs || [];
  const related = (
    relatedSlugs.length
      ? allServices.filter((s) => relatedSlugs.includes(s.slug))
      : allServices.filter((s) => s.slug !== service.slug)
  ).slice(0, 3);

  const audienceText = Array.isArray(detail.audience)
    ? detail.audience.join(" ")
    : detail.audience || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    provider: {
      "@type": "ProfessionalService",
      name: settings.websiteName,
      url: absoluteUrl("/"),
    },
    areaServed: settings.serviceArea,
    url: absoluteUrl(`/services/${service.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CinematicHero
        eyebrow={hero.eyebrow || "Buyer Service"}
        heading={hero.heading || service.name}
        subheading={hero.subheading || service.shortDescription}
        backgroundImage={
          hero.backgroundImage || service.listingImage || STOCK.vineyardRows
        }
        backgroundImageAlt={
          hero.backgroundImageAlt ||
          service.listingImageAlt ||
          imageAlt(service.listingImage, service.name)
        }
        minHeightClassName="min-h-[70vh]"
      />

      {detail.overview ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading title="Overview" description={detail.overview} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {audienceText ? (
        <section className="bg-plum/5 py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title="Who This Is For"
                description={audienceText}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {detail.keyQuestions?.length ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading title="Key Questions We Explore" />
            </Reveal>
            <ol className="mt-10 space-y-4">
              {detail.keyQuestions.map((q, i) => (
                <Reveal key={q} delay={i * 0.04}>
                  <li className="border-b border-aubergine/10 py-4 font-serif text-xl text-aubergine md:text-2xl">
                    <span className="font-label mr-3 text-[0.65rem] text-champagne">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {q}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {detail.includedItems?.length ? (
        <section className="bg-aubergine py-20 text-ivory md:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading title="Themes We May Cover" tone="light" />
            </Reveal>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {detail.includedItems.map((item) => (
                <li
                  key={item}
                  className="border border-lavender/20 px-5 py-4 text-sm text-ivory/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {detail.processSteps?.length ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading title="How Engagement Typically Unfolds" />
            </Reveal>
            <ol className="mt-12 grid gap-8 md:grid-cols-2">
              {detail.processSteps.map((step, i) => (
                <Reveal key={step.title || i} delay={i * 0.05}>
                  <li>
                    <p className="font-label text-[0.65rem] tracking-[0.2em] text-burgundy">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-serif mt-2 text-2xl text-aubergine">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                      {step.body || step.description}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {detail.professionalDisclaimer ? (
        <section className="border-y border-aubergine/10 py-12">
          <p className="mx-auto max-w-3xl px-5 text-center text-sm sm:px-6 leading-relaxed text-charcoal/70 md:px-10">
            {detail.professionalDisclaimer}
          </p>
        </section>
      ) : null}

      {detail.galleryImages?.length ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 md:px-10">
            {detail.galleryImages.map((image, i) => (
              <Reveal key={`${imageSrc(image)}-${i}`} delay={i * 0.04}>
                <ImageFrame
                  src={imageSrc(image, STOCK.vineyardRows)}
                  alt={imageAlt(image, service.name)}
                  width={700}
                  height={520}
                  className="aspect-[4/3] w-full"
                  frameClassName="aspect-[4/3]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="aubergine-gradient py-24 text-ivory">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <h2 className="font-serif text-[1.85rem] sm:text-4xl md:text-5xl">
            {detail.cta?.heading || "Discuss This Service"}
          </h2>
          {detail.cta?.body ? (
            <p className="mt-5 text-ivory/80">{detail.cta.body}</p>
          ) : (
            <p className="mt-5 text-ivory/80">
              The initial consultation call is complimentary. Services are
              tailored — contact for a custom proposal.
            </p>
          )}
          <div className="mt-8">
            <Button
              href={detail.cta?.href || "/contact"}
              variant="magnetic"
              size="lg"
            >
              {detail.cta?.label || "Book a Complimentary Call"}
            </Button>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
            <SectionHeading title="Related Services" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item._id} className="group">
                  <Link href={`/services/${item.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <CmsImage
                        src={imageSrc(item.listingImage, STOCK.vineyardRows)}
                        alt={
                          item.listingImageAlt ||
                          imageAlt(item.listingImage, item.name)
                        }
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3 className="font-serif mt-4 text-2xl text-aubergine">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-charcoal/70">
                      {item.shortDescription}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
