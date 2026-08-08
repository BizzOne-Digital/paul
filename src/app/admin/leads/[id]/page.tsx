import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { asPlain } from "@/lib/mongo-plain";

type Props = { params: Promise<{ id: string }> };

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  await getSession();
  await connectMongo();
  const lead = await Lead.findById(id).lean();
  if (!lead) notFound();

  return (
    <LeadDetail
      lead={asPlain({
        ...asPlain<Record<string, unknown>>(lead),
        _id: String((lead as { _id: unknown })._id),
      })}
    />
  );
}
