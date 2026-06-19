import { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.get("/monthly-sales", adminController.getMonthlySales);
router.get("/genre-distribution", adminController.getGenreDistribution);

export default router;
