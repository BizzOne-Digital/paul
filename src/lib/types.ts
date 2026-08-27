export type ContentStatus = "draft" | "published";
export type PublishStatus = ContentStatus;

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Consultation Scheduled"
  | "Qualified"
  | "Follow-Up"
  | "Closed"
  | "Not a Fit";

export type ImageRef = {
  url: string;
  alt?: string;
};

export type SEOFields = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath?: string;
};

export type SEO = SEOFields;

export type CTAFields = {
  label?: string;
  href?: string;
  heading?: string;
  body?: string;
};

export type CTA = CTAFields;

export type HeroContent = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  backgroundImage?: string | ImageRef;
  backgroundImageAlt?: string;
  floatingLabel?: string;
  image?: ImageRef;
};

export type ContentCard = {
  key?: string;
  title?: string;
  description?: string;
  body?: string;
  value?: string;
  image?: string | ImageRef;
  imageAlt?: string;
  href?: string;
  eyebrow?: string;
  meta?: string;
};

export type ImageItem = {
  src: string;
  alt: string;
};

export type PageSection = {
  key: string;
  order?: number;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  items?: string[];
  lists?: string[][];
  cards?: ContentCard[];
  images?: ImageItem[];
  primaryImage?: string | ImageRef;
  primaryImageAlt?: string;
  secondaryImage?: string | ImageRef;
  secondaryImageAlt?: string;
  backgroundImage?: string | ImageRef;
  backgroundImageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  [key: string]: unknown;
};

export type ProcessStep = {
  title?: string;
  description?: string;
  body?: string;
};

export type ServiceDetailPage = {
  hero?: HeroContent;
  overview?: string;
  audience?: string | string[];
  keyQuestions?: string[];
  includedItems?: string[];
  processSteps?: ProcessStep[];
  professionalDisclaimer?: string;
  sectionImages?: ImageItem[] | ImageRef[];
  galleryImages?: ImageItem[] | ImageRef[];
  relatedServiceIds?: string[];
  relatedServiceSlugs?: string[];
  cta?: CTAFields;
};

export type BlogContentSection = {
  key: string;
  heading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
};

export type ContentBlock = {
  key: string;
  type: "paragraph" | "heading" | "list" | "quote" | "image" | "callout";
  heading?: string;
  body?: string;
  items?: string[];
  image?: ImageRef | string | null;
  imageAlt?: string;
  order?: number;
};

export type SiteSettingsData = {
  _id?: string;
  websiteName: string;
  legalBusinessName?: string;
  logo?: string;
  logoLight?: string;
  favicon?: string;
  logoUrl?: string;
  logoLightUrl?: string;
  faviconUrl?: string;
  companyDescription?: string;
  email: string;
  phone: string;
  phoneTel?: string;
  phoneHref?: string;
  socialHandle?: string;
  socialPlatform?: string;
  socialUrl?: string;
  serviceArea?: string;
  businessHours?: string;
  headerCtaLabel?: string;
  headerCtaHref?: string;
  footerCtaLabel?: string;
  footerCtaHref?: string;
  complimentaryConsultationText?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoKeywords?: string;
  legalDisclaimer?: string;
  copyright?: string;
  copyrightText?: string;
  googleMapsUrl?: string;
  tagline?: string;
};

export type SiteSettingsFields = SiteSettingsData;

export type NavServiceLink = {
  name: string;
  slug: string;
};

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

/** @deprecated Use UploadFolder */
export type UploadCategory = UploadFolder;

export type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  name?: string;
};
