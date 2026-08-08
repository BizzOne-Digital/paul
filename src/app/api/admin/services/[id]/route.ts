import { withAdmin } from "@/lib/admin-api";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { revalidateServices } from "@/lib/revalidate";
import { toStoredImageUrl } from "@/lib/media";
import { toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const service = await Service.findById(id).lean();
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }
    return { service: toPlain(service) };
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = serviceSchema.partial().parse(await request.json());
    const service = await Service.findById(id);
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }
    const previousSlug = service.slug;
    Object.assign(service, body);
    if (body.listingImage !== undefined) {
      service.listingImage = toStoredImageUrl(body.listingImage);
    }
    if (
      body.listingImageAlt === undefined &&
      typeof body.listingImage === "object" &&
      body.listingImage?.alt
    ) {
      service.listingImageAlt = body.listingImage.alt;
    }
    await service.save();
    revalidateServices(previousSlug);
    if (service.slug !== previousSlug) revalidateServices(service.slug);
    return { service: toPlain(service.toObject()) };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }
    revalidateServices(service.slug);
    return { ok: true };
  });
}
