import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    publicSlug: { type: String, required: true, unique: true, index: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("User", userSchema);
