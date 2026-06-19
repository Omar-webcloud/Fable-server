import { Router } from "express";
import * as ebookController from "../controllers/ebookController.js";
import {
  verifyJWT,
  verifyWriter,
  optionalJWT,
} from "../middlewares/auth.js";

const router = Router();

router.get("/", optionalJWT, ebookController.getAll);
router.get("/featured", ebookController.getFeatured);
router.get("/:id", optionalJWT, ebookController.getById);
router.post("/", verifyJWT, verifyWriter, ebookController.create);
router.put("/:id", verifyJWT, verifyWriter, ebookController.update);
router.patch("/:id", verifyJWT, verifyWriter, ebookController.update);
router.delete("/:id", verifyJWT, verifyWriter, ebookController.remove);
router.patch("/:id/publish", verifyJWT, verifyWriter, ebookController.publish);
router.patch(
  "/:id/unpublish",
  verifyJWT,
  verifyWriter,
  ebookController.unpublish
);

export default router;
