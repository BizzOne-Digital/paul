"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import { mediaUrl } from "@/lib/media";
import { slugify } from "@/lib/utils";
import type { ContentBlock, ImageRef, SEO } from "@/lib/types";

export type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  contentSections: ContentBlock[];
  coverImage?: string | ImageRef | null;
  coverImageAlt?: string;
  author?: string;
  category: string;
  tags?: string[];
  publishedAt?: string | null;
  featured?: boolean;
  status: "draft" | "published";
  seo?: SEO;
};

export function BlogEditor({ initial, id }: { initial: BlogForm; id?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<BlogForm>({
    ...initial,
    coverImage: mediaUrl(initial.coverImage) || "",
    publishedAt: initial.publishedAt || null,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/blog/${id}` : "/api/admin/blog", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.title),
          coverImage: mediaUrl(form.coverImage) || "",
          publishedAt: form.publishedAt || null,
          contentSections: form.contentSections.map((section, index) => ({
            ...section,
            image: mediaUrl(section.image) || "",
            order: section.order ?? index,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast({ title: "Article saved", tone: "success" });
      if (!id) router.replace(`/admin/blog/${data.post._id}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function updateSection(index: number, patch: Partial<ContentBlock>) {
    setForm((prev) => {
      const contentSections = [...prev.contentSections];
      contentSections[index] = {
        ...contentSections[index],
        ...patch,
        key: contentSections[index].key,
      };
      return { ...prev, contentSections };
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={save} disabled={saving} className={btnPrimaryClass}>
          {saving ? "Saving…" : "Save article"}
        </button>
        {form.slug ? (
          <a href={`/blog/${form.slug}`} target="_blank" className={btnSecondaryClass} rel="noreferrer">
            Preview
          </a>
        ) : null}
      </div>

      <div className={`${panelClass} space-y-4`}>
        <Field
          label="Title"
          value={form.title}
          onChange={(v) =>
            setForm((p) => ({ ...p, title: v, slug: p.slug || slugify(v) }))
          }
        />
        <Field label="Slug" value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: slugify(v) }))} />
        <TextArea label="Excerpt" value={form.excerpt} onChange={(v) => setForm((p) => ({ ...p, excerpt: v }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={fieldClass}
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Field label="Author" value={form.author || ""} onChange={(v) => setForm((p) => ({ ...p, author: v }))} />
          <Field
            label="Tags (comma separated)"
            value={(form.tags || []).join(", ")}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                tags: v
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
          />
          <Field
            label="Schedule / publish at"
            type="datetime-local"
            value={toLocalInput(form.publishedAt)}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                publishedAt: v ? new Date(v).toISOString() : null,
              }))
            }
          />
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={fieldClass}
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  status: e.target.value as "draft" | "published",
                }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
            />
            Featured
          </label>
        </div>
        <ImageUploader
          label="Cover image"
          folder="gallery"
          value={mediaUrl(form.coverImage)}
          onChange={(url) => setForm((p) => ({ ...p, coverImage: url || "" }))}
        />
        <Field
          label="Cover image alt"
          value={form.coverImageAlt || ""}
          onChange={(v) => setForm((p) => ({ ...p, coverImageAlt: v }))}
        />
      </div>

      <div className={`${panelClass} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-aubergine">Content sections</h2>
          <button
            type="button"
            className={btnSecondaryClass}
            onClick={() =>
              setForm((p) => ({
                ...p,
                contentSections: [
                  ...p.contentSections,
                  {
                    key: `block-${Date.now()}`,
                    type: "paragraph",
                    body: "",
                    order: p.contentSections.length,
                  },
                ],
              }))
            }
          >
            Add section
          </button>
        </div>
        {form.contentSections.map((section, index) => (
          <div key={section.key} className="space-y-3 rounded-xl border border-charcoal/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-label uppercase tracking-[0.14em] text-charcoal/55">
                {section.key}
              </p>
              <button
                type="button"
                className="text-xs text-burgundy"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    contentSections: p.contentSections.filter((_, i) => i !== index),
                  }))
                }
              >
                Remove
              </button>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={fieldClass}
                value={section.type || "paragraph"}
                onChange={(e) =>
                  updateSection(index, {
                    type: e.target.value as ContentBlock["type"],
                  })
                }
              >
                {["paragraph", "heading", "list", "quote", "image", "callout"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Heading"
              value={section.heading || ""}
              onChange={(v) => updateSection(index, { heading: v })}
            />
            <TextArea
              label="Body"
              value={section.body || ""}
              onChange={(v) => updateSection(index, { body: v })}
            />
            {section.type === "list" ? (
              <TextArea
                label="List items (one per line)"
                value={(section.items || []).join("\n")}
                onChange={(v) =>
                  updateSection(index, {
                    items: v
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
              />
            ) : null}
            {(section.type === "image" || section.image) && (
              <ImageUploader
                label="Section image"
                folder="gallery"
                value={mediaUrl(section.image)}
                onChange={(url) => updateSection(index, { image: url || "" })}
              />
            )}
          </div>
        ))}
      </div>

      <div className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">SEO</h2>
        <Field
          label="SEO title"
          value={form.seo?.title || ""}
          onChange={(v) => setForm((p) => ({ ...p, seo: { ...p.seo, title: v } }))}
        />
        <TextArea
          label="SEO description"
          value={form.seo?.description || ""}
          onChange={(v) =>
            setForm((p) => ({ ...p, seo: { ...p.seo, description: v } }))
          }
        />
      </div>
    </div>
  );
}

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{props.label}</label>
      <input
        type={props.type || "text"}
        className={fieldClass}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{props.label}</label>
      <textarea
        className={fieldClass + " min-h-28"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
