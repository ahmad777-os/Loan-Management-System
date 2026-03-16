import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { Card, Badge, PageLoader, EmptyState, Pagination, Table } from "../../components/ui/UI";
import "./AllLoans.css";

const STATUSES = ["", "pending", "under_review", "eligible", "approved", "rejected", "disbursed", "closed"];
const TYPES    = ["", "personal", "business", "education", "housing", "agriculture", "other"];

export default function AllLoans() {
  const navigate  = useNavigate();
  const [page, setPage]           = useState(1);
  const [status, setStatus]       = useState("");
  const [loanType, setLoanType]   = useState("");

  const { data, loading } = useFetch(
    () => loanService.getAll({ page, limit: 20, status: status || undefined, loanType: loanType || undefined }),
    [page, status, loanType]
  );

  return (
    <div className="al-page">

      {/* ── Page Header ── */}
      <div className="al-header">
        <div className="al-header__text">
          <p className="al-header__eyebrow">Loan Management</p>
          <h1 className="al-header__title">All Loans</h1>
          <p className="al-header__meta">
            <span className="al-count">{data?.pagination?.total ?? 0}</span> total records
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="al-filters">
          <div className="al-filter-group">
            <label className="al-filter-label">Status</label>
            <div className="al-select-wrap">
              <select
                className="al-select"
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s ? s.replace(/_/g, " ") : "All Statuses"}
                  </option>
                ))}
              </select>
              <span className="al-select-arrow">&#8964;</span>
            </div>
          </div>

          <div className="al-filter-group">
            <label className="al-filter-label">Type</label>
            <div className="al-select-wrap">
              <select
                className="al-select"
                value={loanType}
                onChange={(e) => { setLoanType(e.target.value); setPage(1); }}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t ? t : "All Types"}</option>
                ))}
              </select>
              <span className="al-select-arrow">&#8964;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="al-divider" />

      {/* ── Table Card ── */}
      <Card>
        {loading ? (
          <PageLoader />
        ) : data?.loans?.length ? (
          <>
            <div className="al-table-wrap">
              <Table headers={["Loan #", "Applicant", "Type", "Amount", "Score", "Status", "Date"]}>
                {data.loans.map((l) => (
                  <tr
                    key={l._id}
                    className="al-row"
                    onClick={() => navigate(`/loans/${l._id}`)}
                  >
                    <td className="al-td al-td--mono">{l.loanNumber}</td>
                    <td className="al-td al-td--name">{l.applicant?.name || "—"}</td>
                    <td className="al-td">
                      <span className="al-type-tag">{l.loanType}</span>
                    </td>
                    <td className="al-td al-td--amount">
                      <span className="al-currency">Rs</span>
                      {l.amountRequested?.toLocaleString()}
                    </td>
                    <td className="al-td">
                      {l.eligibilityScore != null ? (
                        <span className="al-score">
                          <span className="al-score__val">{l.eligibilityScore}</span>
                          <span className="al-score__total">/100</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="al-td"><Badge status={l.status} /></td>
                    <td className="al-td al-td--date">
                      {new Date(l.createdAt).toLocaleDateString("en-PK")}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        ) : (
          <EmptyState message="No loans found" />
        )}
      </Card>
    </div>
  );
}
