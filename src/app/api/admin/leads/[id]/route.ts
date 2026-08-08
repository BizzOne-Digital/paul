import { withAdmin } from "@/lib/admin-api";
import Lead from "@/models/Lead";
import { leadUpdateSchema } from "@/lib/validations";
import { revalidateLeads, revalidateDashboard } from "@/lib/revalidate";
import { toPlain } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const lead = await Lead.findById(id).lean();
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }
    return { lead: toPlain(lead) };
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = leadUpdateSchema.parse(await request.json());
    const lead = await Lead.findByIdAndUpdate(id, body, { new: true });
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }
    revalidateLeads();
    revalidateDashboard();
    return { lead: toPlain(lead.toObject()) };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }
    revalidateLeads();
    revalidateDashboard();
    return { ok: true };
  });
}
