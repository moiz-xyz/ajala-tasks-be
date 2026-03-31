import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    requiredRole: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
    // Reference to the User who created it
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
