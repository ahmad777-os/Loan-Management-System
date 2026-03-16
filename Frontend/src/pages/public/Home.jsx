import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Briefcase, GraduationCap,
  HeartHandshake, Sparkles, Users, TrendingUp, Building2,
  ShieldCheck, Clock, Star
} from "lucide-react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import "./Home.css";

const loanCategories = [
  {
    icon: Briefcase,
    title: "Small Business",
    desc: "Start or expand your small business with dignified financing.",
    amount: "Up to PKR 500,000",
    duration: "12–36 months",
    color: "#16a34a",
  },
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Fund your education or your child's future without burden.",
    amount: "Up to PKR 200,000",
    duration: "12–24 months",
    color: "#0d9488",
  },
  {
    icon: HeartHandshake,
    title: "Marriage",
    desc: "Celebrate life's milestones without financial stress.",
    amount: "Up to PKR 300,000",
    duration: "12–30 months",
    color: "#7c3aed",
  },
  {
    icon: Sparkles,
    title: "Emergency",
    desc: "Fast disbursement for urgent, unforeseen needs.",
    amount: "Up to PKR 100,000",
    duration: "6–12 months",
    color: "#dc2626",
  },
];

const steps = [
  { num: "01", title: "Apply Online", desc: "Create an account and submit your loan application with required documents." },
  { num: "02", title: "Verification", desc: "A loan officer reviews your application and verifies your information." },
  { num: "03", title: "Approval", desc: "Your application is reviewed and a decision is communicated promptly." },
  { num: "04", title: "Disbursement", desc: "Approved funds are disbursed directly to you quickly and securely." },
];

const stats = [
  { icon: Users, value: "500K+", label: "Families Supported" },
  { icon: TrendingUp, value: "PKR 150B+", label: "Total Loans Disbursed" },
  { icon: Building2, value: "200+", label: "Cities Served" },
  { icon: Star, value: "0%", label: "Interest Rate" },
];

const eligibility = [
  "Pakistani citizen aged 18–60",
  "Resident of a serviceable city",
  "Valid CNIC and proof of residence",
  "Viable purpose for the loan",
  "Community-based guarantor (for some programs)",
];

export default function Home() {
  return (
    <div className="home">
      <PublicNav />

      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__hero-orb home__hero-orb--1" />
          <div className="home__hero-orb home__hero-orb--2" />
          <div className="home__hero-orb home__hero-orb--3" />
          <div className="home__hero-grid" />
        </div>
        <div className="home__hero-inner">
          <div className="home__hero-badge">
            <ShieldCheck size={14} />
            <span>100% Interest Free — No Hidden Charges</span>
          </div>
          <h1 className="home__hero-heading">
            Financial Dignity<br />
            <span className="home__hero-heading-accent">for Every Family</span>
          </h1>
          <p className="home__hero-desc">
            Akhuwat provides interest-free loans to empower individuals and communities across Pakistan. No interest, no exploitation — just trust and dignity.
          </p>
          <div className="home__hero-actions">
            <Link to="/register" className="home__btn-primary">
              Apply for a Loan
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="home__btn-secondary">
              Sign In to Dashboard
            </Link>
          </div>
          <div className="home__hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="home__hero-stat">
                <span className="home__hero-stat-value">{s.value}</span>
                <span className="home__hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home__categories">
        <div className="home__section-inner">
          <div className="home__section-header">
            <p className="home__section-tag">What We Offer</p>
            <h2 className="home__section-heading">Loan Programs</h2>
            <p className="home__section-sub">Tailored interest-free financing for every life situation.</p>
          </div>
          <div className="home__categories-grid">
            {loanCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="home__cat-card">
                  <div className="home__cat-icon" style={{ background: cat.color + "18", color: cat.color }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="home__cat-title">{cat.title}</h3>
                  <p className="home__cat-desc">{cat.desc}</p>
                  <div className="home__cat-meta">
                    <span className="home__cat-meta-item">{cat.amount}</span>
                    <span className="home__cat-meta-sep">·</span>
                    <span className="home__cat-meta-item">{cat.duration}</span>
                  </div>
                  <Link to="/loan-programs" className="home__cat-link">
                    Learn more <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home__how">
        <div className="home__section-inner">
          <div className="home__section-header">
            <p className="home__section-tag">Simple Process</p>
            <h2 className="home__section-heading">How It Works</h2>
            <p className="home__section-sub">From application to disbursement in four clear steps.</p>
          </div>
          <div className="home__how-steps">
            {steps.map((step, i) => (
              <div key={step.num} className="home__how-step">
                <div className="home__how-step-num">{step.num}</div>
                {i < steps.length - 1 && <div className="home__how-connector" />}
                <h3 className="home__how-step-title">{step.title}</h3>
                <p className="home__how-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="home__how-cta">
            <Link to="/how-it-works" className="home__btn-outline">
              Full Application Guide <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home__impact">
        <div className="home__section-inner">
          <div className="home__impact-grid">
            <div className="home__impact-text">
              <p className="home__section-tag home__section-tag--light">Our Impact</p>
              <h2 className="home__impact-heading">Changing Lives<br />Across Pakistan</h2>
              <p className="home__impact-desc">
                Since inception, Akhuwat has been at the forefront of compassionate microfinance — delivering zero-interest loans rooted in Islamic principles of brotherhood and mutual aid.
              </p>
              <div className="home__impact-stats">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="home__impact-stat">
                      <div className="home__impact-stat-icon">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="home__impact-stat-value">{s.value}</div>
                        <div className="home__impact-stat-label">{s.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/about" className="home__btn-primary">
                Our Story <ArrowRight size={15} />
              </Link>
            </div>
            <div className="home__eligibility">
              <div className="home__eligibility-card">
                <div className="home__eligibility-header">
                  <Clock size={18} />
                  <h3>Who Can Apply?</h3>
                </div>
                <ul className="home__eligibility-list">
                  {eligibility.map((item) => (
                    <li key={item} className="home__eligibility-item">
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="home__btn-primary home__btn-full">
                  Start Application <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__cta-orb home__cta-orb--1" />
        <div className="home__cta-orb home__cta-orb--2" />
        <div className="home__section-inner home__cta-inner">
          <h2 className="home__cta-heading">Ready to Take the First Step?</h2>
          <p className="home__cta-sub">Join half a million families who've transformed their lives with Akhuwat's interest-free loans.</p>
          <div className="home__hero-actions">
            <Link to="/register" className="home__btn-primary home__btn-light">
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="home__btn-ghost-light">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}