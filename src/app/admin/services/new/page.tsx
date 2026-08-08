import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { getSession } from "@/lib/auth";

export default async function NewServicePage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="New service" email={session?.email} />
      <main className="p-6">
        <ServiceEditor
          initial={{
            name: "",
            slug: "",
            shortDescription: "",
            status: "draft",
            featured: false,
            order: 0,
            detailPage: {
              cta: { label: "Book a complimentary call", href: "/contact" },
            },
            seo: {},
          }}
        />
      </main>
    </>
  );
}
