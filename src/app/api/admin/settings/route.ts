import { withAdmin } from "@/lib/admin-api";
import SiteSettings from "@/models/SiteSettings";
import { settingsSchema } from "@/lib/validations";
import { revalidateSettings } from "@/lib/revalidate";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { toPlain } from "@/lib/utils";

const DEFAULT_DOC = {
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
  complimentaryConsultationText: DEFAULT_SETTINGS.complimentaryConsultationText,
  defaultSeoTitle: DEFAULT_SETTINGS.defaultSeoTitle,
  defaultSeoDescription: DEFAULT_SETTINGS.defaultSeoDescription,
  legalDisclaimer: DEFAULT_SETTINGS.legalDisclaimer,
  copyrightText: DEFAULT_SETTINGS.copyright,
  googleMapsUrl: DEFAULT_SETTINGS.googleMapsUrl,
};

export async function GET() {
  return withAdmin(async () => {
    let doc = await SiteSettings.findOne({ singletonKey: "default" }).lean();
    if (!doc) {
      const created = await SiteSettings.create(DEFAULT_DOC);
      doc = created.toObject();
    }
    return { settings: toPlain(doc) };
  });
}

export async function PUT(request: Request) {
  return withAdmin(async () => {
    const body = settingsSchema.parse(await request.json());
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: "default" },
      {
        $set: {
          ...body,
          logo: body.logoUrl || body.logo || DEFAULT_SETTINGS.logo,
          logoLight: body.logoLightUrl || body.logoLight || DEFAULT_SETTINGS.logoLight,
          favicon: body.faviconUrl || body.favicon || DEFAULT_SETTINGS.favicon,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    revalidateSettings();
    return { settings: toPlain(settings.toObject()) };
  });
}
