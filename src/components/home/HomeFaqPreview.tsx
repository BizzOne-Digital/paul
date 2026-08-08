import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";

export type FaqCard = {
  _id: string;
  question: string;
  answer: string;
};

type HomeFaqPreviewProps = {
  section?: PageSection;
  faqs: FaqCard[];
};

export function HomeFaqPreview({ section, faqs }: HomeFaqPreviewProps) {
  if (!section || faqs.length === 0) return null;

  return (
    <section className="w-full min-w-0 overflow-x-clip bg-aubergine py-16 text-ivory sm:py-24 md:py-32">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.heading || "Answers Before the First Call"}
            tone="light"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="[&_button]:text-ivory [&_h3_button:hover]:text-lavender [&_.font-serif]:text-ivory [&_p]:text-ivory/75 [&_.divide-aubergine\/10]:divide-lavender/20 [&_.border-aubergine\/10]:border-lavender/20">
            <Accordion
              items={faqs.map((f) => ({
                id: String(f._id),
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </Reveal>

        {section.ctaLabel ? (
          <Reveal delay={0.15} className="mt-12 text-center">
            <Button href={section.ctaHref || "/faq"} variant="ghost">
              {section.ctaLabel}
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
