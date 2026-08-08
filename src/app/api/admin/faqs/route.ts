import { withAdmin } from "@/lib/admin-api";
import FAQ from "@/models/FAQ";
import { faqSchema } from "@/lib/validations";
import { revalidateFaq } from "@/lib/revalidate";
import { toPlain } from "@/lib/utils";

export async function GET(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { question: { $regex: q, $options: "i" } },
        { answer: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return { faqs: toPlain(faqs) };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = faqSchema.parse(await request.json());
    const count = await FAQ.countDocuments();
    const created = await FAQ.create({
      ...body,
      order: body.order ?? count,
    });
    revalidateFaq();
    return { faq: toPlain(created.toObject()) };
  });
}
