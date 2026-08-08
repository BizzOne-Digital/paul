"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import { LEAD_STATUSES } from "@/lib/constants";

type Lead = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  reason: string;
  timeframe: string;
  preferredRegion?: string;
  acquisitionType?: string;
  budgetRange?: string;
  currentStage?: string;
  preferredContactMethod?: string;
  details?: string;
  consent: boolean;
  status: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export function LeadDetail({ lead }: { lead: Lead }) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.internalNotes || "");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast({ title: "Lead updated", tone: "success" });
      router.refresh();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast({ title: "Lead deleted", tone: "success" });
      router.push("/admin/leads");
      router.refresh();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader title={lead.fullName} />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <button type="button" className={btnPrimaryClass} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            className={btnSecondaryClass}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className={`${panelClass} space-y-3 lg:col-span-2`}>
            <Row label="Email">
              <a className="text-plum underline" href={`mailto:${lead.email}`}>
                {lead.email}
              </a>
            </Row>
            <Row label="Phone">
              <a
                className="text-plum underline"
                href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
              >
                {lead.phone}
              </a>
            </Row>
            <Row label="Reason">{lead.reason}</Row>
            <Row label="Timeframe">{lead.timeframe}</Row>
            <Row label="Region">{lead.preferredRegion || "—"}</Row>
            <Row label="Acquisition type">{lead.acquisitionType || "—"}</Row>
            <Row label="Budget">{lead.budgetRange || "—"}</Row>
            <Row label="Stage">{lead.currentStage || "—"}</Row>
            <Row label="Preferred contact">
              {lead.preferredContactMethod || "—"}
            </Row>
            <Row label="Consent">{lead.consent ? "Yes" : "No"}</Row>
            <Row label="Details">
              <p className="whitespace-pre-wrap">{lead.details || "—"}</p>
            </Row>
            <Row label="Created">{new Date(lead.createdAt).toLocaleString()}</Row>
            <Row label="Updated">{new Date(lead.updatedAt).toLocaleString()}</Row>
          </div>

          <div className={`${panelClass} space-y-4`}>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Internal notes</span>
              <textarea
                className={fieldClass}
                rows={8}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this inquiry?"
        description="This permanently removes the lead from MongoDB."
        confirmLabel="Delete"
        tone="danger"
        loading={saving}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={remove}
      />
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="mt-1 text-sm text-charcoal">{children}</div>
    </div>
  );
}
