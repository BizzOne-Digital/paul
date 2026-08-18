"use client";

import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { PageSection } from "@/lib/types";

type ResourceCard = {
  title?: string;
  description?: string;
  body?: string;
  key?: string;
};

type HomeProfessionalResourcesProps = {
  section?: PageSection & { cards?: ResourceCard[] };
};

export function HomeProfessionalResources({
  section,
}: HomeProfessionalResourcesProps) {
  if (!section) return null;

  const cards = section.cards || [];
  const accordionItems = cards.map((card, index) => ({
    id: card.key || card.title || `resource-${index}`,
    question: card.title || "",
    answer: card.description || card.body || "",
  }));

  return (
    <section
      id="professional-resources"
      className="relative w-full min-w-0 overflow-x-clip bg-[#f8f5f0] py-16 sm:py-24 md:py-28"
    >
      <div
        className="grape-pattern pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow || "Professional Advice & Resources"}
            title={
              section.heading ||
              "Specialist Guidance for Every Stage of Acquisition"
            }
            description={section.subheading || section.body}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        {accordionItems.length > 0 ? (
          <Reveal delay={0.08} className="mt-10 sm:mt-12">
            <Accordion items={accordionItems} allowMultiple />
          </Reveal>
        ) : null}

        <Reveal delay={0.12} className="mt-10 text-center sm:mt-12">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-charcoal/70">
            For an initial confidential conversation, complete the contact form
            and we will arrange a discussion tailored to your specific needs.
          </p>
          <div className="mt-6">
            <Button
              href={section.ctaHref || "/contact"}
              variant="magnetic"
              className="w-full sm:w-auto"
            >
              {section.ctaLabel || "Start a Confidential Conversation"}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
