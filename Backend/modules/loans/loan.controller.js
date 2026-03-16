import Loan from "./loan.model.js";
import Installment from "../installments/installment.model.js";
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { evaluateEligibility } from "../../core/utils/eligibilityEngine.js";
import { generateInstallments } from "../../core/utils/installmentGenerator.js";
import { createNotification } from "../../core/utils/notificationHelper.js";
import xss from "xss";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_LOAN_TYPES = ["personal", "business", "education", "housing", "agriculture", "other"];

export const updateRemainingBalance = async (loanId) => {
  const installments = await Installment.find({ loan: loanId });
  const paidAmount = installments.filter((i) => i.paid).reduce((acc, i) => acc + i.amount, 0);
  const loan = await Loan.findById(loanId);
  if (!loan) return 0;
  loan.remainingBalance = parseFloat((loan.loanLimit - paidAmount).toFixed(2));
  await loan.save();
  return loan.remainingBalance;
};

const generateLoanNumber = async () => {
  const count = await Loan.countDocuments();
  const paddedNumber = String(count + 1).padStart(5, "0");
  return `AKH-${paddedNumber}`;
};

export const applyLoan = async (req, res) => {
  try {
    let { loanType, amountRequested, purpose, tenureMonths } = req.body;

    if (!loanType || !amountRequested || !purpose) {
      return res.status(400).json({ message: "loanType, amountRequested, and purpose are required" });
    }

    if (!VALID_LOAN_TYPES.includes(loanType)) {
      return res.status(400).json({ message: `Invalid loan type. Valid types: ${VALID_LOAN_TYPES.join(", ")}` });
    }

    const amount = Number(amountRequested);
    if (isNaN(amount) || amount < 1000 || amount > 5000000) {
      return res.status(400).json({ message: "Amount must be between Rs 1,000 and Rs 5,000,000" });
    }

    purpose = xss(purpose.trim());
    if (purpose.length < 10 || purpose.length > 500) {
      return res.status(400).json({ message: "Purpose must be between 10 and 500 characters" });
    }

    const tenure = tenureMonths ? Math.max(1, Math.min(120, parseInt(tenureMonths))) : 12;

    const pendingExists = await Loan.findOne({
      applicant: req.user.id,
      status: { $in: ["pending", "under_review", "eligible"] },
    });
    if (pendingExists) {
      return res.status(409).json({ message: "You already have an active loan application in progress" });
    }

    const loanNumber = await generateLoanNumber();

    const loan = await Loan.create({
      applicant: req.user.id,
      loanNumber,
      loanType,
      amountRequested: amount,
      purpose,
      tenureMonths: tenure,
      remainingBalance: amount,
    });

    await createNotification({
      userID: req.user.id,
      title: "Loan Application Submitted",
      message: `Your loan application ${loanNumber} for Rs ${amount.toLocaleString()} has been submitted and is under review.`,
      type: "loan_status",
      relatedLoan: loan._id,
    });

    res.status(201).json({ message: "Loan application submitted successfully", loan });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit loan application" });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = { applicant: req.user.id };
    if (req.query.status) query.status = req.query.status;

    const total = await Loan.countDocuments(query);
    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-approvalLetter");

    res.json({ loans, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.loanType) query.loanType = req.query.loanType;

    const total = await Loan.countDocuments(query);
    const loans = await Loan.find(query)
      .populate("applicant", "name email income liabilities repaymentHistoryScore")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-approvalLetter");

    res.json({ loans, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

export const getPendingLoans = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const total = await Loan.countDocuments({ status: "pending" });
    const loans = await Loan.find({ status: "pending" })
      .populate("applicant", "name email income liabilities repaymentHistoryScore")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const result = loans.map((loan) => {
      const eligibility = evaluateEligibility(loan.applicant);
      return {
        ...loan.toObject(),
        eligibilityScore: eligibility.eligibilityScore,
        loanLimit: eligibility.loanLimit,
        eligible: eligibility.eligible,
        dti: eligibility.dti,
      };
    });

    res.json({ loans: result, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending loans" });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    const loan = await Loan.findById(loanId)
      .populate("applicant", "name email income liabilities repaymentHistoryScore")
      .populate("approvedBy", "name email")
      .select("-approvalLetter");

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (req.user.role === "applicant" && loan.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loan" });
  }
};

export const evaluateLoanEligibility = async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    const loan = await Loan.findById(loanId).populate("applicant", "income liabilities repaymentHistoryScore");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (!["pending", "under_review"].includes(loan.status)) {
      return res.status(400).json({ message: "Loan cannot be evaluated in its current status" });
    }

    const eligibility = evaluateEligibility(loan.applicant);
    const effectiveLoanLimit = Math.min(eligibility.loanLimit, loan.amountRequested);

    loan.eligibilityScore = eligibility.eligibilityScore;
    loan.loanLimit = effectiveLoanLimit;
    loan.status = eligibility.eligible ? "eligible" : "rejected";

    if (!eligibility.eligible) {
      loan.rejectedAt = new Date();
    }

    await loan.save();

    await createNotification({
      userID: loan.applicant._id,
      title: "Eligibility Assessment Complete",
      message: `Your loan ${loan.loanNumber} has been assessed. Status: ${loan.status}. Score: ${eligibility.eligibilityScore}/100.`,
      type: "loan_status",
      relatedLoan: loan._id,
    });

    res.json({ loan, eligibility });
  } catch (err) {
    res.status(500).json({ message: "Eligibility evaluation failed" });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    let { status, officerComments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    officerComments = officerComments ? xss(officerComments.trim()) : "";

    const loan = await Loan.findById(loanId).populate("applicant", "name email income liabilities repaymentHistoryScore");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (!["pending", "eligible", "under_review"].includes(loan.status)) {
      return res.status(400).json({ message: `Loan cannot be ${status} from its current status (${loan.status})` });
    }

    loan.status = status;
    loan.officerComments = officerComments;
    loan.approvedBy = req.user.id;

    if (status === "approved") {
      loan.approvedAt = new Date();

      if (!loan.loanID) {
        loan.loanID = `L-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const approvedAmount = loan.loanLimit || loan.amountRequested;
      loan.loanLimit = approvedAmount;
      loan.remainingBalance = approvedAmount;

      await generateInstallments({
        _id: loan._id,
        applicantId: loan.applicant._id,
        amountRequested: approvedAmount,
        tenureMonths: loan.tenureMonths || 12,
        interestRate: loan.interestRate || 0,
      });

      const approvalLetterDir = path.join(process.cwd(), "approvalLetters");
      if (!fs.existsSync(approvalLetterDir)) {
        fs.mkdirSync(approvalLetterDir, { recursive: true });
      }

      const pdfPath = path.join(approvalLetterDir, `${loan.loanID}.pdf`);
      await generateApprovalLetterPDF(loan, pdfPath);
      loan.approvalLetter = pdfPath;
    } else {
      loan.rejectedAt = new Date();
    }

    await loan.save();

    const notificationTitle = status === "approved" ? "Loan Approved!" : "Loan Application Rejected";
    const notificationMessage =
      status === "approved"
        ? `Congratulations! Your loan ${loan.loanNumber} has been approved for Rs ${(loan.loanLimit || loan.amountRequested).toLocaleString()}.`
        : `Your loan application ${loan.loanNumber} has been rejected. Reason: ${officerComments || "Not specified"}`;

    await createNotification({
      userID: loan.applicant._id,
      title: notificationTitle,
      message: notificationMessage,
      type: "loan_status",
      relatedLoan: loan._id,
    });

    res.json({ message: `Loan ${status} successfully`, loan });
  } catch (err) {
    res.status(500).json({ message: "Failed to update loan status" });
  }
};

const generateApprovalLetterPDF = (loan, pdfPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(pdfPath);

    stream.on("finish", resolve);
    stream.on("error", reject);

    doc.pipe(stream);

    doc.fontSize(22).fillColor("#264653").text("Akhuwat Foundation", { align: "center" });
    doc.fontSize(12).fillColor("#666").text("Interest-Free Microfinance", { align: "center" });
    doc.moveDown(1.5);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#264653");
    doc.moveDown(0.5);

    doc.fontSize(18).fillColor("#000").text("Loan Approval Letter", { align: "center", underline: true });
    doc.moveDown(1);

    doc.fontSize(11).fillColor("#333");
    doc.text(`Date: ${new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}`, { align: "right" });
    doc.text(`Reference: ${loan.loanID}`, { align: "right" });
    doc.moveDown(1.5);

    doc.text(`Dear ${loan.applicant.name},`);
    doc.moveDown(0.5);
    doc.text(
      "We are pleased to inform you that your loan application with Akhuwat Foundation has been reviewed and approved. Please find the details of your approved loan below:",
      { lineGap: 4 }
    );
    doc.moveDown(1.5);

    doc.fontSize(12).fillColor("#264653").text("Loan Details", { underline: true });
    doc.moveDown(0.5);

    const details = [
      ["Loan Reference ID", loan.loanID],
      ["Application Number", loan.loanNumber],
      ["Loan Type", loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)],
      ["Approved Amount", `Rs ${(loan.loanLimit || loan.amountRequested).toLocaleString()}`],
      ["Tenure", `${loan.tenureMonths || 12} months`],
      ["Approval Date", new Date().toLocaleDateString("en-PK")],
      ["Officer Comments", loan.officerComments || "N/A"],
    ];

    doc.fontSize(11).fillColor("#000");
    for (const [label, value] of details) {
      doc.text(`${label}:  ${value}`, { indent: 20, lineGap: 3 });
    }

    doc.moveDown(1.5);
    doc.text(
      "Please note that you are expected to follow the repayment schedule provided separately. Timely payments will maintain your eligibility for future financing.",
      { lineGap: 4 }
    );
    doc.moveDown(1);
    doc.text("For any queries or assistance, please contact our office.", { lineGap: 4 });

    doc.moveDown(2);
    doc.fontSize(12).fillColor("#264653").text("Congratulations!", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(11).fillColor("#000");
    doc.text("Sincerely,");
    doc.moveDown(1.5);
    doc.text("_______________________");
    doc.text("Loan Officer");
    doc.text("Akhuwat Foundation");

    doc
      .fontSize(9)
      .fillColor("#888")
      .text(
        "This is a computer-generated document. Akhuwat Foundation - Empowering communities through interest-free microfinance.",
        50,
        760,
        { align: "center", width: 495 }
      );

    doc.end();
  });
};

export const downloadApprovalLetter = async (req, res) => {
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

    if (!loan.approvalLetter) return res.status(400).json({ message: "Approval letter not generated yet" });

    const filePath = path.resolve(loan.approvalLetter);
    const normalizedPath = path.normalize(filePath);
    const approvalDir = path.resolve(process.cwd(), "approvalLetters");
    if (!normalizedPath.startsWith(approvalDir)) {
      return res.status(400).json({ message: "Invalid file path" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Approval letter file not found" });
    }

    res.download(filePath, `${loan.loanID}_ApprovalLetter.pdf`);
  } catch (err) {
    res.status(500).json({ message: "Failed to download approval letter" });
  }
};

export const getLoanStats = async (req, res) => {
  try {
    const stats = await Loan.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amountRequested" },
          avgAmount: { $avg: "$amountRequested" },
        },
      },
    ]);

    const totalLoans = await Loan.countDocuments();
    const totalApprovedAmount = await Loan.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$loanLimit" } } },
    ]);

    res.json({
      byStatus: stats,
      totalLoans,
      totalApprovedAmount: totalApprovedAmount[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};