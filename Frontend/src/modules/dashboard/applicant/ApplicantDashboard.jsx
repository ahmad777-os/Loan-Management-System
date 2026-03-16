import { useNavigate } from "react-router-dom";
import { loanService, installmentService } from "../../../app/api";
import { useFetch } from "../../../hooks/useFetch";
import { StatCard, Badge, PageLoader, Card } from "../../../components/ui/UI";
import { FileText, CreditCard, TrendingUp, Plus } from "lucide-react";
import "./ApplicantDashboard.css";

export default function ApplicantDashboard() {
  const { data: loansData, loading } = useFetch(() => loanService.getMyLoans({ limit: 3 }));
  const { data: installments }       = useFetch(installmentService.getMy);
  const navigate = useNavigate();

  if (loading) return <PageLoader />;

  const overdue = installments?.installments?.filter(
    (i) => !i.paid && new Date(i.dueDate) < new Date()
  ).length || 0;

  const activeLoans = loansData?.loans?.filter((l) =>
    ["pending", "under_review", "eligible", "approved"].includes(l.status)
  ).length || 0;

  return (
    <div className="apd">

      {/* ── Hero ── */}
      <div className="apd__hero">
        <div className="apd__hero-text">
          <p className="apd__eyebrow">My Portal</p>
          <h1 className="apd__title">My Dashboard</h1>
          <p className="apd__subtitle">
            Track your loan applications and repayments at a glance.
          </p>
        </div>
        <button
          className="apd__apply-btn"
          onClick={() => navigate("/apply-loan")}
        >
          <Plus size={14} />
          Apply for Loan
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="apd__stats">
        <StatCard label="Active Loans"        value={activeLoans}                    icon={FileText}   color="blue" />
        <StatCard label="Total Applications"  value={loansData?.pagination?.total ?? 0} icon={CreditCard} color="emerald" />
        <StatCard
          label="Overdue Installments"
          value={overdue}
          icon={TrendingUp}
          color={overdue > 0 ? "red" : "sage"}
        />
      </div>

      {/* ── Recent applications ── */}
      <Card>
        <div className="apd__card-header">
          <div>
            <p className="apd__card-eyebrow">History</p>
            <h4 className="apd__card-title">Recent Applications</h4>
          </div>
          <button className="apd__link-btn" onClick={() => navigate("/my-loans")}>
            View all →
          </button>
        </div>

        <div className="apd__loan-list">
          {loansData?.loans?.length ? (
            loansData.loans.map((l) => (
              <div
                key={l._id}
                className="apd__loan-row"
                onClick={() => navigate(`/loans/${l._id}`)}
              >
                <div className="apd__loan-info">
                  <p className="apd__loan-number">{l.loanNumber}</p>
                  <p className="apd__loan-meta">
                    {l.loanType}
                    <span className="apd__loan-sep">·</span>
                    {l.tenureMonths} months
                  </p>
                </div>
                <div className="apd__loan-right">
                  <p className="apd__loan-amount">Rs {l.amountRequested?.toLocaleString()}</p>
                  <Badge status={l.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="apd__empty">
              <p className="apd__empty-text">No loan applications yet.</p>
              <button
                className="apd__apply-btn apd__apply-btn--inline"
                onClick={() => navigate("/apply-loan")}
              >
                <Plus size={13} />
                Apply Now
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Overdue alert ── */}
      {overdue > 0 && (
        <div className="apd__alert">
          <div className="apd__alert-dot" />
          <div className="apd__alert-body">
            <p className="apd__alert-title">Overdue Installments</p>
            <p className="apd__alert-desc">
              You have {overdue} overdue installment{overdue > 1 ? "s" : ""}. Please contact support or settle them promptly.
            </p>
          </div>
          <button
            className="apd__alert-cta"
            onClick={() => navigate("/my-installments")}
          >
            View →
          </button>
        </div>
      )}

    </div>
  );
}
