import { z } from "zod";
import {
  BLOG_CATEGORIES,
  LEAD_STATUSES,
  PUBLISH_STATUSES,
  REASON_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/lib/constants";

const imageRefSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
});

/** CMS stores images as upload paths (string) or { url, alt } objects. */
const imageFieldSchema = z
  .union([z.string(), imageRefSchema])
  .optional()
  .nullable();

const ctaSchema = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
});

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalPath: z.string().optional(),
  })
  .passthrough();

const heroSchema = z
  .object({
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    body: z.string().optional(),
    primaryCta: ctaSchema.optional(),
    secondaryCta: ctaSchema.optional(),
    primaryCtaLabel: z.string().optional(),
    primaryCtaHref: z.string().optional(),
    secondaryCtaLabel: z.string().optional(),
    secondaryCtaHref: z.string().optional(),
    image: imageFieldSchema,
    backgroundImage: imageFieldSchema,
    backgroundImageAlt: z.string().optional(),
    floatingLabel: z.string().optional(),
  })
  .passthrough();

const cardSchema = z
  .object({
    key: z.string().optional(),
    title: z.string().optional(),
    body: z.string().optional(),
    description: z.string().optional(),
    value: z.string().optional(),
    eyebrow: z.string().optional(),
    image: imageFieldSchema,
    imageAlt: z.string().optional(),
    href: z.string().optional(),
    meta: z.string().optional(),
  })
  .passthrough();

export const pageSectionSchema = z
  .object({
    key: z.string().min(1),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    body: z.string().optional(),
    items: z.array(z.string()).optional(),
    lists: z.array(z.array(z.string())).optional(),
    images: z
      .array(
        z.union([
          z.string(),
          z.object({
            src: z.string().optional(),
            url: z.string().optional(),
            alt: z.string().optional(),
          }),
        ]),
      )
      .optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
    primaryCtaLabel: z.string().optional(),
    primaryCtaHref: z.string().optional(),
    secondaryCtaLabel: z.string().optional(),
    secondaryCtaHref: z.string().optional(),
    primaryImage: imageFieldSchema,
    primaryImageAlt: z.string().optional(),
    secondaryImage: imageFieldSchema,
    secondaryImageAlt: z.string().optional(),
    backgroundImage: imageFieldSchema,
    backgroundImageAlt: z.string().optional(),
    cards: z.array(cardSchema).optional(),
    visible: z.boolean().optional(),
    order: z.number().optional(),
  })
  .passthrough();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(40),
  email: z.string().trim().email("Please enter a valid email"),
  reason: z.enum(REASON_OPTIONS),
  timeframe: z.enum(TIMEFRAME_OPTIONS),
  preferredRegion: z.string().max(120).optional().or(z.literal("")),
  acquisitionType: z.string().max(120).optional().or(z.literal("")),
  budgetRange: z.string().max(120).optional().or(z.literal("")),
  currentStage: z.string().max(120).optional().or(z.literal("")),
  preferredContactMethod: z.string().max(80).optional().or(z.literal("")),
  details: z.string().max(5000).optional().or(z.literal("")),
  consent: z.literal(true, {
    error: "Consent is required to submit this inquiry",
  }),
  /** Honeypot — must remain empty */
  website: z.string().max(0).optional().or(z.literal("")),
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export const contactSchema = contactFormSchema;

export const pageUpdateSchema = z.object({
  name: z.string().optional(),
  hero: heroSchema.optional(),
  sections: z.array(pageSectionSchema).optional(),
  section: pageSectionSchema.optional(),
  seo: seoSchema.optional(),
  status: z.enum(PUBLISH_STATUSES).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().min(1),
  listingImage: z.union([z.string(), imageRefSchema]).optional().nullable(),
  listingImageAlt: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(PUBLISH_STATUSES).optional(),
  detailPage: z
    .object({
      hero: z
        .object({
          eyebrow: z.string().optional(),
          heading: z.string().optional(),
          subheading: z.string().optional(),
          body: z.string().optional(),
          primaryCta: ctaSchema.optional(),
          secondaryCta: ctaSchema.optional(),
          image: imageRefSchema.optional().nullable(),
          backgroundImage: imageRefSchema.optional().nullable(),
        })
        .optional(),
      overview: z.string().optional(),
      audience: z.array(z.string()).optional(),
      keyQuestions: z.array(z.string()).optional(),
      includedItems: z.array(z.string()).optional(),
      processSteps: z
        .array(z.object({ title: z.string().optional(), body: z.string().optional() }))
        .optional(),
      professionalDisclaimer: z.string().optional(),
      sectionImages: z.array(imageRefSchema).optional(),
      galleryImages: z.array(imageRefSchema).optional(),
      relatedServiceSlugs: z.array(z.string()).optional(),
      cta: ctaSchema.optional(),
    })
    .optional(),
  seo: seoSchema.optional(),
});

