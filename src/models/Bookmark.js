import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ebook",
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, ebookId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
