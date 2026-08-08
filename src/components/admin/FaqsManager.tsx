"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import { FAQ_CATEGORIES } from "@/lib/constants";

type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: "draft" | "published";
};

export function FaqsManager({ initial }: { initial: FaqItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<{
    question: string;
    answer: string;
    category: string;
    order: number;
    status: "published" | "draft";
  }>({
    question: "",
    answer: "",
    category: FAQ_CATEGORIES[0],
    order: items.length + 1,
    status: "published",
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (f) =>
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term) ||
        f.category.toLowerCase().includes(term)
    );
  }, [items, q]);

  async function createFaq() {
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Could not create FAQ", description: data.error, tone: "error" });
      return;
    }
    toast({ title: "FAQ created", tone: "success" });
    setForm({
      question: "",
      answer: "",
      category: FAQ_CATEGORIES[0],
      order: items.length + 2,
      status: "published",
    });
    router.refresh();
    setItems((prev) => [data.faq, ...prev]);
  }

  async function updateFaq(id: string, patch: Partial<FaqItem>) {
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Update failed", description: data.error, tone: "error" });
      return;
    }
    setItems((prev) => prev.map((f) => (f._id === id ? data.faq : f)));
    toast({ title: "FAQ updated", tone: "success" });
    router.refresh();
  }

  async function removeFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast({ title: "Delete failed", tone: "error" });
      return;
    }
    setItems((prev) => prev.filter((f) => f._id !== id));
    toast({ title: "FAQ deleted", tone: "success" });
    router.refresh();
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`${panelClass} space-y-3`}>
        <h2 className="font-serif text-xl text-aubergine">Add FAQ</h2>
        <input
          className={fieldClass}
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
        />
        <textarea
          className={fieldClass}
          rows={4}
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <select
            className={fieldClass}
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            {FAQ_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            className={fieldClass}
            value={form.order}
            onChange={(e) =>
              setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))
            }
          />
          <button type="button" className={btnPrimaryClass} onClick={createFaq}>
            Create FAQ
          </button>
        </div>
      </div>

      <input
        className={fieldClass}
        placeholder="Search FAQs"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="space-y-4">
        {filtered.map((faq) => (
          <div key={faq._id} className={`${panelClass} space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={faq.status} />
              <div className="flex gap-2">
                <button
                  type="button"
                  className={btnSecondaryClass}
                  onClick={() =>
                    updateFaq(faq._id, {
                      status: faq.status === "published" ? "draft" : "published",
                    })
                  }
                >
                  {faq.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  className={btnSecondaryClass}
                  onClick={() => removeFaq(faq._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <label className="block">
              <span className={labelClass}>Question</span>
              <input
                className={fieldClass}
                value={faq.question}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((f) =>
                      f._id === faq._id ? { ...f, question: e.target.value } : f
                    )
                  )
                }
                onBlur={(e) => updateFaq(faq._id, { question: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Answer</span>
              <textarea
                className={fieldClass}
                rows={4}
                value={faq.answer}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((f) =>
                      f._id === faq._id ? { ...f, answer: e.target.value } : f
                    )
                  )
                }
                onBlur={(e) => updateFaq(faq._id, { answer: e.target.value })}
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                className={fieldClass}
                value={faq.category}
                onChange={(e) => updateFaq(faq._id, { category: e.target.value })}
              >
                {[faq.category, ...FAQ_CATEGORIES]
                  .filter((v, i, arr) => arr.indexOf(v) === i)
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <input
                type="number"
                className={fieldClass}
                value={faq.order}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((f) =>
                      f._id === faq._id
                        ? { ...f, order: Number(e.target.value) || 0 }
                        : f
                    )
                  )
                }
                onBlur={(e) =>
                  updateFaq(faq._id, { order: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