export const contentBlockSchema = z.object({
  key: z.string().min(1),
  type: z.enum(["paragraph", "heading", "list", "quote", "image", "callout"]),
  heading: z.string().optional(),
  body: z.string().optional(),
  items: z.array(z.string()).optional(),
  image: imageRefSchema.optional().nullable(),
  order: z.number().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(1),
  contentSections: z
    .array(
      z.object({
        key: z.string().min(1),
        type: z
          .enum(["paragraph", "heading", "list", "quote", "image", "callout"])
          .optional(),
        heading: z.string().optional(),
        body: z.string().optional(),
        items: z.array(z.string()).optional(),
        image: z.union([z.string(), imageRefSchema]).optional().nullable(),
        imageAlt: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .optional(),
  coverImage: z.union([z.string(), imageRefSchema]).optional().nullable(),
  coverImageAlt: z.string().optional(),
  author: z.string().optional(),
  category: z.enum(BLOG_CATEGORIES).or(z.string()),
  tags: z.array(z.string()).optional(),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .or(z.string().optional().nullable()),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(PUBLISH_STATUSES).optional(),
  seo: seoSchema.optional(),
});

export const faqSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  category: z.string().min(1),
  order: z.number().optional(),
  status: z.enum(PUBLISH_STATUSES).optional(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  internalNotes: z.string().max(10000).optional(),
});

/** Alias expected by admin lead forms/APIs. */
export const leadStatusSchema = leadUpdateSchema;

const SETTINGS_STRING_FIELDS = [
  "legalBusinessName",
  "logo",
  "logoLight",
  "favicon",
  "logoUrl",
  "logoLightUrl",
  "faviconUrl",
  "companyDescription",
  "phoneTel",
  "phoneHref",
  "socialHandle",
  "socialPlatform",
  "socialUrl",
  "serviceArea",
  "businessHours",
  "headerCtaLabel",
  "headerCtaHref",
  "footerCtaLabel",
  "footerCtaHref",
  "complimentaryConsultationText",
  "defaultSeoTitle",
  "defaultSeoDescription",
  "defaultSeoKeywords",
  "legalDisclaimer",
  "copyright",
  "copyrightText",
  "googleMapsUrl",
  "tagline",
] as const;

function normalizeSettingsBody(input: unknown) {
  if (!input || typeof input !== "object") return input;
  const raw = { ...(input as Record<string, unknown>) };
  for (const key of SETTINGS_STRING_FIELDS) {
    if (raw[key] === null || raw[key] === undefined) {
      raw[key] = "";
    }
  }
  if (raw.websiteName === null || raw.websiteName === undefined) {
    raw.websiteName = "";
  }
  if (raw.email === null || raw.email === undefined) {
    raw.email = "";
  }
  if (raw.phone === null || raw.phone === undefined) {
    raw.phone = "";
  }
  return raw;
}

const settingsObjectSchema = z.object({
  websiteName: z.string().trim().min(2).max(120),
  legalBusinessName: z.string().max(160),
  logo: z.string(),
  logoLight: z.string(),
  favicon: z.string(),
  logoUrl: z.string(),
  logoLightUrl: z.string(),
  faviconUrl: z.string(),
  companyDescription: z.string().max(2000),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  phoneTel: z.string(),
  phoneHref: z.string(),
  socialHandle: z.string(),
  socialPlatform: z.string(),
  socialUrl: z.string(),
  serviceArea: z.string(),
  businessHours: z.string(),
  headerCtaLabel: z.string(),
  headerCtaHref: z.string(),
  footerCtaLabel: z.string(),
  footerCtaHref: z.string(),
  complimentaryConsultationText: z.string(),
  defaultSeoTitle: z.string(),
  defaultSeoDescription: z.string(),
  defaultSeoKeywords: z.string(),
  legalDisclaimer: z.string(),
  copyright: z.string(),
  copyrightText: z.string(),
  googleMapsUrl: z.string(),
  tagline: z.string(),
});

export const settingsSchema = z.preprocess(
  normalizeSettingsBody,
  settingsObjectSchema,
);
