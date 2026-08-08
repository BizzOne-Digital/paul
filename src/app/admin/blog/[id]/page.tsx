import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { asPlain } from "@/lib/mongo-plain";
import type { ContentBlock, SEO } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

type PlainPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentSections?: ContentBlock[];
  coverImage?: string;
  coverImageAlt?: string;
  author?: string;
  category: string;
  tags?: string[];
  publishedAt?: string;
  featured?: boolean;
  status: "draft" | "published";
  seo?: SEO;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  await connectMongo();
  const post = await BlogPost.findById(id).lean();
  if (!post) notFound();
  const plain = asPlain<PlainPost>({
    ...asPlain<Record<string, unknown>>(post),
    _id: String((post as { _id: unknown })._id),
  });

  return (
    <>
      <AdminHeader title={`Edit: ${plain.title}`} email={session?.email} />
      <main className="p-6">
        <BlogEditor
          id={plain._id}
          initial={{
            title: plain.title,
            slug: plain.slug,
            excerpt: plain.excerpt,
            contentSections: (plain.contentSections || []).map((section, index) => ({
              key: section.key || `block-${index}`,
              type: section.type || "paragraph",
              heading: section.heading || "",
              body: section.body || "",
              items: section.items || [],
              image: section.image || "",
              imageAlt: section.imageAlt || "",
              order: section.order ?? index,
            })),
            coverImage: plain.coverImage || "",
            coverImageAlt: plain.coverImageAlt,
            author: plain.author,
            category: plain.category,
            tags: plain.tags || [],
            publishedAt: plain.publishedAt || null,
            featured: plain.featured,
            status: plain.status,
            seo: plain.seo || {},
          }}
        />
      </main>
    </>
  );
}
