import { withAdmin } from "@/lib/admin-api";
import BlogPost from "@/models/BlogPost";
import { blogSchema } from "@/lib/validations";
import { revalidateBlog } from "@/lib/revalidate";
import { toStoredImageUrl } from "@/lib/media";
import { readingTimeFromText, slugify, toPlain } from "@/lib/utils";

export async function GET(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    const posts = await BlogPost.find(filter).sort({ updatedAt: -1 }).lean();
    return { posts: toPlain(posts) };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = blogSchema.parse(await request.json());
    const slug = body.slug || slugify(body.title);
    const text = [
      body.excerpt,
      ...(body.contentSections || []).flatMap((s) => [
        s.heading || "",
        s.body || "",
        ...(s.items || []),
      ]),
    ].join(" ");
    const created = await BlogPost.create({
      ...body,
      slug,
      coverImage: toStoredImageUrl(body.coverImage),
      contentSections: (body.contentSections || []).map((section, index) => ({
        ...section,
        image: toStoredImageUrl(section.image as never),
        order: section.order ?? index,
      })),
      readingTime: body.readingTime ?? readingTimeFromText(text),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      coverImageAlt:
        body.coverImageAlt ||
        (typeof body.coverImage === "object" && body.coverImage
          ? body.coverImage.alt
          : "") ||
        "",
    });
    revalidateBlog(created.slug);
    return { post: toPlain(created.toObject()) };
  });
}
