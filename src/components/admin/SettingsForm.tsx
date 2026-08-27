"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        logoUrl: form.logo,
        logoLightUrl: form.logoLight,
        faviconUrl: form.favicon,
        phoneHref: form.phoneTel ? `tel:${form.phoneTel}` : "",
        copyrightText: form.copyright,
      };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast({ title: "Settings saved", tone: "success" });
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

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="space-y-4 p-6">
        <div className="flex justify-end">
          <button type="button" className={btnPrimaryClass} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>

        <div className={`${panelClass} grid gap-4 md:grid-cols-2`}>
          <Field label="Website name" value={form.websiteName} onChange={(v) => set("websiteName", v)} />
          <Field label="Legal business name" value={form.legalBusinessName} onChange={(v) => set("legalBusinessName", v)} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
          <Field label="Service area" value={form.serviceArea} onChange={(v) => set("serviceArea", v)} />
          <label className="block md:col-span-2">
            <span className={labelClass}>Company description</span>
            <textarea className={fieldClass} rows={4} value={form.companyDescription} onChange={(e) => set("companyDescription", e.target.value)} />
          </label>
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Phone display" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Phone tel link digits" value={form.phoneTel} onChange={(v) => set("phoneTel", v)} />
          <Field label="Business hours" value={form.businessHours} onChange={(v) => set("businessHours", v)} />
          <Field label="Social handle" value={form.socialHandle} onChange={(v) => set("socialHandle", v)} />
          <Field label="Social platform" value={form.socialPlatform} onChange={(v) => set("socialPlatform", v)} />
          <Field label="Social URL (required for public icon)" value={form.socialUrl} onChange={(v) => set("socialUrl", v)} />
          <Field label="Header CTA label" value={form.headerCtaLabel} onChange={(v) => set("headerCtaLabel", v)} />
          <Field label="Header CTA href" value={form.headerCtaHref} onChange={(v) => set("headerCtaHref", v)} />
          <Field label="Footer CTA label" value={form.footerCtaLabel} onChange={(v) => set("footerCtaLabel", v)} />
          <Field label="Footer CTA href" value={form.footerCtaHref} onChange={(v) => set("footerCtaHref", v)} />
          <label className="block md:col-span-2">
            <span className={labelClass}>Complimentary consultation text</span>
            <textarea className={fieldClass} rows={3} value={form.complimentaryConsultationText} onChange={(e) => set("complimentaryConsultationText", e.target.value)} />
          </label>
          <Field label="Default SEO title" value={form.defaultSeoTitle} onChange={(v) => set("defaultSeoTitle", v)} />
          <label className="block md:col-span-2">
            <span className={labelClass}>Default SEO description</span>
            <textarea className={fieldClass} rows={3} value={form.defaultSeoDescription} onChange={(e) => set("defaultSeoDescription", e.target.value)} />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass}>Legal disclaimer</span>
            <textarea className={fieldClass} rows={4} value={form.legalDisclaimer} onChange={(e) => set("legalDisclaimer", e.target.value)} />
          </label>
          <Field label="Copyright" value={form.copyright} onChange={(v) => set("copyright", v)} />
          <Field label="Google Maps URL" value={form.googleMapsUrl} onChange={(v) => set("googleMapsUrl", v)} />
        </div>

        <div className={`${panelClass} grid gap-6 md:grid-cols-3`}>
          <ImageUploader folder="misc" label="Logo" value={form.logo} onChange={(url) => set("logo", url || "/brand/logo-symbol.svg")} />
          <ImageUploader folder="misc" label="Logo light" value={form.logoLight} onChange={(url) => set("logoLight", url || "/brand/logo-symbol-light.svg")} />
          <ImageUploader folder="misc" label="Favicon" value={form.favicon} onChange={(url) => set("favicon", url || "/brand/favicon.svg")} />
        </div>
      </div>
    </>
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
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
