"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BlogFilters({
  activeCategory = "",
  query = "",
}: {
  activeCategory?: string;
  query?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (next: { category?: string; q?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    startTransition(() => {
      router.push(`/blog${params.toString() ? `?${params}` : ""}`);
    });
  };

  return (
    <div className={cn("space-y-6", pending && "opacity-70")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          update({ q: String(form.get("q") || "") });
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="blog-search">
          Search insights
        </label>
        <input
          id="blog-search"
          name="q"
          defaultValue={query}
          placeholder="Search articles…"
          className="w-full border border-aubergine/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-lavender"
        />
        <button
          type="submit"
          className="font-label bg-aubergine px-6 py-3 text-[0.65rem] tracking-[0.18em] text-ivory"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2" role="list">
        <button
          type="button"
          onClick={() => update({ category: "" })}
          className={cn(
            "font-label rounded-full border px-4 py-2 text-[0.65rem] tracking-[0.16em]",
            !activeCategory
              ? "border-aubergine bg-aubergine text-ivory"
              : "border-aubergine/20 text-aubergine",
          )}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => update({ category })}
            className={cn(
              "font-label rounded-full border px-4 py-2 text-[0.65rem] tracking-[0.16em]",
              activeCategory === category
                ? "border-aubergine bg-aubergine text-ivory"
                : "border-aubergine/20 text-aubergine",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
