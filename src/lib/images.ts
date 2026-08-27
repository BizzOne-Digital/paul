/** Curated Unsplash URLs used as replaceable stock placeholders (BC wine-country aesthetic). */
export const STOCK = {
  /** Cinematic hero — remote URL (local /images copy optional for self-hosting) */
  heroVineyard:
    "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&w=2000&q=80",
  aerialVineyard:
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2000&q=80",
  vineyardRows:
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=80",
  estateWinery:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80",
  barrelCellar:
    "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1600&q=80",
  tastingRoom:
    "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80",
  production:
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1600&q=80",
  lakeMountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  grapesSubtle:
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1400&q=80",
  documents:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
  meeting:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  duskVineyard:
    "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&w=2000&q=80",
  architecture:
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1600&q=80",
  hillside:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  goldenHour:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
  hospitality:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
} as const;

/** Accepts CMS ImageRef objects, seed string URLs, or { src, alt } gallery shapes. */
export type ImageLike =
  | string
  | { url?: string; src?: string; alt?: string }
  | null
  | undefined
  // Allow loosely typed Mongo lean docs without forcing casts at every call site
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any;

export function imageSrc(image: ImageLike, fallback = ""): string {
  if (!image) return fallback;
  if (typeof image === "string") return image || fallback;
  return image.url || image.src || fallback;
}

export function imageAlt(image: ImageLike, fallback = ""): string {
  if (!image || typeof image === "string") return fallback;
  return image.alt || fallback;
}
