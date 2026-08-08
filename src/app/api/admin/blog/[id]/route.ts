import { withAdmin } from "@/lib/admin-api";
import BlogPost from "@/models/BlogPost";
import { blogSchema } from "@/lib/validations";
import { revalidateBlog } from "@/lib/revalidate";
import { toStoredImageUrl } from "@/lib/media";
import { readingTimeFromText, toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const post = await BlogPost.findById(id).lean();
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return { post: toPlain(post) };
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = blogSchema.partial().parse(await request.json());
    const post = await BlogPost.findById(id);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    const previousSlug = post.slug;

    if (body.title !== undefined) post.title = body.title;
    if (body.slug !== undefined) post.slug = body.slug;
    if (body.excerpt !== undefined) post.excerpt = body.excerpt;
    if (body.author !== undefined) post.author = body.author;
    if (body.category !== undefined) post.category = body.category;
    if (body.tags !== undefined) post.tags = body.tags;
    if (body.featured !== undefined) post.featured = body.featured;
    if (body.status !== undefined) post.status = body.status;
    if (body.seo !== undefined) post.seo = body.seo;
    if (body.readingTime !== undefined) post.readingTime = body.readingTime;
    if (body.coverImageAlt !== undefined) post.coverImageAlt = body.coverImageAlt;
    if (body.coverImage !== undefined) {
      post.coverImage = toStoredImageUrl(body.coverImage);
    }
    if (body.contentSections !== undefined) {
      post.contentSections = body.contentSections.map((section, index) => ({
        ...section,
        image: toStoredImageUrl(section.image as never),
        order: section.order ?? index,
      }));
    }
    if (body.publishedAt !== undefined) {
      post.publishedAt = body.publishedAt ? new Date(body.publishedAt) : undefined;
    }
    if (body.contentSections || body.excerpt) {
      const sections = (post.contentSections || []) as Array<{
        heading?: string;
        body?: string;
        items?: string[];
      }>;
      const text = [
        post.excerpt,
        ...sections.flatMap((s) => [
          s.heading || "",
          s.body || "",
          ...(s.items || []),
        ]),
      ].join(" ");
      if (body.readingTime === undefined) {
        post.readingTime = readingTimeFromText(text);
      }
    }

    await post.save();
    revalidateBlog(previousSlug);
    if (post.slug !== previousSlug) revalidateBlog(post.slug);
    return { post: toPlain(post.toObject()) };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    revalidateBlog(post.slug);
    return { ok: true };
  });
}
