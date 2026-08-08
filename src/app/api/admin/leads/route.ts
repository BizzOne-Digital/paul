import { withAdmin } from "@/lib/admin-api";
import Lead from "@/models/Lead";
import { toPlain } from "@/lib/utils";

export async function GET(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim();
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { reason: { $regex: q, $options: "i" } },
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    return { leads: toPlain(leads) };
  });
}
