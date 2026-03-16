import { useNavigate } from "react-router-dom";
import { loanService } from "../../../app/api";
import { useFetch } from "../../../hooks/useFetch";
import { StatCard, Badge, PageLoader, Card } from "../../../components/ui/UI";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import "./OfficerDashboard.css";

export default function OfficerDashboard() {
  const { data: stats, loading } = useFetch(loanService.getStats);
  const { data: pending }        = useFetch(() => loanService.getPending({ limit: 5 }));
  const navigate = useNavigate();

  if (loading) return <PageLoader />;

  const statusMap = {};
  stats?.byStatus?.forEach((s) => { statusMap[s._id] = s; });

  return (
    <div className="ofd">

      {/* ── Hero ── */}
      <div className="ofd__hero">
        <div className="ofd__hero-text">
          <p className="ofd__eyebrow">Loan Operations</p>
          <h1 className="ofd__title">Officer Dashboard</h1>
          <p className="ofd__subtitle">
            Review pending applications and manage loan decisions.
          </p>
        </div>
        <div className="ofd__hero-deco" aria-hidden="true">
          <div className="ofd__hero-ring ofd__hero-ring--1" />
          <div className="ofd__hero-ring ofd__hero-ring--2" />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="ofd__stats">
        <StatCard label="Total Loans" value={stats?.totalLoans ?? "—"}           icon={FileText}    color="blue" />
        <StatCard label="Pending"     value={statusMap["pending"]?.count ?? 0}   icon={Clock}       color="amber" />
        <StatCard label="Approved"    value={statusMap["approved"]?.count ?? 0}  icon={CheckCircle} color="emerald" />
        <StatCard label="Rejected"    value={statusMap["rejected"]?.count ?? 0}  icon={XCircle}     color="red" />
      </div>

      {/* ── Pending applications ── */}
      <Card>
        <div className="ofd__card-header">
          <div>
            <p className="ofd__card-eyebrow">Action Required</p>
            <h4 className="ofd__card-title">Pending Applications</h4>
            <p className="ofd__card-sub">Awaiting your review and decision</p>
          </div>
          <button className="ofd__link-btn" onClick={() => navigate("/pending-loans")}>
            View all →
          </button>
        </div>

        <div className="ofd__loan-list">
          {pending?.loans?.length ? (
            pending.loans.map((l, idx) => (
              <div
                key={l._id}
                className="ofd__loan-row"
                onClick={() => navigate(`/loans/${l._id}`)}
              >
                <div className="ofd__loan-index">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="ofd__loan-info">
                  <p className="ofd__loan-number">{l.loanNumber}</p>
                  <p className="ofd__loan-meta">
                    {l.applicant?.name}
                    <span className="ofd__loan-sep">·</span>
                    {l.loanType}
                  </p>
                </div>
                <div className="ofd__loan-right">
                  <p className="ofd__loan-amount">Rs {l.amountRequested?.toLocaleString()}</p>
                  <Badge status={l.status} />
                </div>
                <span className="ofd__loan-arrow">→</span>
              </div>
            ))
          ) : (
            <div className="ofd__empty">
              <p className="ofd__empty-text">No pending applications</p>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
