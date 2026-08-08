import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Service from "@/models/Service";
import { toPlain } from "@/lib/utils";

export default async function AdminServicesPage() {
  const session = await getSession();
  await connectMongo();
  const services = toPlain(
    await Service.find().sort({ order: 1, createdAt: -1 }).lean(),
  );

  return (
    <>
      <AdminHeader title="Services" email={session?.email} />
      <main className="p-6">
        <ServicesManager initial={services as never} />
      </main>
    </>
  );
}
