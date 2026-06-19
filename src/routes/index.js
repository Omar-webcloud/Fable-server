import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import ebookRoutes from "./ebookRoutes.js";
import bookmarkRoutes from "./bookmarkRoutes.js";
import purchaseRoutes from "./purchaseRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import writerRoutes from "./writerRoutes.js";
import adminRoutes from "./adminRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import * as purchaseController from "../controllers/purchaseController.js";

const router = Router();

function mountRoutes(basePath, routes) {
  router.use(basePath, routes);
}

const routeMap = [
  ["/auth", authRoutes],
  ["/users", userRoutes],
  ["/ebooks", ebookRoutes],
  ["/bookmarks", bookmarkRoutes],
  ["/purchases", purchaseRoutes],
  ["/payments", paymentRoutes],
  ["/writer", writerRoutes],
  ["/writers", writerRoutes],
  ["/admin", adminRoutes],
  ["/analytics", analyticsRoutes],
  ["/upload", uploadRoutes],
];

for (const [path, routes] of routeMap) {
  mountRoutes(path, routes);
  mountRoutes(`/api${path}`, routes);
}

router.post("/webhooks/stripe", purchaseController.stripeWebhook);
router.post("/api/webhooks/stripe", purchaseController.stripeWebhook);

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "fable-server" });
});

export default router;
