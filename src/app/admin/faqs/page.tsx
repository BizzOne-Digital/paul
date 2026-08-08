import { AdminHeader } from "@/components/admin/AdminHeader";
import { FaqsManager } from "@/components/admin/FaqsManager";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { toPlain } from "@/lib/utils";

export default async function AdminFaqsPage() {
  const session = await getSession();
  await connectMongo();
  const faqs = toPlain(await FAQ.find().sort({ order: 1 }).lean());
  return (
    <>
      <AdminHeader title="FAQs" email={session?.email} />
      <main className="p-6">
        <FaqsManager initial={faqs as never} />
      </main>
    </>
  );
}
