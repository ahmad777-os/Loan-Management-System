import Applicant from "./applicant.model.js";
import { generateApplicantID } from "../../core/utils/generateApplicantID.js";
import xss from "xss";

export const registerApplicant = async (req, res) => {
  try {
    const userID = req.user.id;

    const exists = await Applicant.findOne({ userID });
    if (exists) return res.status(409).json({ message: "Applicant profile already registered" });

    const {
      cnic,
      cnicIssueDate,
      cnicExpiryDate,
      cnicFront,
      cnicBack,
      phone,
      altPhone,
      address,
      city,
      province,
      occupation,
      monthlyIncome,
      dependents,
    } = req.body;

    if (!cnic || !cnicIssueDate || !cnicExpiryDate || !cnicFront || !cnicBack || !phone || !address) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!/^[0-9]{13}$/.test(cnic)) {
      return res.status(400).json({ message: "CNIC must be exactly 13 digits" });
    }

    if (!/^03[0-9]{9}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be a valid Pakistani number (03xxxxxxxxx)" });
    }

    if (altPhone && !/^03[0-9]{9}$/.test(altPhone)) {
      return res.status(400).json({ message: "Alternate phone must be a valid Pakistani number" });
    }

    const issueDate = new Date(cnicIssueDate);
    const expiryDate = new Date(cnicExpiryDate);
    if (isNaN(issueDate) || isNaN(expiryDate)) {
      return res.status(400).json({ message: "Invalid CNIC dates" });
    }
    if (expiryDate <= issueDate) {
      return res.status(400).json({ message: "CNIC expiry date must be after issue date" });
    }
    if (expiryDate <= new Date()) {
      return res.status(400).json({ message: "CNIC is expired" });
    }

    const cnicExists = await Applicant.findOne({ cnic });
    if (cnicExists) return res.status(409).json({ message: "This CNIC is already registered" });

    const lastApplicant = await Applicant.findOne().sort({ createdAt: -1 });
    let lastNumber = 0;
    if (lastApplicant?.applicantID) {
      const parts = lastApplicant.applicantID.split("-");
      lastNumber = parseInt(parts[1]) || 0;
    }
    const applicantID = generateApplicantID(lastNumber);

    const applicant = await Applicant.create({
      userID,
      cnic,
      cnicIssueDate: issueDate,
      cnicExpiryDate: expiryDate,
      cnicFront: xss(cnicFront),
      cnicBack: xss(cnicBack),
      phone,
      altPhone: altPhone || undefined,
      address: xss(address.trim()),
      city: city ? xss(city.trim()) : undefined,
      province: province ? xss(province.trim()) : undefined,
      occupation: occupation ? xss(occupation.trim()) : undefined,
      monthlyIncome: monthlyIncome ? Number(monthlyIncome) : 0,
      dependents: dependents ? Number(dependents) : 0,
      applicantID,
    });

    res.status(201).json({ message: "Applicant registered successfully", applicant });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const getMyApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ userID: req.user.id }).populate("userID", "name email role createdAt");
    if (!applicant) return res.status(404).json({ message: "Applicant profile not found" });
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const getApplicantByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !/^APP-[0-9]+$/.test(id)) {
      return res.status(400).json({ message: "Invalid applicant ID format" });
    }
    const applicant = await Applicant.findOne({ applicantID: id }).populate("userID", "name email role createdAt");
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicant" });
  }
};

export const getAllApplicants = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const total = await Applicant.countDocuments();
    const applicants = await Applicant.find()
      .populate("userID", "name email createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ applicants, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

export const updateApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ applicantID: req.params.id });
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    if (applicant.userID.toString() !== req.user.id && req.user.role === "applicant") {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedFields = ["phone", "altPhone", "address", "city", "province", "occupation", "monthlyIncome", "dependents"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "phone" && !/^03[0-9]{9}$/.test(req.body[field])) {
          return res.status(400).json({ message: "Invalid phone format" });
        }
        if (field === "altPhone" && req.body[field] && !/^03[0-9]{9}$/.test(req.body[field])) {
          return res.status(400).json({ message: "Invalid alternate phone format" });
        }
        updates[field] = typeof req.body[field] === "string" ? xss(req.body[field].trim()) : req.body[field];
      }
    }

    const updated = await Applicant.findOneAndUpdate({ applicantID: req.params.id }, updates, { new: true });
    res.json({ message: "Profile updated successfully", applicant: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};