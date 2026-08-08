export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function readingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatPhoneDisplay(phone: string) {
  return phone.trim();
}

export function isValidHttpUrl(value?: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}

export function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export function resolveImageSrc(
  value?: string | { url?: string; src?: string } | null,
  fallback = ""
) {
  if (!value) return fallback;
  if (typeof value === "string") return value || fallback;
  return value.url || value.src || fallback;
}

export function resolveImageAlt(
  value?: string | { alt?: string } | null,
  fallback = ""
) {
  if (!value) return fallback;
  if (typeof value === "string") return fallback;
  return value.alt || fallback;
}
