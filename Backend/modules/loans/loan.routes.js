import express from "express";
import {
  applyLoan,
  getMyLoans,
  getAllLoans,
  getPendingLoans,
  getLoanById,
  updateLoanStatus,
  evaluateLoanEligibility,
  downloadApprovalLetter,
  getLoanStats,
} from "./loan.controller.js";
import { authMiddleware, roleMiddleware, officerMiddleware } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, roleMiddleware(["applicant"]), applyLoan);
router.get("/my", authMiddleware, getMyLoans);
router.get("/stats", authMiddleware, roleMiddleware(["admin", "officer"]), getLoanStats);
router.get("/pending", authMiddleware, officerMiddleware, getPendingLoans);
router.get("/all", authMiddleware, officerMiddleware, getAllLoans);
router.get("/eligibility/:loanId", authMiddleware, officerMiddleware, evaluateLoanEligibility);
router.get("/approval-letter/:loanId", authMiddleware, downloadApprovalLetter);
router.get("/:loanId", authMiddleware, getLoanById);
router.patch("/status/:loanId", authMiddleware, officerMiddleware, updateLoanStatus);

export default router;