import { randomBytes } from "node:crypto";
import connectMongo from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import type { UploadFolder } from "@/lib/types";
import {
  isUploadFolder,
  parseStoredUploadUrl,
  sanitizeFilename,
  UPLOAD_FOLDERS,
  isLegacyDiskUploadUrl,
  isStoredUploadUrl,
} from "@/lib/upload-url";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export {
  UPLOAD_FOLDERS,
  isLegacyDiskUploadUrl,
  isStoredUploadUrl,
  isUploadFolder,
  parseStoredUploadUrl,
  sanitizeFilename,
};

/** @deprecated Use isUploadFolder */
export const isUploadCategory = isUploadFolder;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function saveStoredUpload(file: File, folder: UploadFolder) {
  if (!isUploadFolder(folder)) {
    throw new Error("Invalid upload folder");
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be between 1 byte and 8MB");
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, or GIF.");
  }

  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    throw new Error("Unsupported file type");
  }

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await connectMongo();
  await StoredUpload.create({
    folder,
    filename,
    mimeType: file.type,
    size: buffer.byteLength,
    data: buffer,
  });

  return {
    success: true as const,
    url: `/api/uploads/${folder}/${filename}`,
    filename,
    size: buffer.byteLength,
    folder,
  };
}

export type StoredUploadDoc = {
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
};

export async function getStoredUpload(
  folder: string,
  filename: string,
): Promise<StoredUploadDoc | null> {
  const safeFolder = isUploadFolder(folder) ? folder : null;
  const safeFilename = sanitizeFilename(filename);
  if (!safeFolder || !safeFilename) return null;

  await connectMongo();
  const doc = await StoredUpload.findOne({
    folder: safeFolder,
    filename: safeFilename,
  }).lean<StoredUploadDoc>();
  return doc ?? null;
}

export async function deleteStoredUpload(url: string) {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) {
    if (isLegacyDiskUploadUrl(url)) {
      return false;
    }
    throw new Error("Only stored upload URLs can be deleted");
  }

  await connectMongo();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}
