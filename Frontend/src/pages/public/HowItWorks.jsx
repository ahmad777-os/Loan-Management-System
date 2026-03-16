import { Link } from "react-router-dom";
import {
  UserPlus, FileText, Search, CheckSquare, Banknote,
  CreditCard, ArrowRight, HelpCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import "./HowItWorks.css";

const steps = [
  {
    icon: UserPlus,
    num: "01",
    title: "Register an Account",
    desc: "Create your free applicant account on the Akhuwat Loan Management System. You will need your CNIC and basic personal information to get started.",
    details: ["Provide your full name, CNIC, and contact details", "Set a secure password", "Verify your account via email or phone", "Complete your profile with address and employment info"],
  },
  {
    icon: FileText,
    num: "02",
    title: "Submit Application",
    desc: "Log into your dashboard and fill out the loan application form. Select the loan program that fits your needs, provide the loan amount, and upload required documents.",
    details: ["Choose your loan category (Business, Education, etc.)", "Enter the requested loan amount and purpose", "Upload supporting documents (CNIC, income proof, etc.)", "Submit your application for review"],
  },
  {
    icon: Search,
    num: "03",
    title: "Officer Verification",
    desc: "A dedicated loan officer will review your application. They may contact you for a field visit or additional documents to verify your information.",
    details: ["Application assigned to a loan officer", "Officer reviews documents and history", "Field visit may be conducted if required", "Officer prepares recommendation report"],
  },
  {
    icon: CheckSquare,
    num: "04",
    title: "Approval Decision",
    desc: "Your application is reviewed by the credit committee. A decision — approval, conditional approval, or rejection — is communicated to you via your dashboard and email.",
    details: ["Committee review of officer's recommendation", "Loan amount may be adjusted based on review", "Decision communicated within 5–10 business days", "Approval letter issued for accepted applications"],
  },
  {
    icon: Banknote,
    num: "05",
    title: "Loan Disbursement",
    desc: "Upon approval, funds are disbursed directly to you. You will receive a disbursement notification and a complete repayment schedule in your dashboard.",
    details: ["Sign the loan agreement documents", "Funds disbursed via bank transfer or in-person", "Receive detailed repayment schedule", "Loan appears in your dashboard"],
  },
  {
    icon: CreditCard,
    num: "06",
    title: "Installment Repayment",
    desc: "Repay your loan in easy monthly installments according to the schedule. Track every installment through your applicant dashboard. No interest, ever.",
    details: ["View installments in your dashboard", "Receive reminders before due dates", "Pay on time to maintain good standing", "Early repayment is always welcome"],
  },
];

const faqs = [
  {
    q: "Is the loan truly interest-free?",
    a: "Yes, completely. Akhuwat does not charge any interest (riba) or hidden fees. You repay exactly the amount you borrow, nothing more.",
  },
  {
    q: "How long does the approval process take?",
    a: "Most applications are processed within 5–10 business days. Emergency loans may be fast-tracked to 2–3 business days depending on urgency.",
  },
  {
    q: "What happens if I miss an installment?",
    a: "We encourage you to contact your loan officer as soon as possible. Akhuwat works with borrowers facing genuine hardship to restructure repayment plans.",
  },
  {
    q: "Can I apply for multiple loans?",
    a: "You can apply for a second loan after successfully repaying 50% or more of your current loan, subject to eligibility criteria.",
  },
  {
    q: "Do I need collateral?",
    a: "No collateral is required. Akhuwat uses a community-based guarantor model rooted in trust and brotherhood rather than asset-based security.",
  },
];

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="hiw">
      <PublicNav />

      <section className="hiw__hero">
        <div className="hiw__hero-inner">
          <p className="hiw__hero-tag">Simple & Transparent</p>
          <h1 className="hiw__hero-heading">
            How Akhuwat<br />
            <span>Loans Work</span>
          </h1>
          <p className="hiw__hero-desc">
            From application to disbursement, every step is clear, fair, and built around your needs.
          </p>
        </div>
      </section>

      <section className="hiw__steps">
        <div className="hiw__inner">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;
            return (
              <div key={step.num} className={`hiw__step ${isEven ? "hiw__step--reverse" : ""}`}>
                <div className="hiw__step-visual">
                  <div className="hiw__step-num-wrap">
                    <div className="hiw__step-icon">
                      <Icon size={26} />
                    </div>
                    <div className="hiw__step-num">{step.num}</div>
                  </div>
                </div>
                <div className="hiw__step-content">
                  <h2 className="hiw__step-title">{step.title}</h2>
                  <p className="hiw__step-desc">{step.desc}</p>
                  <ul className="hiw__step-details">
                    {step.details.map((d) => (
                      <li key={d} className="hiw__step-detail-item">
                        <span className="hiw__step-detail-dot" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="hiw__faq">
        <div className="hiw__inner">
          <div className="hiw__section-header">
            <p className="hiw__section-tag">
              <HelpCircle size={13} />
              Common Questions
            </p>
            <h2 className="hiw__section-heading">Frequently Asked Questions</h2>
          </div>
          <div className="hiw__faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`hiw__faq-item ${openFaq === i ? "hiw__faq-item--open" : ""}`}>
                <button className="hiw__faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div className="hiw__faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hiw__cta">
        <div className="hiw__inner hiw__cta-inner">
          <h2 className="hiw__cta-heading">Ready to Apply?</h2>
          <p className="hiw__cta-sub">Create your free account and start your application today.</p>
          <div className="hiw__cta-actions">
            <Link to="/register" className="hiw__btn-primary">
              Get Started <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="hiw__btn-ghost">
              Have a Question?
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}