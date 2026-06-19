import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    ebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ebook",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

purchaseSchema.index({ buyerId: 1 });
purchaseSchema.index({ ebookId: 1 });

export default mongoose.model("Purchase", purchaseSchema);
