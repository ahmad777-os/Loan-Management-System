import { Link } from "react-router-dom";
import {
  Briefcase, GraduationCap, HeartHandshake, Sparkles,
  Home, Wrench, ArrowRight, CheckCircle2, Clock, Banknote
} from "lucide-react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import "./LoanPrograms.css";

const programs = [
  {
    icon: Briefcase,
    title: "Small Business Loan",
    desc: "Empower your entrepreneurial journey. Whether you are starting fresh or expanding an existing venture, this loan gives you the working capital to grow.",
    amount: "PKR 10,000 – 500,000",
    duration: "12–36 months",
    repayment: "Monthly installments",
    color: "#16a34a",
    requirements: [
      "Valid CNIC",
      "Business plan or existing business proof",
      "Community guarantor",
      "Resident of serviceable area",
    ],
    tag: "Most Popular",
  },
  {
    icon: GraduationCap,
    title: "Education Loan",
    desc: "Invest in the future. Fund tuition, books, and living expenses for higher education without the burden of interest.",
    amount: "PKR 10,000 – 200,000",
    duration: "12–24 months",
    repayment: "Monthly installments",
    color: "#0d9488",
    requirements: [
      "Valid CNIC of applicant or guardian",
      "Enrollment or admission letter",
      "Academic records",
      "Community guarantor",
    ],
    tag: null,
  },
  {
    icon: HeartHandshake,
    title: "Marriage Loan",
    desc: "Celebrate life's most beautiful milestone with dignity. Cover wedding expenses without taking on crippling debt.",
    amount: "PKR 50,000 – 300,000",
    duration: "12–30 months",
    repayment: "Monthly installments",
    color: "#7c3aed",
    requirements: [
      "Valid CNIC",
      "Nikah registration or wedding date proof",
      "Income proof",
      "Community guarantor",
    ],
    tag: null,
  },
  {
    icon: Sparkles,
    title: "Emergency Loan",
    desc: "Life is unpredictable. Get fast access to funds for medical emergencies, urgent repairs, or unforeseen crises.",
    amount: "PKR 5,000 – 100,000",
    duration: "6–12 months",
    repayment: "Monthly installments",
    color: "#dc2626",
    requirements: [
      "Valid CNIC",
      "Description of emergency",
      "Supporting documentation",
      "Community guarantor",
    ],
    tag: "Fast Approval",
  },
  {
    icon: Home,
    title: "Housing Loan",
    desc: "Repair, renovate, or improve your home. Build a dignified living space for your family without interest.",
    amount: "PKR 50,000 – 400,000",
    duration: "24–48 months",
    repayment: "Monthly installments",
    color: "#b45309",
    requirements: [
      "Valid CNIC",
      "Property ownership or tenancy proof",
      "Construction/repair estimate",
      "Community guarantor",
    ],
    tag: null,
  },
  {
    icon: Wrench,
    title: "Livelihood Loan",
    desc: "For farmers, artisans, and skilled workers. Finance tools, equipment, or raw materials to sustain your livelihood.",
    amount: "PKR 10,000 – 150,000",
    duration: "12–24 months",
    repayment: "Monthly or seasonal",
    color: "#0284c7",
    requirements: [
      "Valid CNIC",
      "Proof of livelihood or trade",
      "Equipment or material quotation",
      "Community guarantor",
    ],
    tag: null,
  },
];

export default function LoanPrograms() {
  return (
    <div className="lp">
      <PublicNav />

      <section className="lp__hero">
        <div className="lp__hero-inner">
          <p className="lp__hero-tag">Zero Interest. Real Impact.</p>
          <h1 className="lp__hero-heading">
            Loan Programs<br />
            <span>Built for You</span>
          </h1>
          <p className="lp__hero-desc">
            Six tailored programs covering business, education, emergencies, and more. All at 0% interest.
          </p>
        </div>
      </section>

      <section className="lp__programs">
        <div className="lp__inner">
          <div className="lp__grid">
            {programs.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="lp__card">
                  {p.tag && (
                    <div className="lp__card-tag" style={{ background: p.color + "18", color: p.color }}>
                      {p.tag}
                    </div>
                  )}
                  <div className="lp__card-icon" style={{ background: p.color + "15", color: p.color }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="lp__card-title">{p.title}</h3>
                  <p className="lp__card-desc">{p.desc}</p>

                  <div className="lp__card-meta">
                    <div className="lp__meta-item">
                      <Banknote size={14} />
                      <span>{p.amount}</span>
                    </div>
                    <div className="lp__meta-item">
                      <Clock size={14} />
                      <span>{p.duration}</span>
                    </div>
                  </div>

                  <div className="lp__divider" />

                  <h4 className="lp__req-heading">Requirements</h4>
                  <ul className="lp__req-list">
                    {p.requirements.map((r) => (
                      <li key={r} className="lp__req-item">
                        <CheckCircle2 size={13} style={{ color: p.color }} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register" className="lp__apply-btn" style={{ background: p.color }}>
                    Apply for This Loan <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp__note">
        <div className="lp__inner">
          <div className="lp__note-card">
            <h3 className="lp__note-heading">All Loans Are Interest-Free</h3>
            <p className="lp__note-text">
              Akhuwat charges no interest, no service fees, and no hidden costs. You repay exactly what you borrow. Our model is based on Qarz-e-Hasna — a trust-based, community-supported loan system inspired by Islamic principles.
            </p>
            <Link to="/register" className="lp__note-btn">
              Create Your Account <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}