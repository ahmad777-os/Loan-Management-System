import Document from "./document.model.js";
import Loan from "../loans/loan.model.js";
import mongoose from "mongoose";
import xss from "xss";

export const uploadDocuments = async (req, res) => {
  try {
    const { loanId } = req.body;

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Valid Loan ID is required" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied: You do not own this loan" });
    }

    if (!["pending", "under_review"].includes(loan.status)) {
      return res.status(400).json({ message: "Documents can only be uploaded for pending or under review loans" });
    }

    if (!req.files?.cnicFront || !req.files?.cnicBack || !req.files?.incomeProof) {
      return res.status(400).json({ message: "cnicFront, cnicBack, and incomeProof files are required" });
    }

    const existingDoc = await Document.findOne({ loanId: loan._id });

    if (existingDoc) {
      existingDoc.cnicFront = req.files.cnicFront[0].path;
      existingDoc.cnicBack = req.files.cnicBack[0].path;
      existingDoc.incomeProof = req.files.incomeProof[0].path;
      existingDoc.verificationStatus = "pending";
      existingDoc.officerComments = "";
      existingDoc.verifiedBy = undefined;
      existingDoc.verifiedAt = undefined;
      await existingDoc.save();

      return res.json({ message: "Documents updated successfully", document: existingDoc });
    }

    const doc = await Document.create({
      loanId: loan._id,
      applicantId: req.user.id,
      cnicFront: req.files.cnicFront[0].path,
      cnicBack: req.files.cnicBack[0].path,
      incomeProof: req.files.incomeProof[0].path,
      verificationStatus: "pending",
    });

    res.status(201).json({ message: "Documents uploaded successfully", document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload documents" });
  }
};

export const getDocumentsByLoan = async (req, res) => {
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

    const doc = await Document.findOne({ loanId })
      .populate("applicantId", "name email")
      .populate("verifiedBy", "name email");

    if (!doc) return res.status(404).json({ message: "No documents found for this loan" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const verifyDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    let { verificationStatus, officerComments } = req.body;

    if (!["verified", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({ message: "verificationStatus must be 'verified' or 'rejected'" });
    }

    officerComments = officerComments ? xss(officerComments.trim()) : "";

    if (verificationStatus === "rejected" && !officerComments) {
      return res.status(400).json({ message: "Comments are required when rejecting documents" });
    }

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.verificationStatus = verificationStatus;
    doc.officerComments = officerComments;
    doc.verifiedBy = req.user.id;
    doc.verifiedAt = new Date();
    await doc.save();

    res.json({ message: `Documents ${verificationStatus} successfully`, document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify documents" });
  }
};

export const getAllPendingDocuments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const query = { verificationStatus: "pending" };
    const total = await Document.countDocuments(query);
    const docs = await Document.find(query)
      .populate("applicantId", "name email")
      .populate("loanId", "loanNumber loanType amountRequested")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ documents: docs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending documents" });
  }
};