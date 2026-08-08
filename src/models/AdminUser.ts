import { Schema, models, model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
export { AdminUser };
export default AdminUser;
