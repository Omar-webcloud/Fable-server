import { Router } from "express";
import * as purchaseController from "../controllers/purchaseController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.post("/checkout", verifyJWT, purchaseController.createCheckout);
router.get("/verify/:sessionId", verifyJWT, purchaseController.verifyPayment);

export default router;
