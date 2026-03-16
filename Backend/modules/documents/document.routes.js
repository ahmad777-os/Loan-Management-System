import express from "express";
import {
  uploadDocuments,
  getDocumentsByLoan,
  verifyDocuments,
  getAllPendingDocuments,
} from "./document.controller.js";
import { authMiddleware, officerMiddleware } from "../../core/middlewares/authMiddleware.js";
import { upload, handleMulterError } from "../../core/middlewares/uploadMiddleware.js";
import { uploadRateLimiter } from "../../core/middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  uploadRateLimiter,
  upload.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "incomeProof", maxCount: 1 },
  ]),
  handleMulterError,
  uploadDocuments
);

router.get("/pending", authMiddleware, officerMiddleware, getAllPendingDocuments);
router.get("/:loanId", authMiddleware, getDocumentsByLoan);
router.patch("/verify/:id", authMiddleware, officerMiddleware, verifyDocuments);

export default router;