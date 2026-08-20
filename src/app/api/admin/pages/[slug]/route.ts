import { withAdmin } from "@/lib/admin-api";
import Page from "@/models/Page";
import { pageUpdateSchema } from "@/lib/validations";
import { revalidatePages } from "@/lib/revalidate";
import { toPlain } from "@/lib/utils";
import type { PageSection } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  return withAdmin(async () => {
    const page = await Page.findOne({ slug }).lean();
    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }
    return { page: toPlain(page) };
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { slug } = await params;
  return withAdmin(async () => {
    const body = pageUpdateSchema.parse(await request.json());
    const page = await Page.findOne({ slug });
    if (!page) {
      return Response.json({ error: "Page not found" }, { status: 404 });
    }

    if (body.name !== undefined) page.name = body.name;
    if (body.hero !== undefined) {
      page.hero = body.hero as typeof page.hero;
      page.markModified("hero");
    }
    if (body.seo !== undefined) {
      page.seo = body.seo as typeof page.seo;
      page.markModified("seo");
    }
    if (body.status !== undefined) page.status = body.status;

    if (body.section) {
      const sections = (page.sections || []) as PageSection[];
      const idx = sections.findIndex((s) => s.key === body.section!.key);
      if (idx === -1) {
        sections.push(body.section as PageSection);
      } else {
        sections[idx] = {
          ...sections[idx],
          ...(body.section as PageSection),
          key: body.section.key,
        } as PageSection;
      }
      page.sections = sections.sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      ) as typeof page.sections;
      page.markModified("sections");
    }

    if (body.sections) {
      page.sections = [...body.sections].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      ) as typeof page.sections;
      page.markModified("sections");
    }

    await page.save();
    revalidatePages(slug);
    return { page: toPlain(page.toObject()) };
  });
}
