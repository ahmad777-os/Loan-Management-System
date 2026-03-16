import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./theme/theme.css"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Layout from "./components/layout/Layout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import LoanPrograms from "./pages/public/LoanPrograms";
import HowItWorks from "./pages/public/HowItWorks";
import Contact from "./pages/public/Contact";

import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./modules/dashboard/admin/AdminDashboard";
import OfficerDashboard from "./modules/dashboard/officer/OfficerDashboard";
import ApplicantDashboard from "./modules/dashboard/applicant/ApplicantDashboard";

import AllLoans from "./modules/loans/AllLoans";
import LoanDetail from "./modules/loans/LoanDetail";
import PendingLoans from "./modules/loans/PendingLoans";
import Overdue from "./modules/loans/Overdue";

import Applicants from "./modules/applicants/Applicants";
import ApplyLoan from "./modules/applications/ApplyLoan";
import MyInstallments from "./modules/installments/MyInstallments";
import Profile from "./modules/profile/Profile";
import Notifications from "./modules/notifications/Notifications";

import Officers from "./modules/admin/Officers";
import AuditLogs from "./modules/admin/AuditLogs";

import { useAuth } from "./context/AuthContext";

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "officer") return <OfficerDashboard />;
  return <ApplicantDashboard />;
}

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/loan-programs" element={<LoanPrograms />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/dashboard" element={<AppLayout><DashboardRouter /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />

          <Route path="/apply-loan" element={<ProtectedRoute roles={["applicant"]}><Layout><ApplyLoan /></Layout></ProtectedRoute>} />
          <Route path="/my-installments" element={<ProtectedRoute roles={["applicant"]}><Layout><MyInstallments /></Layout></ProtectedRoute>} />
          <Route path="/loans/:id" element={<AppLayout><LoanDetail /></AppLayout>} />
          <Route path="/all-loans" element={<ProtectedRoute roles={["officer", "admin"]}><Layout><AllLoans /></Layout></ProtectedRoute>} />
          <Route path="/pending-loans" element={<ProtectedRoute roles={["officer", "admin"]}><Layout><PendingLoans /></Layout></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute roles={["officer", "admin"]}><Layout><Applicants /></Layout></ProtectedRoute>} />
          <Route path="/overdue" element={<ProtectedRoute roles={["officer", "admin"]}><Layout><Overdue /></Layout></ProtectedRoute>} />
          <Route path="/officers" element={<ProtectedRoute roles={["admin"]}><Layout><Officers /></Layout></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute roles={["admin"]}><Layout><AuditLogs /></Layout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}