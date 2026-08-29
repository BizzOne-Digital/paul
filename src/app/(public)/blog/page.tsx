import type { Metadata } from "next";
import { CmsImage } from "@/components/ui/CmsImage";
import Link from "next/link";
import { Suspense } from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getPageBySlug, getPublishedPosts, getSection } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { imageAlt, imageSrc, STOCK } from "@/lib/images";

type PageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("blog");
  const title = page?.seo?.title || "Buyer Insights";
  const description =
    page?.seo?.description ||
    "Educational insights on buying a BC winery, vineyard due diligence, operations, and ownership transition.";

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/blog") },
    openGraph: { title, description, url: absoluteUrl("/blog") },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category || "";
  const q = sp.q || "";

  const [page, posts, featured] = await Promise.all([
    getPageBySlug("blog"),
    getPublishedPosts({
      category: category || undefined,
      search: q || undefined,
    }),
    getPublishedPosts({ featured: true, limit: 2 }),
  ]);

  const hero = page?.hero;
  const newsletter = getSection(page, "newsletter");
  const showFeatured = !category && !q && featured.length > 0;

  return (
    <>
      <CinematicHero
        eyebrow={hero?.eyebrow}
        heading={hero?.heading || "Insights for Prospective Winery Buyers"}
        subheading={hero?.subheading}
        backgroundImage={hero?.backgroundImage || STOCK.goldenHour}
        backgroundImageAlt={
          hero?.backgroundImageAlt ||
          imageAlt(hero?.backgroundImage, "Golden-hour vineyard")
        }
      />

      {showFeatured ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
            <SectionHeading eyebrow="Featured" title="Start Here" />
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {featured.map((post, i) => (
                <Reveal key={post._id} delay={i * 0.06}>
                  <article className="group">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <CmsImage
                          src={imageSrc(post.coverImage, STOCK.goldenHour)}
                          alt={
                            post.coverImageAlt ||
                            imageAlt(post.coverImage, post.title)
                          }
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <p className="font-label mt-4 text-[0.65rem] tracking-[0.18em] text-burgundy">
                        {post.category}
                      </p>
                      <h2 className="font-serif mt-2 text-3xl text-aubergine">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm text-charcoal/70">
                        {post.excerpt}
                      </p>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
          <Suspense fallback={null}>
            <BlogFilters activeCategory={category} query={q} />
          </Suspense>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post._id} delay={i * 0.04}>
                <article className="group flex h-full flex-col">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <CmsImage
                        src={imageSrc(post.coverImage, STOCK.goldenHour)}
                        alt={
                          post.coverImageAlt ||
                          imageAlt(post.coverImage, post.title)
                        }
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <p className="font-label mt-4 text-[0.65rem] tracking-[0.18em] text-burgundy">
                      {post.category}
                    </p>
                    <h2 className="font-serif mt-2 text-2xl text-aubergine">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                      {post.excerpt}
                    </p>
                    {post.readingTime ? (
                      <p className="font-label mt-4 text-[0.65rem] tracking-[0.16em] text-aubergine/50">
                        {post.readingTime} min read
                      </p>
                    ) : null}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-10 text-center text-charcoal/70">
              No articles match your filters. Try another category or search
              term.
            </p>
          ) : null}
        </div>
      </section>

      {newsletter ? (
        <section className="bg-plum/5 py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <SectionHeading
              title={newsletter.heading || "Stay Close to Buyer Thinking"}
              description={newsletter.body}
              align="center"
              className="mx-auto"
            />
            {newsletter.ctaLabel ? (
              <div className="mt-8">
                <Button
                  href={newsletter.ctaHref || "/contact"}
                  variant="primary"
                >
                  {newsletter.ctaLabel}
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
