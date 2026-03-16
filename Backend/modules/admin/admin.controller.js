import User from "../users/user.model.js";
import Loan from "../loans/loan.model.js";
import AuditLog from "../audit/auditLog.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";
import xss from "xss";

const generateSecurePassword = () => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "@#$!%&*";

  const getRandom = (chars) => chars[crypto.randomInt(0, chars.length)];

  let password =
    getRandom(upper) +
    getRandom(special) +
    getRandom(numbers) +
    getRandom(lower);

  const allChars = lower + upper + numbers;
  for (let i = 0; i < 6; i++) {
    password += getRandom(allChars);
  }

  return password.split("").sort(() => crypto.randomInt(0, 2) - 0.5).join("");
};

const generateEmail = (name) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  const random = crypto.randomInt(100, 999);
  return `${cleanName}${random}@akhuwat.org`;
};

export const createOfficer = async (req, res) => {
  try {
    let { name, email } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    name = xss(name.trim());
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
    }

    let officerEmail = email ? email.trim().toLowerCase() : generateEmail(name);

    if (!validator.isEmail(officerEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const exists = await User.findOne({ email: officerEmail });
    if (exists) {
      officerEmail = generateEmail(name);
    }

    const password = generateSecurePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    const officer = await User.create({
      name,
      email: officerEmail,
      password: passwordHash,
      role: "officer",
      loginAttempts: 0,
      isLocked: false,
      isActive: true,
    });

    res.status(201).json({
      message: "Officer created successfully",
      officer: { id: officer._id, name: officer.name, email: officerEmail, role: "officer" },
      credentials: { email: officerEmail, password },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create officer" });
  }
};

export const getAllOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: "officer" })
      .select("-password -refreshTokens")
      .sort({ createdAt: -1 });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch officers" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    if (!["activate", "deactivate", "unlock"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use: activate, deactivate, unlock" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot modify your own account status" });
    }

    if (action === "activate") user.isActive = true;
    else if (action === "deactivate") user.isActive = false;
    else if (action === "unlock") {
      user.isLocked = false;
      user.loginAttempts = 0;
      user.lockedAt = null;
    }

    await user.save();
    res.json({
      message: `User ${action}d successfully`,
      user: { id: user._id, name: user.name, isActive: user.isActive, isLocked: user.isLocked },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.userId) query.userID = req.query.userId;
    if (req.query.action) query.action = req.query.action;
    if (req.query.success !== undefined) query.success = req.query.success === "true";

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate("userID", "name email role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ logs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalLoans, loansByStatus, recentLoans] = await Promise.all([
      User.countDocuments(),
      Loan.countDocuments(),
      Loan.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amountRequested" } } }]),
      Loan.find()
        .populate("applicant", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("loanNumber status amountRequested createdAt applicant"),
    ]);

    res.json({ totalUsers, totalLoans, loansByStatus, recentLoans });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const updateUserFinancials = async (req, res) => {
  try {
    const { userId } = req.params;
    const { income, liabilities, repaymentHistoryScore } = req.body;

    const updates = {};
    if (income !== undefined) {
      if (isNaN(income) || income < 0) return res.status(400).json({ message: "Invalid income value" });
      updates.income = Number(income);
    }
    if (liabilities !== undefined) {
      if (isNaN(liabilities) || liabilities < 0) return res.status(400).json({ message: "Invalid liabilities value" });
      updates.liabilities = Number(liabilities);
    }
    if (repaymentHistoryScore !== undefined) {
      const score = Number(repaymentHistoryScore);
      if (isNaN(score) || score < 0 || score > 100) return res.status(400).json({ message: "Score must be between 0 and 100" });
      updates.repaymentHistoryScore = score;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password -refreshTokens");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Financial profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update financials" });
  }
};