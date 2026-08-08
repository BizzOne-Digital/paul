"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  panelClass,
} from "@/components/admin/admin-styles";

export type ServiceListItem = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  featured?: boolean;
  order?: number;
  status: "draft" | "published";
};

export function ServicesManager({ initial }: { initial: ServiceListItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.slug.toLowerCase().includes(term) ||
        s.shortDescription.toLowerCase().includes(term),
    );
  }, [items, q]);

  async function patch(id: string, body: Partial<ServiceListItem>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setItems((prev) =>
        prev
          .map((s) => (s._id === id ? { ...s, ...data.service } : s))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      );
      toast({ title: "Service updated", tone: "success" });
      router.refresh();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplicate failed");
      toast({ title: "Service duplicated", tone: "success" });
      router.push(`/admin/services/${data.service._id}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Duplicate failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function remove() {
    if (!deleteId) return;
    setBusyId(deleteId);
    try {
      const res = await fetch(`/api/admin/services/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setItems((prev) => prev.filter((s) => s._id !== deleteId));
      toast({ title: "Service deleted", tone: "success" });
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function move(id: string, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = sorted.findIndex((s) => s._id === id);
    const swap = index + direction;
    if (index < 0 || swap < 0 || swap >= sorted.length) return;
    const a = sorted[index];
    const b = sorted[swap];
    const aOrder = a.order ?? index;
    const bOrder = b.order ?? swap;
    await Promise.all([
      patch(a._id, { order: bOrder }),
      patch(b._id, { order: aOrder }),
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          className={`${fieldClass} max-w-sm`}
          placeholder="Search services…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Link href="/admin/services/new" className={btnPrimaryClass}>
          New service
        </Link>
      </div>
      <div className="space-y-3">
        {filtered.map((service) => (
          <div key={service._id} className={`${panelClass} flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl text-aubergine">{service.name}</h2>
                <StatusBadge status={service.status} />
                {service.featured ? <StatusBadge status="featured" /> : null}
              </div>
              <p className="mt-1 text-sm text-charcoal/65 line-clamp-2">
                {service.shortDescription}
              </p>
              <p className="mt-1 text-xs text-charcoal/45">/{service.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btnSecondaryClass} disabled={busyId === service._id} onClick={() => move(service._id, -1)}>
                Up
              </button>
              <button type="button" className={btnSecondaryClass} disabled={busyId === service._id} onClick={() => move(service._id, 1)}>
                Down
              </button>
              <button
                type="button"
                className={btnSecondaryClass}
                disabled={busyId === service._id}
                onClick={() =>
                  patch(service._id, {
                    status: service.status === "published" ? "draft" : "published",
                  })
                }
              >
                {service.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                className={btnSecondaryClass}
                disabled={busyId === service._id}
                onClick={() => patch(service._id, { featured: !service.featured })}
              >
                {service.featured ? "Unfeature" : "Feature"}
              </button>
              <button type="button" className={btnSecondaryClass} disabled={busyId === service._id} onClick={() => duplicate(service._id)}>
                Duplicate
              </button>
              <Link href={`/admin/services/${service._id}`} className={btnSecondaryClass}>
                Edit
              </Link>
              <Link href={`/services/${service.slug}`} target="_blank" className={btnSecondaryClass}>
                View
              </Link>
              <button type="button" className={btnSecondaryClass} onClick={() => setDeleteId(service._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-charcoal/60">No services found.</p>
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete service?"
        description="This permanently removes the service from MongoDB."
        confirmLabel="Delete"
        tone="danger"
        loading={busyId === deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
