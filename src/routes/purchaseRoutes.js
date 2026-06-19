import { Router } from "express";
import * as purchaseController from "../controllers/purchaseController.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyJWT, verifyAdmin, purchaseController.getAll);
router.get("/user", verifyJWT, purchaseController.getByUser);
router.get("/history", verifyJWT, purchaseController.getByUser);
router.post(
  "/create-checkout-session",
  verifyJWT,
  purchaseController.createCheckout
);
router.post("/confirm", verifyJWT, purchaseController.confirm);

export default router;
