import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    loanNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    loanID: {
      type: String,
      unique: true,
      sparse: true,
    },
    loanType: {
      type: String,
      required: true,
      enum: ["personal", "business", "education", "housing", "agriculture", "other"],
    },
    amountRequested: {
      type: Number,
      required: true,
      min: [1000, "Minimum loan amount is 1000"],
      max: [5000000, "Maximum loan amount is 5,000,000"],
    },
    purpose: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "eligible", "approved", "rejected", "disbursed", "closed"],
      default: "pending",
      index: true,
    },
    eligibilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    loanLimit: {
      type: Number,
      min: 0,
    },
    officerComments: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    approvalLetter: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectedAt: Date,
    tenureMonths: {
      type: Number,
      default: 12,
      min: 1,
      max: 120,
    },
    remainingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    interestRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    disbursedAt: Date,
  },
  { timestamps: true }
);

loanSchema.index({ applicant: 1, status: 1 });
loanSchema.index({ createdAt: -1 });

export default mongoose.model("Loan", loanSchema);