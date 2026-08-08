"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  panelClass,
} from "@/components/admin/admin-styles";

export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published";
  featured?: boolean;
  publishedAt?: string;
};

export function BlogManager({ initial }: { initial: BlogListItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((post) => {
      const term = q.trim().toLowerCase();
      const matchesQ =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.slug.toLowerCase().includes(term);
      const matchesCat = !category || post.category === category;
      return matchesQ && matchesCat;
    });
  }, [items, q, category]);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setItems((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...data.post } : p)),
      );
      toast({ title: "Article updated", tone: "success" });
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
      const res = await fetch(`/api/admin/blog/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplicate failed");
      toast({ title: "Article duplicated", tone: "success" });
      router.push(`/admin/blog/${data.post._id}`);
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
      const res = await fetch(`/api/admin/blog/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setItems((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
      toast({ title: "Article deleted", tone: "success" });
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className={`${fieldClass} max-w-sm`}
          placeholder="Search articles…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={`${fieldClass} max-w-xs`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {BLOG_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Link href="/admin/blog/new" className={`${btnPrimaryClass} ml-auto`}>
          New article
        </Link>
      </div>
      <div className="space-y-3">
        {filtered.map((post) => (
          <div key={post._id} className={`${panelClass} flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl text-aubergine">{post.title}</h2>
                <StatusBadge status={post.status} />
                {post.featured ? <StatusBadge status="featured" /> : null}
              </div>
              <p className="mt-1 text-xs text-charcoal/55">
                {post.category}
                {post.publishedAt
                  ? ` · ${new Date(post.publishedAt).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondaryClass}
                disabled={busyId === post._id}
                onClick={() =>
                  patch(post._id, {
                    status: post.status === "published" ? "draft" : "published",
                    publishedAt:
                      post.status === "published"
                        ? post.publishedAt
                        : new Date().toISOString(),
                  })
                }
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                className={btnSecondaryClass}
                disabled={busyId === post._id}
                onClick={() => patch(post._id, { featured: !post.featured })}
              >
                {post.featured ? "Unfeature" : "Feature"}
              </button>
              <button type="button" className={btnSecondaryClass} onClick={() => duplicate(post._id)}>
                Duplicate
              </button>
              <Link href={`/admin/blog/${post._id}`} className={btnSecondaryClass}>
                Edit
              </Link>
              <Link href={`/blog/${post.slug}`} target="_blank" className={btnSecondaryClass}>
                Preview
              </Link>
              <button type="button" className={btnSecondaryClass} onClick={() => setDeleteId(post._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-charcoal/60">No articles found.</p>
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete article?"
        description="This permanently removes the article."
        confirmLabel="Delete"
        tone="danger"
        loading={busyId === deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
