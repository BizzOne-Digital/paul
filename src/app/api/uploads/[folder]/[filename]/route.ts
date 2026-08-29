import { bufferFromStoredData } from "@/lib/upload-buffer";
import {
  getStoredUpload,
  isUploadFolder,
  sanitizeFilename,
} from "@/lib/stored-uploads";

export const runtime = "nodejs";

type Params = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { folder, filename } = await params;

    if (!isUploadFolder(folder) || !sanitizeFilename(filename)) {
      return new Response("Not found", { status: 404 });
    }

    const doc = await getStoredUpload(folder, filename);
    const body = bufferFromStoredData(doc?.data);
    if (!doc || !body?.length) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Length": String(doc.size ?? body.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
