"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils";

export type FaqClientItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type FaqClientProps = {
  faqs: FaqClientItem[];
};

export function FaqClient({ faqs }: FaqClientProps) {
  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [faqs]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="FAQ categories"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            onClick={() => setActive(category)}
            className={cn(
              "font-label rounded-full border px-4 py-2 text-[0.65rem] tracking-[0.16em] transition",
              active === category
                ? "border-aubergine bg-aubergine text-ivory"
                : "border-aubergine/20 text-aubergine hover:border-lavender",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Accordion
          items={filtered.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
        />
        {filtered.length === 0 ? (
          <p className="text-sm text-charcoal/70">
            No questions in this category yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
