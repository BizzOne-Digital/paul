import { unstable_noStore as noStore } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogPost, FAQ, Lead, Page, Service } from "@/models";
import type { HeroContent, PageSection, SEO, ServiceDetailPage } from "@/lib/types";
import type { ImageLike } from "@/lib/images";
import { toPlain } from "@/lib/utils";

export type PlainPage = {
  _id: string;
  name: string;
  slug: string;
  hero?: HeroContent & Record<string, unknown>;
  sections?: PageSection[];
  seo?: SEO;
  status?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type PlainService = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  listingImage?: ImageLike;
  listingImageAlt?: string;
  featured?: boolean;
  order?: number;
  status: string;
  detailPage?: ServiceDetailPage & Record<string, unknown>;
  seo?: SEO;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type PlainPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentSections?: Array<{
    key?: string;
    heading?: string;
    body?: string;
    items?: string[];
    image?: ImageLike;
    imageAlt?: string;
  }>;
  coverImage?: ImageLike;
  coverImageAlt?: string;
  author?: string;
  category: string;
  tags?: string[];
  publishedAt?: string | Date;
  readingTime?: number;
  featured?: boolean;
  status: string;
  seo?: SEO;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type PlainFaq = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  status: string;
};

export function getSection(
  page: { sections?: PageSection[] } | null | undefined,
  key: string,
): PageSection | undefined {
  if (!page?.sections?.length) return undefined;
  return page.sections.find((s) => s.key === key && s.visible !== false);
}

export async function getPageBySlug(slug: string): Promise<PlainPage | null> {
  noStore();
  await connectToDatabase();
  const page = await Page.findOne({ slug, status: "published" }).lean();
  return page ? (toPlain(page) as unknown as PlainPage) : null;
}

export async function getPageBySlugAdmin(slug: string): Promise<PlainPage | null> {
  await connectToDatabase();
  const page = await Page.findOne({ slug }).lean();
  return page ? (toPlain(page) as unknown as PlainPage) : null;
}

export async function getPublishedServices(): Promise<PlainService[]> {
  noStore();
  await connectToDatabase();
  const services = await Service.find({ status: "published" })
    .sort({ order: 1, name: 1 })
    .lean();
  return toPlain(services) as unknown as PlainService[];
}

export async function getServiceBySlug(
  slug: string,
): Promise<PlainService | null> {
  noStore();
  await connectToDatabase();
  const service = await Service.findOne({ slug, status: "published" }).lean();
  return service ? (toPlain(service) as unknown as PlainService) : null;
}

export async function getPublishedPosts(options?: {
  limit?: number;
  category?: string;
  search?: string;
  q?: string;
  featured?: boolean;
}): Promise<PlainPost[]> {
  noStore();
  await connectToDatabase();
  const search = options?.search || options?.q;
  const filter: Record<string, unknown> = {
    status: "published",
    $or: [
      { publishedAt: { $lte: new Date() } },
      { publishedAt: null },
      { publishedAt: { $exists: false } },
    ],
  };
  if (options?.category) filter.category = options.category;
  if (options?.featured) filter.featured = true;
  if (search) {
    filter.$and = [
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }
  let query = BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  if (options?.limit) query = query.limit(options.limit);
  return toPlain(await query.lean()) as unknown as PlainPost[];
}

export async function getPostBySlug(slug: string): Promise<PlainPost | null> {
  noStore();
  await connectToDatabase();
  const post = await BlogPost.findOne({
    slug,
    status: "published",
  }).lean();
  return post ? (toPlain(post) as unknown as PlainPost) : null;
}

export async function getPublishedFaqs(limit?: number): Promise<PlainFaq[]> {
  noStore();
  await connectToDatabase();
  let query = FAQ.find({ status: "published" }).sort({
    order: 1,
    createdAt: 1,
  });
  if (limit) query = query.limit(limit);
  return toPlain(await query.lean()) as unknown as PlainFaq[];
}

export async function getNavServices() {
  const services = await getPublishedServices();
  return services.map((s) => ({
    name: s.name,
    slug: s.slug,
  }));
}

export async function getDashboardStats() {
  await connectToDatabase();
  const [
    pages,
    publishedServices,
    publishedArticles,
    draftArticles,
    faqs,
    newInquiries,
    contactedInquiries,
    recentInquiries,
    recentServices,
    recentPosts,
    leadStatuses,
  ] = await Promise.all([
    Page.countDocuments(),
    Service.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "draft" }),
    FAQ.countDocuments(),
    Lead.countDocuments({ status: "New" }),
    Lead.countDocuments({ status: "Contacted" }),
    Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
    Service.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("name slug status updatedAt")
      .lean(),
    BlogPost.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title slug status updatedAt")
      .lean(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const services = toPlain(recentServices) as unknown as Array<{
    _id: string;
    name: string;
    slug: string;
    status: string;
    updatedAt: string | Date;
  }>;
  const posts = toPlain(recentPosts) as unknown as Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: string | Date;
  }>;

  return toPlain({
    pages,
    publishedServices,
    publishedArticles,
    draftArticles,
    faqs,
    newInquiries,
    contactedInquiries,
    recentInquiries: toPlain(recentInquiries),
    leadStatuses: leadStatuses.map((row) => ({
      status: String(row._id),
      count: row.count as number,
    })),
    recentlyUpdated: [
      ...services.map((s) => ({
        type: "service" as const,
        title: s.name,
        href: `/admin/services/${s._id}`,
        status: s.status,
        updatedAt: s.updatedAt,
      })),
      ...posts.map((p) => ({
        type: "blog" as const,
        title: p.title,
        href: `/admin/blog/${p._id}`,
        status: p.status,
        updatedAt: p.updatedAt,
      })),
    ].sort(
      (a, b) =>
        new Date(b.updatedAt as Date).getTime() -
        new Date(a.updatedAt as Date).getTime(),
    ),
  });
}
