import { Schema, models, model } from "mongoose";

const LeadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    reason: { type: String, required: true },
    timeframe: { type: String, required: true },
    preferredRegion: { type: String, default: "" },
    acquisitionType: { type: String, default: "" },
    budgetRange: { type: String, default: "" },
    currentStage: { type: String, default: "" },
    preferredContactMethod: { type: String, default: "" },
    details: { type: String, default: "" },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Consultation Scheduled",
        "Qualified",
        "Follow-Up",
        "Closed",
        "Not a Fit",
      ],
      default: "New",
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Lead = models.Lead || model("Lead", LeadSchema);
export { Lead };
export default Lead;
