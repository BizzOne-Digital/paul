import type { ImageRef } from "@/lib/types";

export type MediaLike =
  | string
  | ImageRef
  | { src?: string; url?: string; alt?: string }
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any;

/** Resolve a URL from string or ImageRef-shaped values (seed + CMS). */
export function mediaUrl(input?: MediaLike, fallback = ""): string {
  if (!input) return fallback;
  if (typeof input === "string") return input || fallback;
  return input.url || input.src || fallback;
}

export function mediaAlt(input?: MediaLike, fallback = ""): string {
  if (!input) return fallback;
  if (typeof input === "string") return fallback;
  return input.alt || fallback;
}

export function toImageRef(
  value?: MediaLike,
  alt = "",
): ImageRef | undefined {
  const url = mediaUrl(value);
  if (!url) return undefined;
  return { url, alt: mediaAlt(value, alt) };
}

export function toStoredImageUrl(value?: MediaLike): string {
  return mediaUrl(value) || "";
}

export function asTextList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return value as string[];
    if (value.every((v) => Array.isArray(v))) {
      return (value as string[][]).flat().filter(Boolean);
    }
  }
  if (typeof value === "string") return [value];
  return [];
}

export function asParagraph(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.filter((v) => typeof v === "string").join(" ");
  }
  return "";
}
