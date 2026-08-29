import {
  handleUploadDelete,
  handleUploadPost,
} from "@/lib/upload-handlers";

export const runtime = "nodejs";
export const maxDuration = 60;

export const POST = handleUploadPost;
export const DELETE = handleUploadDelete;
