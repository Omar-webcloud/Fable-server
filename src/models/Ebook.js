import mongoose from "mongoose";
import { EBOOK_STATUS } from "../constants/index.js";

const ebookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullContent: { type: String, default: "" },
    genre: { type: String, required: true },
    coverImage: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    writerName: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(EBOOK_STATUS),
      default: EBOOK_STATUS.UNPUBLISHED,
    },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ebookSchema.index({ title: "text" });
ebookSchema.index({ genre: 1 });
ebookSchema.index({ writerId: 1 });

export default mongoose.model("Ebook", ebookSchema);
