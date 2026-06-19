import { Router } from "express";
import * as ebookController from "../controllers/ebookController.js";
import * as purchaseController from "../controllers/purchaseController.js";
import * as adminController from "../controllers/adminController.js";
import { verifyJWT, verifyWriter } from "../middlewares/auth.js";

const router = Router();

router.get("/top", adminController.getTopWriters);

router.use(verifyJWT, verifyWriter);

router.get("/my-ebooks", ebookController.getWriterEbooks);
router.get("/sales-history", purchaseController.getWriterSales);
router.get("/sales", purchaseController.getWriterSales);
router.get("/dashboard-stats", async (req, res, next) => {
  try {
    const sales = await import("../services/purchaseService.js").then((m) =>
      m.getWriterSales(req.user._id)
    );
    const ebooks = await import("../services/ebookService.js").then((m) =>
      m.getWriterEbooks(req.user._id)
    );
    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
    res.json({
      totalEbooks: ebooks.length,
      totalSales: sales.length,
      totalRevenue,
      recentSales: sales.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
