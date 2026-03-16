import express from "express";
import {
  registerApplicant,
  getMyApplicantProfile,
  getApplicantByID,
  getAllApplicants,
  updateApplicant,
} from "./applicant.controller.js";
import { authMiddleware, roleMiddleware } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authMiddleware, roleMiddleware(["applicant"]), registerApplicant);
router.get("/me", authMiddleware, getMyApplicantProfile);
router.get("/all", authMiddleware, roleMiddleware(["admin", "officer"]), getAllApplicants);
router.get("/:id", authMiddleware, roleMiddleware(["admin", "officer"]), getApplicantByID);
router.patch("/:id", authMiddleware, updateApplicant);

export default router;