const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    // --- New Fields ---
    isPrivate: { type: Boolean, default: false },
    accessCode: { type: String, default: null }, // The "password" for the doc
    // ------------------
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
