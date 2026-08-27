import type { UploadFolder } from "@/lib/types";

export const UPLOAD_FOLDERS = [
  "products",
  "gallery",
  "pages",
  "misc",
] as const satisfies readonly UploadFolder[];

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isStoredUploadUrl(url: string): boolean {
  return /^\/api\/uploads\/[^/]+\/[^/]+$/.test(url);
}

export function isLegacyDiskUploadUrl(url: string): boolean {
  return url.startsWith("/uploads/");
}

export function parseStoredUploadUrl(
  url: string,
): { folder: UploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const folder = match[1];
  const filename = match[2];

  if (!folder || !filename) return null;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  if (!isUploadFolder(folder)) return null;

  return { folder, filename };
}

export function sanitizeFilename(filename: string): string | null {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) return null;
  return filename;
}
