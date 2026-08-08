import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PAGE_SLUGS } from "@/lib/constants";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Page from "@/models/Page";
import { panelClass, btnSecondaryClass } from "@/components/admin/admin-styles";
import { asPlain } from "@/lib/mongo-plain";

export default async function AdminPagesListPage() {
  const session = await getSession();
  await connectMongo();
  const docs = asPlain<
    Array<{
      slug: string;
      name: string;
      status: string;
      updatedAt?: string;
      sections?: unknown[];
    }>
  >(await Page.find().lean());
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  return (
    <>
      <AdminHeader title="Pages" email={session?.email} />
      <main className="space-y-4 p-6">
        <p className="max-w-2xl text-sm text-charcoal/65">
          Edit public page content section by section. Changes sync to the live site after save.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PAGE_SLUGS.map((item) => {
            const doc = bySlug.get(item.slug);
            return (
              <div key={item.slug} className={panelClass}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl text-aubergine">
                      {doc?.name || item.name}
                    </h2>
                    <p className="mt-1 text-xs text-charcoal/55">/{item.slug === "home" ? "" : item.slug}</p>
                  </div>
                  <StatusBadge status={doc?.status || "draft"} />
                </div>
                <p className="mt-3 text-sm text-charcoal/65">
                  {doc?.sections?.length ?? 0} sections
                </p>
                <div className="mt-5 flex gap-2">
                  <Link href={`/admin/pages/${item.slug}`} className={btnSecondaryClass}>
                    Edit page
                  </Link>
                  <Link
                    href={item.path}
                    target="_blank"
                    className={btnSecondaryClass}
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
