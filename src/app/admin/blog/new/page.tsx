import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { getSession } from "@/lib/auth";

export default async function NewBlogPage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="New article" email={session?.email} />
      <main className="p-6">
        <BlogEditor
          initial={{
            title: "",
            slug: "",
            excerpt: "",
            contentSections: [
              {
                key: "intro",
                type: "paragraph",
                body: "",
                order: 0,
              },
            ],
            author: "BC Winery Buyer Advisory",
            category: BLOG_CATEGORIES[0],
            tags: [],
            status: "draft",
            featured: false,
            coverImage: "",
            seo: {},
          }}
        />
      </main>
    </>
  );
}
