import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import * as ebookController from "../controllers/ebookController.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT, verifyAdmin);

router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/ebooks", ebookController.getAdminEbooks);
router.patch("/ebooks/:id/publish", ebookController.publish);
router.patch("/ebooks/:id/unpublish", ebookController.unpublish);
router.delete("/ebooks/:id", ebookController.remove);
router.get("/transactions", adminController.getTransactions);
router.get("/stats", adminController.getStats);
router.get("/analytics", adminController.getAnalytics);

export default router;
