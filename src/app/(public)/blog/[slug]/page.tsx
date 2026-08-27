import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
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
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const ogImage = imageSrc(post.coverImage);

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [post, settings, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getSettings(),
    getPublishedPosts({ limit: 12 }),
  ]);

  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.category === post.category || p.featured)
    .slice(0, 3);

  const published = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;

  const cover = imageSrc(post.coverImage, STOCK.goldenHour);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: cover || undefined,
    datePublished: published,
    author: {
      "@type": "Organization",
      name: post.author || settings.websiteName,
    },
    publisher: {
      "@type": "Organization",
      name: settings.websiteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(settings.logo || "/brand/logo-symbol.svg"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="relative min-h-[70vh] overflow-hidden bg-aubergine text-ivory">
          <Image
            src={cover}
            alt={
              post.coverImageAlt || imageAlt(post.coverImage, post.title)
            }
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="lavender-veil absolute inset-0" />
          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col justify-end px-6 pb-16 pt-36 md:px-10">
            <p className="font-label mb-4 text-[0.7rem] tracking-[0.22em] text-lavender">
              {post.category}
            </p>
            <h1 className="font-serif text-[2.15rem] leading-tight sm:text-4xl md:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-ivory/75">
              {post.author ? <span>{post.author}</span> : null}
              {post.readingTime ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </>
              ) : null}
              {post.publishedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={published}>
                    {new Date(post.publishedAt).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
          <p className="font-serif text-2xl leading-relaxed text-aubergine/90">
            {post.excerpt}
          </p>

          <div className="mt-14 space-y-16">
            {(post.contentSections || []).map((section, index) => (
              <Reveal key={section.key || index}>
                <section>
                  {section.heading ? (
                    <h2 className="font-serif text-3xl text-aubergine md:text-4xl">
                      {section.heading}
                    </h2>
                  ) : null}
                  {section.body ? (
                    <p className="mt-5 text-base leading-relaxed text-charcoal/80 md:text-lg">
                      {section.body}
                    </p>
                  ) : null}
                  {section.items?.length ? (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-base text-charcoal/80">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.image ? (
                    <div className="mt-8">
                      <ImageFrame
                        src={imageSrc(section.image, STOCK.goldenHour)}
                        alt={
                          section.imageAlt ||
                          imageAlt(
                            section.image,
                            section.heading || "Article illustration",
                          )
                        }
                        width={1100}
                        height={700}
                        className="aspect-[16/10] w-full"
                        frameClassName="aspect-[16/10]"
                        sizes="(max-width: 768px) 100vw, 720px"
                      />
                    </div>
                  ) : null}
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-aubergine/10 pt-10">
            <p className="text-sm leading-relaxed text-charcoal/65">
              This article is for general informational purposes and is not
              legal, tax, accounting, appraisal, licensing, or brokerage advice.
            </p>
            <div className="mt-8">
              <Button href="/contact" variant="magnetic">
                Book a Complimentary Call
              </Button>
            </div>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="bg-plum/5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
            <SectionHeading title="Related Insights" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <article key={item._id} className="group">
                  <Link href={`/blog/${item.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={imageSrc(item.coverImage, STOCK.goldenHour)}
                        alt={
                          item.coverImageAlt ||
                          imageAlt(item.coverImage, item.title)
                        }
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3 className="font-serif mt-4 text-2xl text-aubergine">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-charcoal/70">
                      {item.excerpt}
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
