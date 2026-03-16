import { useNavigate } from "react-router-dom";
import { adminService } from "../../../app/api";
import { useFetch } from "../../../hooks/useFetch";
import { StatCard, Badge, PageLoader, Card } from "../../../components/ui/UI";
import { Users, FileText, TrendingUp, DollarSign } from "lucide-react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { data, loading } = useFetch(adminService.getDashboard);
  const navigate = useNavigate();

  if (loading) return <PageLoader />;

  const statusMap = {};
  data?.loansByStatus?.forEach((s) => { statusMap[s._id] = s; });

  return (
    <div className="adm">

      {/* ── Hero ── */}
      <div className="adm__hero">
        <div className="adm__hero-text">
          <p className="adm__eyebrow">System Overview</p>
          <h1 className="adm__title">Admin Dashboard</h1>
          <p className="adm__subtitle">
            Monitor activity, manage users, and oversee all loan operations.
          </p>
        </div>
        <div className="adm__hero-ornament">
          <div className="adm__hero-ring adm__hero-ring--1" />
          <div className="adm__hero-ring adm__hero-ring--2" />
          <div className="adm__hero-ring adm__hero-ring--3" />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="adm__stats">
        <StatCard label="Total Users"    value={data?.totalUsers ?? "—"}  icon={Users}      color="blue" />
        <StatCard label="Total Loans"    value={data?.totalLoans ?? "—"}  icon={FileText}   color="emerald" />
        <StatCard label="Pending"        value={statusMap["pending"]?.count ?? 0} icon={TrendingUp} color="amber" />
        <StatCard
          label="Approved Amount"
          value={`Rs ${((statusMap["approved"]?.total || 0) / 1000).toFixed(0)}K`}
          icon={DollarSign}
          color="violet"
        />
      </div>

      {/* ── Two-column grid ── */}
      <div className="adm__grid">

        {/* Loans by status */}
        <Card>
          <div className="adm__card-header">
            <div>
              <p className="adm__card-eyebrow">Breakdown</p>
              <h4 className="adm__card-title">Loans by Status</h4>
            </div>
          </div>
          <div className="adm__status-list">
            {data?.loansByStatus?.length ? (
              data.loansByStatus.map((s) => (
                <div key={s._id} className="adm__status-row">
                  <Badge status={s._id} />
                  <div className="adm__status-meta">
                    <span className="adm__status-count">{s.count}</span>
                    <span className="adm__status-amount">
                      Rs {(s.total / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="adm__empty">No data available</p>
            )}
          </div>
        </Card>

        {/* Recent loans */}
        <Card>
          <div className="adm__card-header">
            <div>
              <p className="adm__card-eyebrow">Latest Activity</p>
              <h4 className="adm__card-title">Recent Loans</h4>
            </div>
            <button className="adm__link-btn" onClick={() => navigate("/all-loans")}>
              View all →
            </button>
          </div>
          <div className="adm__loan-list">
            {data?.recentLoans?.length ? (
              data.recentLoans.map((l) => (
                <div
                  key={l._id}
                  className="adm__loan-row"
                  onClick={() => navigate(`/loans/${l._id}`)}
                >
                  <div className="adm__loan-info">
                    <p className="adm__loan-number">{l.loanNumber}</p>
                    <p className="adm__loan-name">{l.applicant?.name}</p>
                  </div>
                  <div className="adm__loan-right">
                    <Badge status={l.status} />
                    <p className="adm__loan-amount">
                      Rs {l.amountRequested?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="adm__empty">No recent loans</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Quick actions ── */}
      <div className="adm__actions">
        {[
          { label: "Manage Officers", desc: "Create and manage loan officers",   to: "/officers" },
          { label: "View Audit Logs", desc: "Review system activity logs",        to: "/audit-logs" },
          { label: "Applicants",      desc: "View all registered applicants",     to: "/applicants" },
        ].map((a) => (
          <button key={a.to} className="adm__action-card" onClick={() => navigate(a.to)}>
            <p className="adm__action-label">{a.label}</p>
            <p className="adm__action-desc">{a.desc}</p>
            <span className="adm__action-arrow">→</span>
          </button>
        ))}
      </div>

    </div>
  );
}
