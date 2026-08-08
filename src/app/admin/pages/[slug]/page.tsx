import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PageEditor } from "@/components/admin/PageEditor";
import { getSession } from "@/lib/auth";
import { getPageBySlugAdmin } from "@/lib/data";
import connectMongo from "@/lib/mongodb";
import Page from "@/models/Page";
import { PAGE_SLUGS } from "@/lib/constants";
import { toPlain } from "@/lib/utils";
import type { PageSection, HeroContent, SEO } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function AdminPageEditorPage({ params }: Props) {
  const { slug } = await params;
  const meta = PAGE_SLUGS.find((p) => p.slug === slug);
  if (!meta) notFound();

  const session = await getSession();
  let page = await getPageBySlugAdmin(slug);

  if (!page) {
    await connectMongo();
    const created = await Page.create({
      name: meta.name,
      slug,
      hero: { heading: meta.name },
      sections: [],
      status: "published",
    });
    page = toPlain(created.toObject());
  }

  const plain = page as {
    _id: string;
    name: string;
    slug: string;
    hero?: HeroContent;
    sections?: PageSection[];
    seo?: SEO;
    status: "draft" | "published";
  };

  return (
    <>
      <AdminHeader title={`Edit: ${plain.name}`} email={session?.email} />
      <main className="p-6">
        <PageEditor
          slug={slug}
          initial={{
            name: plain.name,
            hero: plain.hero || {},
            sections: (plain.sections || []).sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0),
            ),
            seo: plain.seo || {},
            status: plain.status,
          }}
          previewPath={meta.path}
        />
      </main>
    </>
  );
}
