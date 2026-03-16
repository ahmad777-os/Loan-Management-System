import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    installmentNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    principal: {
      type: Number,
      default: 0,
    },
    interest: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lateFee: {
      type: Number,
      default: 0,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

installmentSchema.index({ loan: 1, installmentNumber: 1 });
installmentSchema.index({ dueDate: 1, paid: 1 });

export default mongoose.model("Installment", installmentSchema);