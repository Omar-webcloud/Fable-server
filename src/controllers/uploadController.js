import { uploadToImgBB } from "../utils/imgbb.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const result = await uploadToImgBB(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
