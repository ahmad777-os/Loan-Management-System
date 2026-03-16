import { installmentService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { PageLoader, EmptyState } from "../../components/ui/UI";
import "./Overdue.css";

export default function Overdue() {
  const { data, loading } = useFetch(installmentService.getOverdue);

  return (
    <div className="overdue-root">
      <div className="overdue-header">
        <h1 className="overdue-title">Overdue Installments</h1>
        <div className="overdue-subtitle">
          <span>{data?.count ?? 0} overdue installments</span>
          {data?.count > 0 && (
            <span className="overdue-count-chip">Requires Follow-up</span>
          )}
        </div>
      </div>

      {data?.count > 0 && (
        <div className="overdue-alert">
          <div className="overdue-alert-bar" />
          <p className="overdue-alert-text">
            {data.count} installment{data.count > 1 ? "s are" : " is"} overdue and require immediate follow-up.
          </p>
        </div>
      )}

      <div className="overdue-card">
        {loading ? (
          <PageLoader />
        ) : data?.installments?.length ? (
          <table className="overdue-table">
            <thead>
              <tr>
                {["Loan #", "Applicant", "Installment #", "Due Date", "Amount", "Days Overdue"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.installments.map((inst) => {
                const daysOverdue = Math.floor(
                  (new Date() - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={inst._id}>
                    <td><span className="overdue-loan-num">{inst.loan?.loanNumber || "—"}</span></td>
                    <td><span className="overdue-applicant">{inst.applicant?.name || "—"}</span></td>
                    <td>#{inst.installmentNumber}</td>
                    <td>{new Date(inst.dueDate).toLocaleDateString("en-PK")}</td>
                    <td><span className="overdue-amount">Rs {inst.amount?.toLocaleString()}</span></td>
                    <td><span className="overdue-days-chip">{daysOverdue}d</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No overdue installments" />
        )}
      </div>
    </div>
  );
}
