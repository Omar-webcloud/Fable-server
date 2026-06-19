import mongoose from "mongoose";
import { ROLES } from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    verifiedWriter: { type: Boolean, default: false },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ebook" }],
    purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ebook" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
