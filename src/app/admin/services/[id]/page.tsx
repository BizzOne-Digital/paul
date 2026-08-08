import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Service from "@/models/Service";
import { mediaUrl } from "@/lib/media";
import { asPlain } from "@/lib/mongo-plain";
import type { SEO, ServiceDetailPage } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

type PlainService = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  listingImage?: string | { url: string; alt?: string };
  listingImageAlt?: string;
  featured?: boolean;
  order?: number;
  status: "draft" | "published";
  detailPage?: ServiceDetailPage;
  seo?: SEO;
};

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  await connectMongo();
  const service = await Service.findById(id).lean();
  if (!service) notFound();
  const plain = asPlain<PlainService>({
    ...asPlain<Record<string, unknown>>(service),
    _id: String((service as { _id: unknown })._id),
  });

  return (
    <>
      <AdminHeader title={`Edit: ${plain.name}`} email={session?.email} />
      <main className="p-6">
        <ServiceEditor
          id={plain._id}
          initial={{
            name: plain.name,
            slug: plain.slug,
            shortDescription: plain.shortDescription,
            listingImage: mediaUrl(plain.listingImage) || "",
            listingImageAlt: plain.listingImageAlt,
            featured: plain.featured,
            order: plain.order,
            status: plain.status,
            detailPage: plain.detailPage || {},
            seo: plain.seo || {},
          }}
        />
      </main>
    </>
  );
}
