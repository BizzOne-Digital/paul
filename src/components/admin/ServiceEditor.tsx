"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import type { ServiceDetailPage, SEO, ImageRef } from "@/lib/types";

export type ServiceForm = {
  name: string;
  slug: string;
  shortDescription: string;
  listingImage?: string | ImageRef | null;
  listingImageAlt?: string;
  featured?: boolean;
  order?: number;
  status: "draft" | "published";
  detailPage?: ServiceDetailPage;
  seo?: SEO;
};

const tabs = ["Listing Information", "Detail Page", "SEO"] as const;

export function ServiceEditor({
  initial,
  id,
}: {
  initial: ServiceForm;
  id?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Listing Information");
  const [form, setForm] = useState<ServiceForm>(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        listingImage: mediaUrl(form.listingImage) || "",
      };
      const res = await fetch(id ? `/api/admin/services/${id}` : "/api/admin/services", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast({ title: "Service saved", tone: "success" });
      if (!id) router.replace(`/admin/services/${data.service._id}`);
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

  const detail = form.detailPage || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={
              tab === item
                ? btnPrimaryClass
                : btnSecondaryClass
            }
          >
            {item}
          </button>
        ))}
        <button type="button" onClick={save} disabled={saving} className={`${btnPrimaryClass} ml-auto`}>
          {saving ? "Saving…" : "Save service"}
        </button>
      </div>

      {tab === "Listing Information" ? (
        <div className={`${panelClass} space-y-4`}>
          <Field label="Service name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v, slug: p.slug || slugify(v) }))} />
          <Field label="Slug" value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: slugify(v) }))} />
          <TextArea label="Short description" value={form.shortDescription} onChange={(v) => setForm((p) => ({ ...p, shortDescription: v }))} />
          <ImageUploader
            label="Card image"
            category="services"
            value={mediaUrl(form.listingImage)}
            onChange={(url) =>
              setForm((p) => ({
                ...p,
                listingImage: url || "",
              }))
            }
          />
          <Field label="Image alt" value={form.listingImageAlt || ""} onChange={(v) => setForm((p) => ({ ...p, listingImageAlt: v }))} />
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Display order" type="number" value={String(form.order ?? 0)} onChange={(v) => setForm((p) => ({ ...p, order: Number(v) || 0 }))} />
            <label className="flex items-center gap-2 text-sm pt-6">
              <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
              Featured
            </label>
            <div>
              <label className={labelClass}>Status</label>
              <select className={fieldClass} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "draft" | "published" }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Detail Page" ? (
        <div className={`${panelClass} space-y-4`}>
          <Field label="Hero heading" value={detail.hero?.heading || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, hero: { ...p.detailPage?.hero, heading: v } } }))} />
          <TextArea label="Hero body" value={detail.hero?.body || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, hero: { ...p.detailPage?.hero, body: v } } }))} />
          <ImageUploader
            label="Hero image"
            category="services"
            value={mediaUrl(detail.hero?.image)}
            onChange={(url) =>
              setForm((p) => ({
                ...p,
                detailPage: {
                  ...p.detailPage,
                  hero: {
                    ...p.detailPage?.hero,
                    image: url
                      ? {
                          url,
                          alt:
                            (typeof p.detailPage?.hero?.image === "object" &&
                              p.detailPage?.hero?.image?.alt) ||
                            "",
                        }
                      : undefined,
                  },
                },
              }))
            }
          />
          <TextArea label="Overview" value={detail.overview || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, overview: v } }))} />
          <TextArea
            label="Audience (one per line)"
            value={(Array.isArray(detail.audience)
              ? detail.audience
              : detail.audience
                ? [detail.audience]
                : []
            ).join("\n")}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                detailPage: { ...p.detailPage, audience: lines(v) },
              }))
            }
          />
          <TextArea label="Key questions (one per line)" value={(detail.keyQuestions || []).join("\n")} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, keyQuestions: lines(v) } }))} />
          <TextArea label="Included items (one per line)" value={(detail.includedItems || []).join("\n")} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, includedItems: lines(v) } }))} />
          <TextArea
            label="Process steps (Title | Body per line)"
            value={(detail.processSteps || []).map((s) => `${s.title || ""} | ${s.body || ""}`).join("\n")}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                detailPage: {
                  ...p.detailPage,
                  processSteps: v
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [title, ...rest] = line.split("|");
                      return { title: title?.trim(), body: rest.join("|").trim() };
                    }),
                },
              }))
            }
          />
          <TextArea label="Professional disclaimer" value={detail.professionalDisclaimer || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, professionalDisclaimer: v } }))} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="CTA label" value={detail.cta?.label || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, cta: { ...p.detailPage?.cta, label: v } } }))} />
            <Field label="CTA href" value={detail.cta?.href || ""} onChange={(v) => setForm((p) => ({ ...p, detailPage: { ...p.detailPage, cta: { ...p.detailPage?.cta, href: v } } }))} />
          </div>
          <TextArea
            label="Related service slugs (one per line)"
            value={(detail.relatedServiceSlugs || []).join("\n")}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                detailPage: { ...p.detailPage, relatedServiceSlugs: lines(v) },
              }))
            }
          />
        </div>
      ) : null}

      {tab === "SEO" ? (
        <div className={`${panelClass} space-y-4`}>
          <Field label="SEO title" value={form.seo?.title || ""} onChange={(v) => setForm((p) => ({ ...p, seo: { ...p.seo, title: v } }))} />
          <TextArea label="SEO description" value={form.seo?.description || ""} onChange={(v) => setForm((p) => ({ ...p, seo: { ...p.seo, description: v } }))} />
          <Field label="OG image URL" value={form.seo?.ogImage || ""} onChange={(v) => setForm((p) => ({ ...p, seo: { ...p.seo, ogImage: v } }))} />
        </div>
      ) : null}
    </div>
  );
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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
