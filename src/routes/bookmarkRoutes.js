import { Router } from "express";
import * as bookmarkController from "../controllers/bookmarkController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT);

router.get("/", bookmarkController.getAll);
router.post("/", bookmarkController.add);
router.post("/:ebookId", bookmarkController.add);
router.delete("/:ebookId", bookmarkController.remove);

export default router;
