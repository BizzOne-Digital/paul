import { revalidatePath } from "next/cache";

export function revalidatePublicShell() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/faq");
  revalidatePath("/blog");
  revalidatePath("/contact");
}

export function revalidateServices(slug?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
  revalidatePath("/", "layout");
}

export function revalidateBlog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export function revalidateFaqs() {
  revalidatePath("/");
  revalidatePath("/faq");
}

/** Alias used by FAQ admin APIs. */
export const revalidateFaq = revalidateFaqs;

export function revalidatePage(slug: string) {
  const map: Record<string, string> = {
    home: "/",
    services: "/services",
    contact: "/contact",
    faq: "/faq",
    blog: "/blog",
  };
  revalidatePath(map[slug] || `/${slug}`);
  if (slug === "home") revalidatePath("/");
}

/** Alias used by page admin APIs. */
export const revalidatePages = revalidatePage;

export function revalidateSettings() {
  revalidatePublicShell();
}

export function revalidateDashboard() {
  revalidatePath("/admin");
}

export function revalidateLeads() {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}
