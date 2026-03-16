import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./core/config/db.js";
import { createSuperAdmin } from "./scripts/createSuperAdmin.js";

import authRoutes from "./modules/auth/auth.routes.js";
import applicantRoutes from "./modules/applicants/applicant.routes.js";
import loanRoutes from "./modules/loans/loan.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import documentRoutes from "./modules/documents/document.routes.js";
import installmentRoutes from "./modules/installments/installment.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitize(obj[key]);
    }
  }
};

app.use((req, _res, next) => {
  sanitize(req.body);
  sanitize(req.params);
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/installments", installmentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
  res.status(status).json({ message });
});

const startServer = async () => {
  await connectDB();
  await createSuperAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();