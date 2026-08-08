import { Schema, models, model } from "mongoose";

const PageSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    hero: { type: Schema.Types.Mixed, default: {} },
    sections: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

const Page = models.Page || model("Page", PageSchema);
export { Page };
export default Page;
