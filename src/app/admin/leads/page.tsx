import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadsManager } from "@/components/admin/LeadsManager";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { toPlain } from "@/lib/utils";

export default async function AdminLeadsPage() {
  const session = await getSession();
  await connectMongo();
  const leads = toPlain(await Lead.find().sort({ createdAt: -1 }).lean());
  return (
    <>
      <AdminHeader title="Leads" email={session?.email} />
      <main className="p-6">
        <LeadsManager initial={leads as never} />
      </main>
    </>
  );
}
