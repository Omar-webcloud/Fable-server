import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/uploadController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", verifyJWT, upload.single("image"), uploadController.uploadImage);

export default router;
