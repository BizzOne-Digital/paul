import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  panelClass,
  btnPrimaryClass,
  btnSecondaryClass,
} from "@/components/admin/admin-styles";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const stats = await getDashboardStats();

  const cards = [
    { label: "Pages", value: stats.pages },
    { label: "Published services", value: stats.publishedServices },
    { label: "Published articles", value: stats.publishedArticles },
    { label: "Draft articles", value: stats.draftArticles },
    { label: "FAQs", value: stats.faqs },
    { label: "New inquiries", value: stats.newInquiries },
    { label: "Contacted", value: stats.contactedInquiries },
  ];

  const leads = (stats.recentInquiries || []) as unknown as Array<{
    _id: string;
    fullName: string;
    email: string;
    status: string;
  }>;

  const recent = (stats.recentlyUpdated || []) as unknown as Array<{
    type: string;
    title: string;
    href: string;
    status: string;
    updatedAt: string;
  }>;

  return (
    <>
      <AdminHeader title="Dashboard" email={session?.email} />
      <main className="space-y-8 p-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/" target="_blank" className={btnPrimaryClass}>
            Preview website
          </Link>
          <Link href="/admin/leads" className={btnSecondaryClass}>
            Review inquiries
          </Link>
          <Link href="/admin/blog/new" className={btnSecondaryClass}>
            New article
          </Link>
          <Link href="/admin/services/new" className={btnSecondaryClass}>
            New service
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((stat) => (
            <div key={stat.label} className={panelClass}>
              <p className="text-[11px] font-label uppercase tracking-[0.14em] text-charcoal/55">
                {stat.label}
              </p>
              <p className="mt-3 font-serif text-4xl text-aubergine">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className={panelClass}>
          <h2 className="font-serif text-2xl text-aubergine">Lead statuses</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {(
              (stats.leadStatuses || []) as unknown as Array<{
                status: string;
                count: number;
              }>
            ).length === 0 ? (
              <p className="text-sm text-charcoal/60">No inquiries yet.</p>
            ) : (
              (
                (stats.leadStatuses || []) as unknown as Array<{
                  status: string;
                  count: number;
                }>
              ).map((row) => (
                <div
                  key={row.status}
                  className="rounded-xl border border-charcoal/10 px-3 py-2"
                >
                  <StatusBadge status={row.status} />
                  <p className="mt-2 font-serif text-2xl text-aubergine">
                    {row.count}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={panelClass}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-aubergine">
                Recent inquiries
              </h2>
              <Link
                href="/admin/leads"
                className="text-xs font-label uppercase tracking-[0.14em] text-plum"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-charcoal/10">
              {leads.length === 0 ? (
                <li className="py-4 text-sm text-charcoal/60">
                  No inquiries yet.
                </li>
              ) : (
                leads.map((lead) => (
                  <li
                    key={lead._id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <Link
                        href={`/admin/leads/${lead._id}`}
                        className="font-medium text-aubergine hover:text-plum"
                      >
                        {lead.fullName}
                      </Link>
                      <p className="text-xs text-charcoal/55">{lead.email}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className={panelClass}>
            <h2 className="font-serif text-2xl text-aubergine">
              Recently updated
            </h2>
            <ul className="mt-4 space-y-3">
              {recent.length === 0 ? (
                <li className="text-sm text-charcoal/60">No recent updates.</li>
              ) : (
                recent.slice(0, 10).map((item) => (
                  <li
                    key={`${item.type}-${item.href}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <Link
                        href={item.href}
                        className="text-sm text-aubergine hover:text-plum"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-charcoal/45">
                        {item.type}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
