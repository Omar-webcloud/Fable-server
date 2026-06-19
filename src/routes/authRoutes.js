import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", verifyJWT, authController.me);

export default router;
