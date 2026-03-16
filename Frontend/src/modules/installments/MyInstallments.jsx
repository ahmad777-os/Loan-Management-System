import { useNavigate } from "react-router-dom";
import { installmentService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { Badge, PageLoader, EmptyState } from "../../components/ui/UI";
import "./MyInstallments.css";

export default function MyInstallments() {
  const navigate = useNavigate();
  const { data, loading } = useFetch(installmentService.getMy);

  if (loading) return <PageLoader />;

  const installments = data?.installments || [];
  const overdue = installments.filter((i) => !i.paid && new Date(i.dueDate) < new Date());

  return (
    <div className="myinstall-root">
      <div className="myinstall-header">
        <h1 className="myinstall-title">My Installments</h1>
        <div className="myinstall-subtitle">
          <span>{installments.length} total</span>
          {overdue.length > 0 && (
            <span className="myinstall-overdue-badge">{overdue.length} overdue</span>
          )}
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="myinstall-alert">
          <div className="myinstall-alert-dot" />
          <p className="myinstall-alert-text">
            You have {overdue.length} overdue installment{overdue.length > 1 ? "s" : ""}. Please contact your branch office immediately.
          </p>
        </div>
      )}

      <div className="myinstall-card">
        {installments.length ? (
          <table className="myinstall-table">
            <thead>
              <tr>
                {["Loan", "Installment #", "Due Date", "Amount", "Status", "Paid On"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {installments.map((inst) => {
                const isOverdue = !inst.paid && new Date(inst.dueDate) < new Date();
                return (
                  <tr key={inst._id} onClick={() => navigate(`/loans/${inst.loan?._id}`)}>
                    <td><span className="myinstall-loan-link">{inst.loan?.loanNumber}</span></td>
                    <td>#{inst.installmentNumber}</td>
                    <td>
                      {new Date(inst.dueDate).toLocaleDateString("en-PK")}
                      {isOverdue && <span className="myinstall-overdue-tag">Overdue</span>}
                    </td>
                    <td><span className="myinstall-amount">Rs {inst.amount?.toLocaleString()}</span></td>
                    <td>
                      <Badge status={inst.paid ? "approved" : isOverdue ? "rejected" : "pending"} />
                    </td>
                    <td className="myinstall-muted">
                      {inst.paidAt ? new Date(inst.paidAt).toLocaleDateString("en-PK") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No installments yet. Installments will appear after loan approval." />
        )}
      </div>
    </div>
  );
}
