import { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "default", unique: true },
    websiteName: {
      type: String,
      required: true,
      default: "BC Winery Buyer Advisory",
    },
    legalBusinessName: { type: String, default: "" },
    logo: { type: String, default: "/brand/logo-symbol.svg" },
    logoLight: { type: String, default: "/brand/logo-symbol-light.svg" },
    favicon: { type: String, default: "/brand/favicon.svg" },
    logoUrl: { type: String, default: "/brand/logo-symbol.svg" },
    logoLightUrl: { type: String, default: "/brand/logo-symbol-light.svg" },
    faviconUrl: { type: String, default: "/brand/favicon.svg" },
    companyDescription: { type: String, default: "" },
    email: { type: String, default: "paulmgraydon@gmail.com" },
    phone: { type: String, default: "+1 (250) 809-2342" },
    phoneTel: { type: String, default: "+12508092342" },
    phoneHref: { type: String, default: "tel:+12508092342" },
    socialHandle: { type: String, default: "faithwilson" },
    socialPlatform: { type: String, default: "" },
    socialUrl: { type: String, default: "" },
    serviceArea: { type: String, default: "British Columbia, Canada" },
    businessHours: { type: String, default: "By appointment" },
    headerCtaLabel: { type: String, default: "Book a Complimentary Call" },
    headerCtaHref: { type: String, default: "/contact" },
    footerCtaLabel: { type: String, default: "Schedule Your Initial Call" },
    footerCtaHref: { type: String, default: "/contact" },
    complimentaryConsultationText: { type: String, default: "" },
    defaultSeoTitle: { type: String, default: "" },
    defaultSeoDescription: { type: String, default: "" },
    defaultSeoKeywords: { type: String, default: "" },
    legalDisclaimer: { type: String, default: "" },
    copyright: { type: String, default: "" },
    copyrightText: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" },
    tagline: { type: String, default: "Guidance for BC Winery Buyers" },
  },
  { timestamps: true }
);

const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export { SiteSettings };
export default SiteSettings;
