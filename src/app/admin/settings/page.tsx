import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getSession } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { toPlain } from "@/lib/utils";
import type { SiteSettingsFields } from "@/lib/types";

export const dynamic = "force-dynamic";

function toEditorSettings(doc: Record<string, unknown> | null): SiteSettingsFields {
  return {
    websiteName:
      String(doc?.websiteName || DEFAULT_SETTINGS.websiteName),
    legalBusinessName: String(doc?.legalBusinessName || ""),
    logoUrl: String(doc?.logoUrl || DEFAULT_SETTINGS.logo),
    logoLightUrl: String(doc?.logoLightUrl || DEFAULT_SETTINGS.logoLight),
    faviconUrl: String(doc?.faviconUrl || DEFAULT_SETTINGS.favicon),
    companyDescription: String(
      doc?.companyDescription || DEFAULT_SETTINGS.companyDescription,
    ),
    email: String(doc?.email || DEFAULT_SETTINGS.email),
    phone: String(doc?.phone || DEFAULT_SETTINGS.phone),
    phoneHref: String(doc?.phoneHref || `tel:${DEFAULT_SETTINGS.phoneTel}`),
    socialHandle: String(doc?.socialHandle || DEFAULT_SETTINGS.socialHandle),
    socialPlatform: String(doc?.socialPlatform || ""),
    socialUrl: String(doc?.socialUrl || ""),
    serviceArea: String(doc?.serviceArea || DEFAULT_SETTINGS.serviceArea),
    businessHours: String(doc?.businessHours || DEFAULT_SETTINGS.businessHours),
    headerCtaLabel: String(
      doc?.headerCtaLabel || DEFAULT_SETTINGS.headerCtaLabel,
    ),
    headerCtaHref: String(doc?.headerCtaHref || DEFAULT_SETTINGS.headerCtaHref),
    footerCtaLabel: String(
      doc?.footerCtaLabel || DEFAULT_SETTINGS.footerCtaLabel,
    ),
    footerCtaHref: String(doc?.footerCtaHref || DEFAULT_SETTINGS.footerCtaHref),
    complimentaryConsultationText: String(
      doc?.complimentaryConsultationText ||
        DEFAULT_SETTINGS.complimentaryConsultationText,
    ),
    defaultSeoTitle: String(
      doc?.defaultSeoTitle || DEFAULT_SETTINGS.defaultSeoTitle,
    ),
    defaultSeoDescription: String(
      doc?.defaultSeoDescription || DEFAULT_SETTINGS.defaultSeoDescription,
    ),
    legalDisclaimer: String(
      doc?.legalDisclaimer || DEFAULT_SETTINGS.legalDisclaimer,
    ),
    copyrightText: String(doc?.copyrightText || DEFAULT_SETTINGS.copyright),
    googleMapsUrl: String(doc?.googleMapsUrl || ""),
  };
}

export default async function AdminSettingsPage() {
  const session = await getSession();
  await connectMongo();

  let doc = await SiteSettings.findOne({ singletonKey: "default" }).lean();
  if (!doc) {
    const created = await SiteSettings.create({
      singletonKey: "default",
      websiteName: DEFAULT_SETTINGS.websiteName,
      legalBusinessName: DEFAULT_SETTINGS.legalBusinessName,
      logoUrl: DEFAULT_SETTINGS.logo,
      logoLightUrl: DEFAULT_SETTINGS.logoLight,
      faviconUrl: DEFAULT_SETTINGS.favicon,
      companyDescription: DEFAULT_SETTINGS.companyDescription,
      email: DEFAULT_SETTINGS.email,
      phone: DEFAULT_SETTINGS.phone,
      phoneHref: `tel:${DEFAULT_SETTINGS.phoneTel}`,
      socialHandle: DEFAULT_SETTINGS.socialHandle,
      socialPlatform: DEFAULT_SETTINGS.socialPlatform,
      socialUrl: DEFAULT_SETTINGS.socialUrl,
      serviceArea: DEFAULT_SETTINGS.serviceArea,
      businessHours: DEFAULT_SETTINGS.businessHours,
      headerCtaLabel: DEFAULT_SETTINGS.headerCtaLabel,
      headerCtaHref: DEFAULT_SETTINGS.headerCtaHref,
      footerCtaLabel: DEFAULT_SETTINGS.footerCtaLabel,
      footerCtaHref: DEFAULT_SETTINGS.footerCtaHref,
      complimentaryConsultationText:
        DEFAULT_SETTINGS.complimentaryConsultationText,
      defaultSeoTitle: DEFAULT_SETTINGS.defaultSeoTitle,
      defaultSeoDescription: DEFAULT_SETTINGS.defaultSeoDescription,
      legalDisclaimer: DEFAULT_SETTINGS.legalDisclaimer,
      copyrightText: DEFAULT_SETTINGS.copyright,
      googleMapsUrl: DEFAULT_SETTINGS.googleMapsUrl,
    });
    doc = created.toObject();
  }

  return (
    <>
      <AdminHeader title="Settings" email={session?.email} />
      <main className="p-6">
        <SettingsEditor
          initial={toEditorSettings(toPlain(doc) as Record<string, unknown>)}
        />
      </main>
    </>
  );
}
