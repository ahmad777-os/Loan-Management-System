import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../app/api";
import { Card, Button, Alert, Input, Select, Textarea } from "../../components/ui/UI";
import "./ApplyLoan.css";

const LOAN_TYPES = ["personal", "business", "education", "housing", "agriculture", "other"];

export default function ApplyLoan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loanType: "",
    amountRequested: "",
    tenureMonths: "12",
    purpose: "",
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await loanService.apply({
        ...form,
        amountRequested: Number(form.amountRequested),
        tenureMonths:    Number(form.tenureMonths),
      });
      setSuccess(`Loan application ${res.data.loan.loanNumber} submitted successfully!`);
      setTimeout(() => navigate("/my-loans"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apl-page">

      {/* ── Page Header ── */}
      <div className="apl-header">
        <p className="apl-header__eyebrow">New Application</p>
        <h1 className="apl-header__title">Apply for a Loan</h1>
        <p className="apl-header__subtitle">
          Fill in the details below to submit your interest-free loan application.
        </p>
      </div>

      <div className="apl-divider" />

      {/* ── Form Card ── */}
      <div className="apl-layout">
        <Card>
          <form className="apl-form" onSubmit={handleSubmit}>

            <Alert type="error"   message={error} />
            <Alert type="success" message={success} />

            {/* Loan Type */}
            <div className="apl-field">
              <Select
                label="Loan Type"
                value={form.loanType}
                onChange={set("loanType")}
                required
              >
                <option value="">Select loan type</option>
                {LOAN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Amount & Tenure */}
            <div className="apl-row">
              <div className="apl-field">
                <label className="apl-label">Amount (Rs)</label>
                <input
                  className="apl-input"
                  type="number"
                  value={form.amountRequested}
                  onChange={set("amountRequested")}
                  placeholder="10,000"
                  min="1000"
                  max="5000000"
                  required
                />
                <p className="apl-hint">Min: Rs 1,000 · Max: Rs 50,00,000</p>
              </div>

              <div className="apl-field">
                <label className="apl-label">Tenure (months)</label>
                <input
                  className="apl-input"
                  type="number"
                  value={form.tenureMonths}
                  onChange={set("tenureMonths")}
                  placeholder="12"
                  min="1"
                  max="120"
                  required
                />
                <p className="apl-hint">1–120 months</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="apl-field">
              <label className="apl-label">Purpose</label>
              <textarea
                className="apl-textarea"
                value={form.purpose}
                onChange={set("purpose")}
                placeholder="Describe how you will use the loan (minimum 10 characters)…"
                rows={4}
                minLength={10}
                maxLength={500}
                required
              />
              <p className="apl-hint apl-hint--right">{form.purpose.length}/500</p>
            </div>

            {/* Info Banner */}
            <div className="apl-info-banner">
              <div className="apl-info-banner__icon">0%</div>
              <div>
                <p className="apl-info-banner__title">Interest-Free Loan</p>
                <p className="apl-info-banner__body">
                  Akhuwat provides 0% interest loans. You repay only the principal amount
                  in equal monthly installments.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="apl-actions">
              <button
                type="button"
                className="apl-btn apl-btn--ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="apl-btn apl-btn--primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="apl-spinner" />
                ) : "Submit Application"}
              </button>
            </div>

          </form>
        </Card>

        {/* ── Side Guide ── */}
        <aside className="apl-guide">
          <p className="apl-guide__heading">Before you apply</p>
          <ul className="apl-guide__list">
            <li>Have your CNIC and income documents ready</li>
            <li>Ensure your profile information is up to date</li>
            <li>Applications are reviewed within 3–5 working days</li>
            <li>You will be notified at every stage of the process</li>
          </ul>
          <div className="apl-guide__divider" />
          <p className="apl-guide__quote">
            "Empowering communities through dignified, interest-free financing."
          </p>
        </aside>
      </div>
    </div>
  );
}
