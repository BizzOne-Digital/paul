import { NextResponse } from "next/server";
import { requireAdmin, unauthorizedJson } from "@/lib/auth";
import { checkImageReferences } from "@/lib/uploads";
import {
  deleteStoredUpload,
  isUploadFolder,
  saveStoredUpload,
} from "@/lib/stored-uploads";

export async function handleUploadPost(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorizedJson();

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || form.get("category") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!isUploadFolder(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const result = await saveStoredUpload(file, folder);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function handleUploadDelete(request: Request) {
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

    await deleteStoredUpload(url);
    return NextResponse.json({ ok: true, references });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
