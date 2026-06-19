import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/profile", verifyJWT, userController.getProfile);
router.patch("/profile", verifyJWT, userController.updateProfile);
router.get("/", verifyJWT, verifyAdmin, userController.getAllUsers);
router.get("/:id", verifyJWT, userController.getProfile);
router.put("/:id", verifyJWT, userController.updateProfile);
router.patch("/:id", verifyJWT, userController.updateProfile);
router.patch("/:id/role", verifyJWT, verifyAdmin, userController.changeRole);
router.delete("/:id", verifyJWT, verifyAdmin, userController.deleteUser);

export default router;
