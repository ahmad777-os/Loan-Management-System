import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { PageLoader, EmptyState, Pagination } from "../../components/ui/UI";
import "./PendingLoans.css";

export default function PendingLoans() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(() => loanService.getPending({ page, limit: 20 }), [page]);

  return (
    <div className="pending-root">
      <div className="pending-header">
        <h1 className="pending-title">Pending Applications</h1>
        <p className="pending-subtitle">{data?.pagination?.total ?? 0} awaiting review</p>
      </div>

      <div className="pending-card">
        {loading ? (
          <PageLoader />
        ) : data?.loans?.length ? (
          <>
            <table className="pending-table">
              <thead>
                <tr>
                  {["Loan #", "Applicant", "Type", "Amount", "Elig. Score", "Loan Limit", "DTI", "Date"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.loans.map((l) => (
                  <tr key={l._id} onClick={() => navigate(`/loans/${l._id}`)}>
                    <td><span className="pending-loan-num">{l.loanNumber}</span></td>
                    <td><span className="pending-applicant">{l.applicant?.name || "—"}</span></td>
                    <td>{l.loanType}</td>
                    <td><span className="pending-amount">Rs {l.amountRequested?.toLocaleString()}</span></td>
                    <td>
                      <span className={`pending-score${l.eligibilityScore == null ? " pending-score--null" : ""}`}>
                        {l.eligibilityScore ?? "—"}
                      </span>
                    </td>
                    <td>{l.loanLimit ? `Rs ${l.loanLimit.toLocaleString()}` : "—"}</td>
                    <td>
                      <span className="pending-dti">
                        {l.dti != null ? `${(l.dti * 100).toFixed(1)}%` : "—"}
                      </span>
                    </td>
                    <td>{new Date(l.createdAt).toLocaleDateString("en-PK")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        ) : (
          <EmptyState message="No pending applications" />
        )}
      </div>
    </div>
  );
}
