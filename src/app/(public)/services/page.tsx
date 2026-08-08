import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { ServicesHorizontal } from "@/components/services/ServicesHorizontal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { getPageBySlug, getPublishedServices, getSection } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("services");
  const title = page?.seo?.title || "Buyer Services";
  const description =
    page?.seo?.description ||
    "Tailored consulting services for prospective BC winery and vineyard buyers.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/services") },
    openGraph: { title, description, url: absoluteUrl("/services") },
  };
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([
    getPageBySlug("services"),
    getPublishedServices(),
  ]);

  const hero = page?.hero;
  const intro = getSection(page, "introduction");
  const journey = getSection(page, "journey");
  const coordination = getSection(page, "coordination");
  const diligence = getSection(page, "due-diligence-visual");
  const gallery = getSection(page, "gallery") as
    | (ReturnType<typeof getSection> & {
        images?: Array<{ src?: string; url?: string; alt?: string }>;
      })
    | undefined;
  const proposal = getSection(page, "custom-proposal");
  const cta = getSection(page, "consultation-cta");

  return (
    <>
      <CinematicHero
        eyebrow={hero?.eyebrow}
        heading={
          hero?.heading ||
          "Professional Guidance for Prospective Winery Buyers"
        }
        subheading={hero?.subheading}
        backgroundImage={hero?.backgroundImage || STOCK.vineyardRows}
        backgroundImageAlt={
          hero?.backgroundImageAlt ||
          imageAlt(hero?.backgroundImage, "Vineyard rows")
        }
        minHeightClassName="min-h-[68vh]"
      />

      {intro ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title={intro.heading || "Services Shaped Around the Buyer"}
                description={intro.body}
                align="center"
                className="mx-auto"
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10 lg:hidden">
          <div className="space-y-8">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={index * 0.04}>
                <article className="overflow-hidden border border-aubergine/10 bg-white/30">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={imageSrc(service.listingImage, STOCK.vineyardRows)}
                      alt={
                        service.listingImageAlt ||
                        imageAlt(service.listingImage, service.name)
                      }
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="font-label text-[0.65rem] tracking-[0.2em] text-champagne">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-serif mt-3 text-3xl text-aubergine">
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-plum"
                      >
                        {service.name}
                      </Link>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-charcoal/75">
                      {service.shortDescription}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="font-label mt-8 inline-flex text-[0.7rem] tracking-[0.18em] text-burgundy"
                    >
                      Learn More →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <ServicesHorizontal services={services} />
        </div>
      </section>

      {journey ? (
        <section className="bg-plum/5 py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title={journey.heading || "Buyer Acquisition Journey"}
                description={journey.body}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {coordination ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                title={
                  coordination.heading || "Professional Team Coordination"
                }
                description={coordination.body}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ImageFrame
                src={imageSrc(coordination.primaryImage, STOCK.meeting)}
                alt={
                  (coordination as { primaryImageAlt?: string })
                    .primaryImageAlt ||
                  imageAlt(coordination.primaryImage, "Advisory meeting")
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

      {diligence ? (
        <section className="bg-aubergine py-20 text-ivory md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <ImageFrame
                src={imageSrc(diligence.primaryImage, STOCK.documents)}
                alt={
                  (diligence as { primaryImageAlt?: string }).primaryImageAlt ||
                  imageAlt(diligence.primaryImage, "Due diligence materials")
                }
                width={900}
                height={700}
                className="aspect-[4/3] w-full"
                frameClassName="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading
                title={
                  diligence.heading || "Winery Due Diligence, Organised"
                }
                description={diligence.body}
                tone="light"
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {gallery?.images?.length ? (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title={
                  gallery.heading ||
                  "The Atmosphere of Wine-Country Ownership"
                }
                align="center"
                className="mx-auto"
              />
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.images.map((image, i) => (
                <Reveal key={`${imageSrc(image)}-${i}`} delay={i * 0.04}>
                  <ImageFrame
                    src={imageSrc(image, STOCK.vineyardRows)}
                    alt={imageAlt(image, "Wine-country atmosphere")}
                    width={700}
                    height={520}
                    className="aspect-[4/3] w-full"
                    frameClassName="aspect-[4/3]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {proposal ? (
        <section className="border-y border-aubergine/10 py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 md:px-10">
            <Reveal>
              <SectionHeading
                title={
                  proposal.heading || "A Custom Proposal, Not a Price List"
                }
                description={proposal.body}
                align="center"
                className="mx-auto"
              />
              {proposal.ctaLabel ? (
                <div className="mt-8">
                  <Button
                    href={proposal.ctaHref || "/contact"}
                    variant="primary"
                  >
                    {proposal.ctaLabel}
                  </Button>
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {cta ? (
        <section className="relative overflow-hidden py-24">
          <Image
            src={imageSrc(cta.backgroundImage, STOCK.duskVineyard)}
            alt={
              (cta as { backgroundImageAlt?: string }).backgroundImageAlt ||
              imageAlt(cta.backgroundImage, "Vineyard at dusk")
            }
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-aubergine/80" />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6 text-ivory">
            <h2 className="font-serif text-[1.85rem] sm:text-4xl md:text-5xl">
              {cta.heading || "Begin with a Complimentary Consultation"}
            </h2>
            {cta.body ? (
              <p className="mt-5 text-ivory/80">{cta.body}</p>
            ) : null}
            {cta.ctaLabel ? (
              <div className="mt-8">
                <Button
                  href={cta.ctaHref || "/contact"}
                  variant="magnetic"
                  size="lg"
                >
                  {cta.ctaLabel}
                </Button>
              </div>
            ) : (
              <div className="mt-8">
                <Button href="/contact" variant="magnetic" size="lg">
                  Book a Complimentary Call
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
