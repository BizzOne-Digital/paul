import { withAdmin } from "@/lib/admin-api";
import BlogPost from "@/models/BlogPost";
import { revalidateBlog } from "@/lib/revalidate";
import { asPlain } from "@/lib/mongo-plain";
import { slugify, toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const source = asPlain<Record<string, unknown> | null>(
      await BlogPost.findById(id).lean(),
    );
    if (!source) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const sourceSlug = String(source.slug || "post");
    const base = `${sourceSlug}-copy`;
    let slug = slugify(base);
    let n = 2;
    while (await BlogPost.exists({ slug })) {
      slug = slugify(`${base}-${n}`);
      n += 1;
    }

    const { _id, createdAt, updatedAt, ...rest } = source;
    void _id;
    void createdAt;
    void updatedAt;

    const created = await BlogPost.create({
      ...rest,
      title: `${String(source.title || "Article")} (Copy)`,
      slug,
      status: "draft",
      featured: false,
      publishedAt: undefined,
    });
    revalidateBlog(created.slug);
    return { post: toPlain(created.toObject()) };
  });
}
