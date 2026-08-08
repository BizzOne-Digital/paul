import { cache } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import type { SiteSettingsData } from "@/lib/types";

export type SiteSettings = {
  websiteName: string;
  legalBusinessName: string;
  logo: string;
  logoLight: string;
  favicon: string;
  companyDescription: string;
  email: string;
  phone: string;
  phoneTel: string;
  socialHandle: string;
  socialPlatform: string;
  socialUrl: string;
  serviceArea: string;
  businessHours: string;
  headerCtaLabel: string;
  headerCtaHref: string;
  footerCtaLabel: string;
  footerCtaHref: string;
  complimentaryConsultationText: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  legalDisclaimer: string;
  copyright: string;
  googleMapsUrl: string;
  tagline: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  websiteName: "BC Winery Buyer Advisory",
  legalBusinessName: "",
  logo: "/brand/logo-symbol.svg",
  logoLight: "/brand/logo-symbol-light.svg",
  favicon: "/brand/favicon.svg",
  companyDescription:
    "An information resource and professional consulting service for buyers considering the acquisition of wineries, vineyards, winery estates, and related wine-industry businesses in British Columbia.",
  email: "paulmgraydon@gmail.com",
  phone: "+1 (250) 809-2342",
  phoneTel: "+12508092342",
  socialHandle: "faithwilson",
  socialPlatform: "",
  socialUrl: "",
  serviceArea: "British Columbia, Canada",
  businessHours: "By appointment",
  headerCtaLabel: "Book a Complimentary Call",
  headerCtaHref: "/contact",
  footerCtaLabel: "Schedule Your Initial Call",
  footerCtaHref: "/contact",
  complimentaryConsultationText:
    "The initial consultation call is complimentary and provides an opportunity to discuss your acquisition goals, preferred type of winery or vineyard, and expected timeframe.",
  defaultSeoTitle:
    "BC Winery Buyer Advisory | Guidance for Prospective Winery Buyers",
  defaultSeoDescription:
    "Buyer-focused information and professional consulting support for winery, vineyard, and wine-country acquisitions across British Columbia.",
  legalDisclaimer:
    "Information on this website is provided for general informational and consulting purposes. It is not legal, tax, accounting, financial, appraisal, inspection, licensing, or brokerage advice. Buyers should consult appropriately qualified professionals before making acquisition decisions.",
  copyright: `© ${new Date().getFullYear()} BC Winery Buyer Advisory. All rights reserved.`,
  googleMapsUrl: "",
  tagline: "Guidance for BC Winery Buyers",
};

function mapSettings(doc: SiteSettingsData | null | undefined): SiteSettings {
  if (!doc) return DEFAULT_SETTINGS;

  const phoneTel =
    doc.phoneTel ||
    (doc.phoneHref ? doc.phoneHref.replace(/^tel:/, "") : "") ||
    DEFAULT_SETTINGS.phoneTel;

  const copyrightRaw =
    doc.copyright || doc.copyrightText || DEFAULT_SETTINGS.copyright;

  return {
    websiteName: doc.websiteName || DEFAULT_SETTINGS.websiteName,
    legalBusinessName:
      doc.legalBusinessName || DEFAULT_SETTINGS.legalBusinessName,
    logo: doc.logo || doc.logoUrl || DEFAULT_SETTINGS.logo,
    logoLight: doc.logoLight || doc.logoLightUrl || DEFAULT_SETTINGS.logoLight,
    favicon: doc.favicon || doc.faviconUrl || DEFAULT_SETTINGS.favicon,
    companyDescription:
      doc.companyDescription || DEFAULT_SETTINGS.companyDescription,
    email: doc.email || DEFAULT_SETTINGS.email,
    phone: doc.phone || DEFAULT_SETTINGS.phone,
    phoneTel,
    socialHandle: doc.socialHandle || DEFAULT_SETTINGS.socialHandle,
    socialPlatform: doc.socialPlatform || DEFAULT_SETTINGS.socialPlatform,
    socialUrl: doc.socialUrl || DEFAULT_SETTINGS.socialUrl,
    serviceArea: doc.serviceArea || DEFAULT_SETTINGS.serviceArea,
    businessHours: doc.businessHours || DEFAULT_SETTINGS.businessHours,
    headerCtaLabel: doc.headerCtaLabel || DEFAULT_SETTINGS.headerCtaLabel,
    headerCtaHref: doc.headerCtaHref || DEFAULT_SETTINGS.headerCtaHref,
    footerCtaLabel: doc.footerCtaLabel || DEFAULT_SETTINGS.footerCtaLabel,
    footerCtaHref: doc.footerCtaHref || DEFAULT_SETTINGS.footerCtaHref,
    complimentaryConsultationText:
      doc.complimentaryConsultationText ||
      DEFAULT_SETTINGS.complimentaryConsultationText,
    defaultSeoTitle: doc.defaultSeoTitle || DEFAULT_SETTINGS.defaultSeoTitle,
    defaultSeoDescription:
      doc.defaultSeoDescription || DEFAULT_SETTINGS.defaultSeoDescription,
    legalDisclaimer: doc.legalDisclaimer || DEFAULT_SETTINGS.legalDisclaimer,
    copyright: copyrightRaw.replace("{year}", String(new Date().getFullYear())),
    googleMapsUrl: doc.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl,
    tagline: doc.tagline || DEFAULT_SETTINGS.tagline,
  };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    await connectToDatabase();
    const { SiteSettings: SiteSettingsModel } = await import(
      "@/models/SiteSettings"
    );
    const doc = await SiteSettingsModel.findOne().lean<SiteSettingsData>();
    return mapSettings(doc);
  } catch {
    return DEFAULT_SETTINGS;
  }
});
