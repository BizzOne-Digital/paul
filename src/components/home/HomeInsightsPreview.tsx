import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { PageSection } from "@/lib/types";
import { STOCK } from "@/lib/images";
import { mediaAlt, mediaUrl } from "@/lib/media";

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime?: number;
  coverImage?: unknown;
  coverImageAlt?: string;
};

type HomeInsightsPreviewProps = {
  section?: PageSection;
  posts: PostCard[];
};

export function HomeInsightsPreview({
  section,
  posts,
}: HomeInsightsPreviewProps) {
  if (!section || posts.length === 0) return null;

  return (
    <section className="w-full min-w-0 overflow-x-clip py-16 sm:py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.heading || "Latest Thinking for Prospective Buyers"}
            />
            {section.ctaLabel ? (
              <Button
                href={section.ctaHref || "/blog"}
                variant="secondary"
                className="w-full shrink-0 sm:w-auto"
              >
                {section.ctaLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post._id} delay={index * 0.06}>
              <article className="group flex h-full flex-col">
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-plum/10">
                    <Image
                      src={mediaUrl(post.coverImage, STOCK.goldenHour)}
                      alt={mediaAlt(
                        post.coverImage,
                        post.coverImageAlt || post.title,
                      )}
                      fill
                      className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </Link>
                <p className="font-label mt-5 text-[0.65rem] tracking-[0.18em] text-burgundy">
                  {post.category}
                </p>
                <h3 className="font-serif mt-2 text-2xl text-aubergine">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:text-plum"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">
                  {post.excerpt}
                </p>
                <p className="font-label mt-4 text-[0.65rem] tracking-[0.16em] text-aubergine/50">
                  {post.readingTime || 1} min read
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
