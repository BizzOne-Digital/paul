import type { LeadStatus } from "@/lib/types";

export const ACQUISITION_TYPES = [
  { label: "Operating Winery", value: "operating-winery" },
  { label: "Vineyard", value: "vineyard" },
  { label: "Winery and Vineyard Estate", value: "winery-vineyard-estate" },
  {
    label: "Tasting Room or Hospitality Property",
    value: "tasting-hospitality",
  },
  { label: "Development Opportunity", value: "development" },
  { label: "Lifestyle Wine-Country Property", value: "lifestyle" },
  { label: "Related wine-industry opportunity", value: "related" },
  { label: "Undecided / exploring", value: "undecided" },
] as const;

export const BUDGET_RANGES = [
  "Prefer not to say",
  "Under $1M",
  "$1M–$3M",
  "$3M–$5M",
  "$5M–$10M",
  "$10M+",
  "Flexible / exploratory",
] as const;

export const CURRENT_STAGES = [
  "Early research",
  "Actively searching",
  "Reviewing an opportunity",
  "In due diligence",
  "Preparing to transact",
  "Other",
] as const;

export const CONTACT_METHODS = ["Email", "Phone", "Either"] as const;

export const BC_REGIONS = [
  "Okanagan Valley",
  "Similkameen Valley",
  "Fraser Valley",
  "Vancouver Island",
  "Gulf Islands",
  "Other / emerging BC region",
  "Open to multiple regions",
] as const;

export const REASON_OPTIONS = [
  "Exploring winery ownership",
  "Looking for a winery",
  "Looking for a vineyard",
  "Reviewing a specific opportunity",
  "Due-diligence coordination",
  "Acquisition planning",
  "Professional-services inquiry",
  "Other",
] as const;

export const TIMEFRAME_OPTIONS = [
  "Immediately",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
  "Early research stage",
] as const;

export const BLOG_CATEGORIES = [
  "Buying a BC Winery",
  "Vineyard Due Diligence",
  "Winery Operations",
  "Financing and Planning",
  "BC Wine Regions",
  "Transaction Preparation",
  "Ownership and Transition",
] as const;

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Consultation Scheduled",
  "Qualified",
  "Follow-Up",
  "Closed",
  "Not a Fit",
];

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Buyer Insights", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const PAGE_SLUGS = [
  { name: "Home", slug: "home", path: "/" },
  { name: "Services", slug: "services", path: "/services" },
  { name: "Contact", slug: "contact", path: "/contact" },
  { name: "FAQ", slug: "faq", path: "/faq" },
  { name: "Blog", slug: "blog", path: "/blog" },
] as const;

export const PUBLISH_STATUSES = ["draft", "published"] as const;

export const FAQ_CATEGORIES = [
  "General",
  "Consultation",
  "Services",
  "Process",
  "Ownership",
] as const;

export const SESSION_COOKIE = "bcwba_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** BC real estate regulatory footer — required on all public pages. */
export const BROKERAGE_COMPLIANCE = {
  logoSrc: "/brand/faith-wilson-christies-logo.png",
  logoAlt: "Faith Wilson Christie's International Real Estate",
  licenseeLine:
    "Paul Graydon - 1156A Ellis Street, Kelowna, BC, V1Y 0J5",
} as const;
