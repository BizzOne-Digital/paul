import { Schema, models, model } from "mongoose";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

const StoredUpload =
  models.StoredUpload || model("StoredUpload", StoredUploadSchema);

export { StoredUpload };
export default StoredUpload;
