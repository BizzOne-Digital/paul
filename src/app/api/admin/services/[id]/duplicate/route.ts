import { withAdmin } from "@/lib/admin-api";
import Service from "@/models/Service";
import { revalidateServices } from "@/lib/revalidate";
import { asPlain } from "@/lib/mongo-plain";
import { slugify, toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const source = asPlain<Record<string, unknown> | null>(
      await Service.findById(id).lean(),
    );
    if (!source) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    const sourceSlug = String(source.slug || "service");
    const base = `${sourceSlug}-copy`;
    let slug = slugify(base);
    let n = 2;
    while (await Service.exists({ slug })) {
      slug = slugify(`${base}-${n}`);
      n += 1;
    }

    const { _id, createdAt, updatedAt, ...rest } = source;
    void _id;
    void createdAt;
    void updatedAt;

    const created = await Service.create({
      ...rest,
      name: `${String(source.name || "Service")} (Copy)`,
      slug,
      status: "draft",
      featured: false,
    });
    revalidateServices(created.slug);
    return { service: toPlain(created.toObject()) };
  });
}
