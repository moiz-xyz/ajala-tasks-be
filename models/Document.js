import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    shareId: { type: String, default: () => uuidv4() },
    requiredRole: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
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
