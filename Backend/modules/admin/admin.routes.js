import express from "express";
import {
  createOfficer,
  getAllOfficers,
  toggleUserStatus,
  getAuditLogs,
  getDashboardStats,
  updateUserFinancials,
} from "./admin.controller.js";
import { authMiddleware, adminMiddleware } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getDashboardStats);
router.post("/officers", createOfficer);
router.get("/officers", getAllOfficers);
router.patch("/users/:userId/status", toggleUserStatus);
router.patch("/users/:userId/financials", updateUserFinancials);
router.get("/audit-logs", getAuditLogs);

export default router;