"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";
import {
  btnPrimaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import { isValidHttpUrl } from "@/lib/utils";
import type { SiteSettingsFields } from "@/lib/types";

export function SettingsEditor({ initial }: { initial: SiteSettingsFields }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteSettingsFields>(key: K, value: SiteSettingsFields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setForm({ ...form, ...data.settings });
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

  const socialValid = isValidHttpUrl(form.socialUrl);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className={btnPrimaryClass}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      <section className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">Brand</h2>
        <Field label="Website name" value={form.websiteName} onChange={(v) => set("websiteName", v)} />
        <Field label="Legal business name" value={form.legalBusinessName || ""} onChange={(v) => set("legalBusinessName", v)} />
        <TextArea label="Company description" value={form.companyDescription || ""} onChange={(v) => set("companyDescription", v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUploader
            label="Logo"
            folder="misc"
            value={form.logoUrl}
            onChange={(url) => set("logoUrl", url || "")}
          />
          <ImageUploader
            label="Logo (light)"
            folder="misc"
            value={form.logoLightUrl}
            onChange={(url) => set("logoLightUrl", url || "")}
          />
        </div>
        <ImageUploader
          label="Favicon"
          folder="misc"
          value={form.faviconUrl}
          onChange={(url) => set("faviconUrl", url || "")}
        />
      </section>

      <section className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">Contact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Phone href" value={form.phoneHref || ""} onChange={(v) => set("phoneHref", v)} />
          <Field label="Service area" value={form.serviceArea || ""} onChange={(v) => set("serviceArea", v)} />
          <Field label="Business hours" value={form.businessHours || ""} onChange={(v) => set("businessHours", v)} />
          <Field label="Google Maps URL" value={form.googleMapsUrl || ""} onChange={(v) => set("googleMapsUrl", v)} />
        </div>
      </section>

      <section className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">Social</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Social handle" value={form.socialHandle || ""} onChange={(v) => set("socialHandle", v)} />
          <Field label="Social platform" value={form.socialPlatform || ""} onChange={(v) => set("socialPlatform", v)} />
          <Field label="Social URL" value={form.socialUrl || ""} onChange={(v) => set("socialUrl", v)} />
        </div>
        <p className="text-sm text-charcoal/65">
          Public social icon appears only when the URL is a valid http(s) link.
          Current:{" "}
          <span className={socialValid ? "text-aubergine" : "text-burgundy"}>
            {socialValid ? "valid — icon will show" : "invalid/empty — icon hidden"}
          </span>
        </p>
      </section>

      <section className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">CTAs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Header CTA label" value={form.headerCtaLabel || ""} onChange={(v) => set("headerCtaLabel", v)} />
          <Field label="Header CTA href" value={form.headerCtaHref || ""} onChange={(v) => set("headerCtaHref", v)} />
          <Field label="Footer CTA label" value={form.footerCtaLabel || ""} onChange={(v) => set("footerCtaLabel", v)} />
          <Field label="Footer CTA href" value={form.footerCtaHref || ""} onChange={(v) => set("footerCtaHref", v)} />
        </div>
        <TextArea
          label="Complimentary consultation text"
          value={form.complimentaryConsultationText || ""}
          onChange={(v) => set("complimentaryConsultationText", v)}
        />
      </section>

      <section className={`${panelClass} space-y-4`}>
        <h2 className="font-serif text-2xl text-aubergine">SEO & legal</h2>
        <Field label="Default SEO title" value={form.defaultSeoTitle || ""} onChange={(v) => set("defaultSeoTitle", v)} />
        <TextArea label="Default SEO description" value={form.defaultSeoDescription || ""} onChange={(v) => set("defaultSeoDescription", v)} />
        <TextArea label="Default SEO keywords (comma-separated)" value={form.defaultSeoKeywords || ""} onChange={(v) => set("defaultSeoKeywords", v)} />
        <TextArea label="Legal disclaimer" value={form.legalDisclaimer || ""} onChange={(v) => set("legalDisclaimer", v)} />
        <Field label="Copyright text" value={form.copyrightText || ""} onChange={(v) => set("copyrightText", v)} />
      </section>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{props.label}</label>
      <input
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
