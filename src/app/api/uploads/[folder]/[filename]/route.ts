import { getStoredUpload, isUploadFolder, sanitizeFilename } from "@/lib/stored-uploads";

export const runtime = "nodejs";

type Params = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { folder, filename } = await params;

  if (!isUploadFolder(folder) || !sanitizeFilename(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const doc = await getStoredUpload(folder, filename);
  if (!doc?.data) {
    return new Response("Not found", { status: 404 });
  }

  const body = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data);

  return new Response(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.size ?? body.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
