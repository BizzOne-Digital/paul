import {
  handleUploadDelete,
  handleUploadPost,
} from "@/lib/upload-handlers";

export const runtime = "nodejs";

export const POST = handleUploadPost;
export const DELETE = handleUploadDelete;
