import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../constants/index.js";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    referenceId: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ email: 1 });

export default mongoose.model("Transaction", transactionSchema);
