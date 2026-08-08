"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LEAD_STATUSES } from "@/lib/constants";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fieldClass, panelClass } from "@/components/admin/admin-styles";

export type LeadListItem = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  timeframe: string;
  acquisitionType?: string;
  status: string;
  createdAt: string;
};

export function LeadsManager({ initial }: { initial: LeadListItem[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return initial.filter((lead) => {
      const term = q.trim().toLowerCase();
      const matchesQ =
        !term ||
        lead.fullName.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term) ||
        lead.reason.toLowerCase().includes(term);
      const matchesStatus = !status || lead.status === status;
      return matchesQ && matchesStatus;
    });
  }, [initial, q, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className={`${fieldClass} max-w-sm`}
          placeholder="Search leads…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={`${fieldClass} max-w-xs`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={`${panelClass} overflow-x-auto`}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 text-[11px] font-label uppercase tracking-[0.12em] text-charcoal/55">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Timeframe</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead._id} className="border-b border-charcoal/5 hover:bg-lavender-soft/30">
                <td className="px-3 py-3">
                  <Link href={`/admin/leads/${lead._id}`} className="font-medium text-aubergine hover:text-plum">
                    {lead.fullName}
                  </Link>
                </td>
                <td className="px-3 py-3">{lead.email}</td>
                <td className="px-3 py-3">{lead.phone}</td>
                <td className="px-3 py-3">{lead.reason}</td>
                <td className="px-3 py-3">{lead.timeframe}</td>
                <td className="px-3 py-3">{lead.acquisitionType || "—"}</td>
                <td className="px-3 py-3">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={lead.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-charcoal/55">
                  No leads match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
