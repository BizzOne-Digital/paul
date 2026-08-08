import { NextResponse } from "next/server";
import { requireAdmin, unauthorizedJson } from "@/lib/auth";
import {
  checkImageReferences,
  deleteUpload,
  isUploadCategory,
  saveUpload,
} from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorizedJson();

  try {
    const form = await request.formData();
    const file = form.get("file");
    const category = String(form.get("category") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!isUploadCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const result = await saveUpload(file, category);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorizedJson();

  try {
    const body = await request.json();
    const url = String(body.url || "");
    const force = Boolean(body.force);

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const references = await checkImageReferences(url);
    if (references.length > 0 && !force) {
      return NextResponse.json(
        {
          error: "Image is still referenced",
          references,
        },
        { status: 409 },
      );
    }

    await deleteUpload(url);
    return NextResponse.json({ ok: true, references });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
