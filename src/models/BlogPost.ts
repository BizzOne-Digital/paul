import { Schema, models, model } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    contentSections: { type: [Schema.Types.Mixed], default: [] },
    coverImage: { type: String, default: "" },
    coverImageAlt: { type: String, default: "" },
    author: { type: String, default: "BC Winery Buyer Advisory" },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    seo: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
export { BlogPost };
export default BlogPost;
