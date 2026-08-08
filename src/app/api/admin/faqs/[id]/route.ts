import { withAdmin } from "@/lib/admin-api";
import FAQ from "@/models/FAQ";
import { faqSchema } from "@/lib/validations";
import { revalidateFaq } from "@/lib/revalidate";
import { toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = faqSchema.partial().parse(await request.json());
    const faq = await FAQ.findByIdAndUpdate(id, body, { new: true });
    if (!faq) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }
    revalidateFaq();
    return { faq: toPlain(faq.toObject()) };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }
    revalidateFaq();
    return { ok: true };
  });
}
