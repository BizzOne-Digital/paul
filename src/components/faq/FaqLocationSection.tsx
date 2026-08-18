import Link from "next/link";
import { OkanaganMap } from "@/components/maps/OkanaganMap";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FaqLocationSectionProps = {
  heading?: string;
  body?: string;
};

export function FaqLocationSection({
  heading = "Where Are We?",
  body = "BC Winery Buyer Advisory serves discerning buyers exploring winery and vineyard acquisitions across British Columbia. The Okanagan Valley — in south-central BC, western Canada — is the province’s primary wine region and the focus of much of our guidance.",
}: FaqLocationSectionProps) {
  return (
    <section
      id="where-are-we"
      className="scroll-mt-28 border-y border-aubergine/10 bg-plum/5 py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-7xl items-start gap-10 px-5 sm:gap-12 sm:px-6 md:px-10 lg:grid-cols-2">
        <Reveal>
          <SectionHeading title={heading} description={body} />
          <p className="mt-6 text-sm leading-relaxed text-charcoal/75">
            For international inquirers: British Columbia sits on Canada&apos;s
            west coast, north of Washington State. The Okanagan Valley stretches
            roughly 250 kilometres through the southern interior — from Vernon
            in the north to Osoyoos near the US border — with Kelowna, Penticton,
            Naramata, Oliver, and Keremeos among its well-known wine communities.
          </p>
          <Link
            href="/#okanagan"
            className="font-label mt-6 inline-flex text-[0.65rem] tracking-[0.16em] text-burgundy uppercase transition hover:text-aubergine"
          >
            Return to homepage map →
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <OkanaganMap variant="compact" />
        </Reveal>
      </div>
    </section>
  );
}
