import { withAdmin } from "@/lib/admin-api";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { revalidateServices } from "@/lib/revalidate";
import { toStoredImageUrl } from "@/lib/media";
import { slugify, toPlain } from "@/lib/utils";

export async function GET(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { slug: { $regex: q, $options: "i" } },
            { shortDescription: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return { services: toPlain(services) };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = serviceSchema.parse(await request.json());
    const slug = body.slug || slugify(body.name);
    const count = await Service.countDocuments();
    const listingImage = toStoredImageUrl(body.listingImage);
    const created = await Service.create({
      ...body,
      slug,
      listingImage,
      order: body.order ?? count,
      listingImageAlt:
        body.listingImageAlt ||
        (typeof body.listingImage === "object" && body.listingImage
          ? body.listingImage.alt
          : "") ||
        "",
    });
    revalidateServices(created.slug);
    return { service: toPlain(created.toObject()) };
  });
}
