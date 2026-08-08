"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PageSectionEditor } from "@/components/admin/PageSectionEditor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import type { HeroContent, PageSection, SEO } from "@/lib/types";

type PageData = {
  name: string;
  hero: HeroContent;
  sections: PageSection[];
  seo: SEO;
  status: "draft" | "published";
};

export function PageEditor({
  slug,
  initial,
  previewPath,
}: {
  slug: string;
  initial: PageData;
  previewPath: string;
}) {
  const { toast } = useToast();
  const [data, setData] = useState(initial);
  const [activeKey, setActiveKey] = useState(initial.sections[0]?.key || "hero");
  const [saving, setSaving] = useState(false);

  const activeSection = useMemo(
    () => data.sections.find((s) => s.key === activeKey) || null,
    [data.sections, activeKey],
  );

  async function savePage() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast({ title: "Page saved", tone: "success" });
    } catch (error) {
      toast({
        title: "Could not save page",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function saveSection() {
    if (!activeSection) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: activeSection }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast({ title: `Section “${activeSection.key}” saved`, tone: "success" });
    } catch (error) {
      toast({
        title: "Could not save section",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function updateSection(patch: Partial<PageSection>) {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.key === activeKey ? { ...s, ...patch, key: s.key } : s,
      ),
    }));
  }

  function addSection() {
    const key = `section-${Date.now()}`;
    const section: PageSection = {
      key,
      heading: "New section",
      visible: true,
      order: data.sections.length,
      lists: [],
      cards: [],
    };
    setData((prev) => ({ ...prev, sections: [...prev.sections, section] }));
    setActiveKey(key);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={data.status} />
          <select
            className={`${fieldClass} w-auto`}
            value={data.status}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                status: e.target.value as "draft" | "published",
              }))
            }
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={previewPath} target="_blank" className={btnSecondaryClass}>
            Preview
          </Link>
          <button
            type="button"
            onClick={saveSection}
            disabled={saving || !activeSection}
            className={btnSecondaryClass}
          >
            Save section
          </button>
          <button
            type="button"
            onClick={savePage}
            disabled={saving}
            className={btnPrimaryClass}
          >
            {saving ? "Saving…" : "Save page"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className={`${panelClass} h-fit space-y-2`}>
          <button
            type="button"
            onClick={() => setActiveKey("hero")}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
              activeKey === "hero"
                ? "bg-aubergine text-ivory"
                : "hover:bg-lavender-soft/50"
            }`}
          >
            Hero
          </button>
          {data.sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveKey(section.key)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                activeKey === section.key
                  ? "bg-aubergine text-ivory"
                  : "hover:bg-lavender-soft/50"
              }`}
            >
              <span className="block truncate font-medium">
                {section.heading || section.key}
              </span>
              <span className="block truncate text-[11px] opacity-70">
                {section.key}
              </span>
            </button>
          ))}
          <button type="button" onClick={addSection} className={`${btnSecondaryClass} w-full`}>
            Add section
          </button>
        </aside>

        <div className="space-y-4">
          {activeKey === "hero" ? (
            <div className={`${panelClass} space-y-4`}>
              <h2 className="font-serif text-2xl text-aubergine">Hero</h2>
              <Field
                label="Eyebrow"
                value={data.hero.eyebrow || ""}
                onChange={(v) =>
                  setData((p) => ({ ...p, hero: { ...p.hero, eyebrow: v } }))
                }
              />
              <Field
                label="Heading"
                value={data.hero.heading || ""}
                onChange={(v) =>
                  setData((p) => ({ ...p, hero: { ...p.hero, heading: v } }))
                }
              />
              <Field
                label="Subheading"
                value={data.hero.subheading || ""}
                onChange={(v) =>
                  setData((p) => ({ ...p, hero: { ...p.hero, subheading: v } }))
                }
              />
              <TextArea
                label="Body"
                value={data.hero.body || ""}
                onChange={(v) =>
                  setData((p) => ({ ...p, hero: { ...p.hero, body: v } }))
                }
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Primary CTA label"
                  value={data.hero.primaryCta?.label || ""}
                  onChange={(v) =>
                    setData((p) => ({
                      ...p,
                      hero: {
                        ...p.hero,
                        primaryCta: { ...p.hero.primaryCta, label: v },
                      },
                    }))
                  }
                />
                <Field
                  label="Primary CTA link"
                  value={data.hero.primaryCta?.href || ""}
                  onChange={(v) =>
                    setData((p) => ({
                      ...p,
                      hero: {
                        ...p.hero,
                        primaryCta: { ...p.hero.primaryCta, href: v },
                      },
                    }))
                  }
                />
              </div>
              <ImageUploader
                label="Hero image"
                category="pages"
                value={data.hero.image?.url}
                alt={data.hero.image?.alt}
                onChange={(url) =>
                  setData((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      image: url
                        ? { url, alt: p.hero.image?.alt || "" }
                        : undefined,
                    },
                  }))
                }
              />
            </div>
          ) : activeSection ? (
            <PageSectionEditor section={activeSection} onChange={updateSection} />
          ) : null}

          <div className={`${panelClass} space-y-4`}>
            <h2 className="font-serif text-2xl text-aubergine">SEO</h2>
            <Field
              label="SEO title"
              value={data.seo.title || ""}
              onChange={(v) =>
                setData((p) => ({ ...p, seo: { ...p.seo, title: v } }))
              }
            />
            <TextArea
              label="SEO description"
              value={data.seo.description || ""}
              onChange={(v) =>
                setData((p) => ({ ...p, seo: { ...p.seo, description: v } }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        className={`${fieldClass} min-h-28`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
