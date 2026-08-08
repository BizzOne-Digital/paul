import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import connectMongo from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import Page from "@/models/Page";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";
import type { UploadCategory } from "@/lib/types";

/** Local filesystem uploads require the Node.js runtime (not Edge). */
const MAX_BYTES = 8 * 1024 * 1024;
export const UPLOAD_CATEGORIES = [
  "pages",
  "services",
  "blog",
  "settings",
] as const satisfies readonly UploadCategory[];

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_BY_EXT: Record<string, string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".avif": ["image/avif"],
  ".svg": ["image/svg+xml"],
};

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 80);
}

export function isUploadCategory(value: string): value is UploadCategory {
  return (UPLOAD_CATEGORIES as readonly string[]).includes(value);
}

export async function saveUpload(file: File, category: UploadCategory) {
  if (!isUploadCategory(category)) {
    throw new Error("Invalid upload category");
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    throw new Error("Image must be between 1 byte and 8MB");
  }

  const original = sanitizeBaseName(file.name || "upload");
  const ext = path.extname(original).toLowerCase() || guessExt(file.type);
  const allowed = MIME_BY_EXT[ext];
  if (!allowed) {
    throw new Error("Unsupported file type");
  }
  if (ext === ".svg" && category !== "settings") {
    throw new Error("SVG uploads are only allowed for settings/brand assets");
  }
  if (!allowed.includes(file.type)) {
    throw new Error("MIME type does not match file extension");
  }

  const unique = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(UPLOAD_ROOT, category);
  await fs.mkdir(dir, { recursive: true });

  const absolute = path.join(dir, unique);
  const relative = `/uploads/${category}/${unique}`;

  // Prevent path traversal
  const resolved = path.resolve(absolute);
  if (!resolved.startsWith(path.resolve(dir))) {
    throw new Error("Invalid upload path");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(resolved, buffer);

  return { url: relative, filename: unique, category };
}

function guessExt(mime: string) {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/avif") return ".avif";
  if (mime === "image/svg+xml") return ".svg";
  return "";
}

export async function deleteUpload(url: string) {
  if (!url || !url.startsWith("/uploads/")) {
    throw new Error("Only local upload URLs can be deleted");
  }
  const relative = url.replace(/^\/uploads\//, "");
  const absolute = path.resolve(UPLOAD_ROOT, relative);
  if (!absolute.startsWith(path.resolve(UPLOAD_ROOT))) {
    throw new Error("Invalid upload path");
  }
  try {
    await fs.unlink(absolute);
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return false;
    throw error;
  }
}

export async function checkImageReferences(url: string) {
  await connectMongo();
  const refs: string[] = [];

  const pages = await Page.find({
    $or: [
      { "hero.image.url": url },
      { "hero.image": url },
      { "hero.backgroundImage.url": url },
      { "hero.backgroundImage": url },
      { "sections.primaryImage.url": url },
      { "sections.primaryImage": url },
      { "sections.secondaryImage.url": url },
      { "sections.secondaryImage": url },
      { "sections.backgroundImage.url": url },
      { "sections.backgroundImage": url },
      { "sections.cards.image.url": url },
      { "sections.cards.image": url },
      { "seo.ogImage": url },
    ],
  })
    .select("name slug")
    .lean();
  pages.forEach((p) => refs.push(`Page:${p.slug}`));

  const services = await Service.find({
    $or: [
      { listingImage: url },
      { "listingImage.url": url },
      { "detailPage.hero.image.url": url },
      { "detailPage.hero.image": url },
      { "detailPage.hero.backgroundImage.url": url },
      { "detailPage.hero.backgroundImage": url },
      { "detailPage.sectionImages.url": url },
      { "detailPage.sectionImages.src": url },
      { "detailPage.galleryImages.url": url },
      { "detailPage.galleryImages.src": url },
      { "seo.ogImage": url },
    ],
  })
    .select("name slug")
    .lean();
  services.forEach((s) => refs.push(`Service:${s.slug}`));

  const posts = await BlogPost.find({
    $or: [
      { coverImage: url },
      { "coverImage.url": url },
      { "contentSections.image": url },
      { "contentSections.image.url": url },
      { "seo.ogImage": url },
    ],
  })
    .select("title slug")
    .lean();
  posts.forEach((p) => refs.push(`Blog:${p.slug}`));

  const settings = await SiteSettings.findOne({
    $or: [
      { logoUrl: url },
      { logoLightUrl: url },
      { faviconUrl: url },
      { logo: url },
      { logoLight: url },
      { favicon: url },
    ],
  })
    .select("websiteName")
    .lean();
  if (settings) refs.push("SiteSettings");

  return refs;
}
