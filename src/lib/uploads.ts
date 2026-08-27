import connectMongo from "@/lib/mongodb";
import {
  deleteStoredUpload,
  isLegacyDiskUploadUrl,
  isStoredUploadUrl,
  saveStoredUpload,
} from "@/lib/stored-uploads";
import BlogPost from "@/models/BlogPost";
import Page from "@/models/Page";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";
import type { UploadFolder } from "@/lib/types";

export {
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDERS,
  UPLOAD_FOLDERS as UPLOAD_CATEGORIES,
  deleteStoredUpload,
  getStoredUpload,
  isLegacyDiskUploadUrl,
  isStoredUploadUrl,
  isUploadCategory,
  isUploadFolder,
  parseStoredUploadUrl,
  saveStoredUpload,
} from "@/lib/stored-uploads";

/** @deprecated Use saveStoredUpload */
export async function saveUpload(file: File, folder: UploadFolder) {
  const result = await saveStoredUpload(file, folder);
  return {
    url: result.url,
    filename: result.filename,
    category: result.folder,
    folder: result.folder,
    size: result.size,
    success: result.success,
  };
}

export async function deleteUpload(url: string) {
  if (!url || (!isStoredUploadUrl(url) && !isLegacyDiskUploadUrl(url))) {
    throw new Error("Only stored upload URLs can be deleted");
  }
  return deleteStoredUpload(url);
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
