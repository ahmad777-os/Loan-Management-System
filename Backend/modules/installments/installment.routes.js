import express from "express";
import Installment from "./installment.model.js";
import Loan from "../loans/loan.model.js";
import { authMiddleware, officerMiddleware } from "../../core/middlewares/authMiddleware.js";
import { updateRemainingBalance } from "../loans/loan.controller.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ applicant: req.user.id }).select("_id");
    if (!loans.length) return res.json({ installments: [] });

    const loanIds = loans.map((l) => l._id);
    const installments = await Installment.find({ loan: { $in: loanIds } })
      .populate("loan", "loanNumber loanType status")
      .sort({ dueDate: 1 });

    res.json({ installments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch installments" });
  }
});

router.get("/:loanId", authMiddleware, async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (req.user.role === "applicant" && loan.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const installments = await Installment.find({ loan: loanId }).sort({ installmentNumber: 1 });
    const paid = installments.filter((i) => i.paid).length;
    const overdue = installments.filter((i) => !i.paid && new Date(i.dueDate) < new Date()).length;

    res.json({
      installments,
      summary: {
        total: installments.length,
        paid,
        overdue,
        remaining: installments.length - paid,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch installments" });
  }
});

router.put("/pay/:id", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid installment ID" });
    }

    const installment = await Installment.findById(id);
    if (!installment) return res.status(404).json({ message: "Installment not found" });

    if (installment.paid) {
      return res.status(400).json({ message: "Installment already paid" });
    }

    installment.paid = true;
    installment.paidAt = new Date();
    installment.paidBy = req.user.id;
    await installment.save();

    const remainingBalance = await updateRemainingBalance(installment.loan);

    res.json({ message: "Installment marked as paid", installment, remainingBalance });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark installment as paid" });
  }
});

router.get("/overdue/all", authMiddleware, officerMiddleware, async (req, res) => {
  try {
    const overdue = await Installment.find({
      paid: false,
      dueDate: { $lt: new Date() },
    })
      .populate("loan", "loanNumber applicant")
      .populate("applicant", "name email")
      .sort({ dueDate: 1 });

    res.json({ count: overdue.length, installments: overdue });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overdue installments" });
  }
});

export default router;