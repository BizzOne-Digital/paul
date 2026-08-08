import type { Metadata } from "next";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPageBySlug, getSection } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { absoluteUrl, isValidHttpUrl } from "@/lib/utils";
import { imageAlt, STOCK } from "@/lib/images";
import { ACQUISITION_TYPES } from "@/lib/constants";

type PageProps = {
  searchParams: Promise<{ acquisitionType?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  const title = page?.seo?.title || "Contact";
  const description =
    page?.seo?.description ||
    "Contact BC Winery Buyer Advisory to discuss a complimentary consultation about winery or vineyard acquisition in British Columbia.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/contact") },
    openGraph: { title, description, url: absoluteUrl("/contact") },
  };
}

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const [page, settings] = await Promise.all([
    getPageBySlug("contact"),
    getSettings(),
  ]);

  const hero = page?.hero;
  const details = getSection(page, "contact-details");
  const acquisitionType = sp.acquisitionType || "";
  const knownType = ACQUISITION_TYPES.some((t) => t.value === acquisitionType)
    ? acquisitionType
    : "";

  const phoneTel =
    settings.phoneTel ||
    settings.phone.replace(/[^\d+]/g, "") ||
    "+12508092342";

  return (
    <>
      <CinematicHero
        eyebrow={hero?.eyebrow || "Complimentary Initial Consultation"}
        heading={hero?.heading || "Tell Us What You Want to Acquire"}
        subheading={hero?.subheading}
        backgroundImage={hero?.backgroundImage || STOCK.meeting}
        backgroundImageAlt={
          hero?.backgroundImageAlt ||
          imageAlt(hero?.backgroundImage, "Buyer and advisor discussion")
        }
        minHeightClassName="min-h-[55vh]"
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                title={
                  details?.heading || "British Columbia Winery Buyer Guidance"
                }
                description={
                  details?.body ||
                  settings.complimentaryConsultationText ||
                  "Complimentary initial consultation. Services are tailored to the buyer and opportunity."
                }
              />
            </Reveal>

            <Reveal delay={0.1} className="mt-10 space-y-6">
              <div>
                <p className="font-label text-[0.65rem] tracking-[0.18em] text-burgundy">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-2 block text-lg text-aubergine transition hover:text-plum"
                >
                  {settings.email}
                </a>
              </div>
              <div>
                <p className="font-label text-[0.65rem] tracking-[0.18em] text-burgundy">
                  Phone
                </p>
                <a
                  href={`tel:${phoneTel}`}
                  className="mt-2 block text-lg text-aubergine transition hover:text-plum"
                >
                  {settings.phone}
                </a>
              </div>
              <div>
                <p className="font-label text-[0.65rem] tracking-[0.18em] text-burgundy">
                  Service area
                </p>
                <p className="mt-2 text-lg text-aubergine">
                  {settings.serviceArea}
                </p>
              </div>
              {settings.businessHours ? (
                <div>
                  <p className="font-label text-[0.65rem] tracking-[0.18em] text-burgundy">
                    Hours
                  </p>
                  <p className="mt-2 text-lg text-aubergine">
                    {settings.businessHours}
                  </p>
                </div>
              ) : null}
              {isValidHttpUrl(settings.socialUrl) ? (
                <div>
                  <p className="font-label text-[0.65rem] tracking-[0.18em] text-burgundy">
                    Social
                  </p>
                  <a
                    href={settings.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-lg text-aubergine transition hover:text-plum"
                  >
                    {settings.socialHandle || settings.socialUrl}
                  </a>
                </div>
              ) : null}
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <Reveal>
              <div className="border border-aubergine/10 bg-white/40 p-6 md:p-10">
                <p className="font-label mb-6 text-[0.7rem] tracking-[0.2em] text-burgundy">
                  Inquiry form
                </p>
                <ContactForm defaultAcquisitionType={knownType} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
