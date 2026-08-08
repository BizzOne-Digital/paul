import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogManager } from "@/components/admin/BlogManager";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { toPlain } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await getSession();
  await connectMongo();
  const posts = toPlain(
    await BlogPost.find().sort({ updatedAt: -1 }).lean(),
  );

  return (
    <>
      <AdminHeader title="Blog" email={session?.email} />
      <main className="p-6">
        <BlogManager initial={posts as never} />
      </main>
    </>
  );
}
