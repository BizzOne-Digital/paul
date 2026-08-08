import { Schema, models, model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "Getting Started" },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

const FAQ = models.FAQ || model("FAQ", FAQSchema);
export { FAQ };
export default FAQ;
