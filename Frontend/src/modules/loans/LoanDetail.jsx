import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loanService, installmentService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { Badge, PageLoader, Alert } from "../../components/ui/UI";
import { Download, ChevronLeft, CheckCircle } from "lucide-react";
import "./LoanDetail.css";

export default function LoanDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [officerComments, setOfficerComments] = useState("");
  const [showReject, setShowReject] = useState(false);

  const { data: loan, loading, refetch } = useFetch(() => loanService.getById(id), [id]);
  const { data: installData, refetch: refetchInstall } = useFetch(
    () => installmentService.getByLoan(id),
    [id]
  );

  const isOfficerOrAdmin = ["officer", "admin"].includes(user?.role);

  const handleEvaluate = async () => {
    setActionLoading(true);
    setActionError("");
    try {
      await loanService.evaluateEligibility(id);
      setActionSuccess("Eligibility evaluated successfully");
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Evaluation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatus = async (status) => {
    setActionLoading(true);
    setActionError("");
    try {
      await loanService.updateStatus(id, { status, officerComments });
      setActionSuccess(`Loan ${status} successfully`);
      setShowReject(false);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await loanService.downloadApprovalLetter(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${loan?.loanID}_ApprovalLetter.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setActionError("Failed to download approval letter");
    }
  };

  const handleMarkPaid = async (installId) => {
    setActionLoading(true);
    try {
      await installmentService.markPaid(installId);
      refetchInstall();
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to mark paid");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!loan) return <div>Loan not found</div>;

  const canEvaluate = isOfficerOrAdmin && ["pending", "under_review"].includes(loan.status);
  const canApproveReject = isOfficerOrAdmin && ["pending", "eligible", "under_review"].includes(loan.status);
  const canDownload = loan.status === "approved" && loan.approvalLetter;

  return (
    <div className="loandetail-root">
      <div className="loandetail-topbar">
        <button className="loandetail-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
        </button>
        <div className="loandetail-topbar-info">
          <div className="loandetail-loan-number">{loan.loanNumber}</div>
          <div className="loandetail-loan-id">{loan.loanID || "Pending ID"}</div>
        </div>
        <Badge status={loan.status} />
      </div>

      <Alert type="error" message={actionError} />
      <Alert type="success" message={actionSuccess} />

      <div className="loandetail-grid">
        <div className="loandetail-card">
          <div className="loandetail-card-title">Loan Details</div>
          <div className="loandetail-rows">
            {[
              { label: "Type", value: loan.loanType },
              { label: "Amount Requested", value: `Rs ${loan.amountRequested?.toLocaleString()}` },
              { label: "Loan Limit", value: loan.loanLimit ? `Rs ${loan.loanLimit?.toLocaleString()}` : "—" },
              { label: "Remaining Balance", value: `Rs ${loan.remainingBalance?.toLocaleString()}` },
              { label: "Tenure", value: `${loan.tenureMonths} months` },
              { label: "Interest Rate", value: `${loan.interestRate || 0}%` },
              { label: "Eligibility Score", value: loan.eligibilityScore != null ? `${loan.eligibilityScore}/100` : "—" },
              { label: "Applied", value: new Date(loan.createdAt).toLocaleDateString("en-PK") },
              { label: "Approved", value: loan.approvedAt ? new Date(loan.approvedAt).toLocaleDateString("en-PK") : "—" },
            ].map((r) => (
              <div className="loandetail-row" key={r.label}>
                <span className="loandetail-row-label">{r.label}</span>
                <span className="loandetail-row-value">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="loandetail-card">
          <div className="loandetail-card-title">Purpose & Comments</div>
          <div className="loandetail-purpose-block">
            <div className="loandetail-purpose-label">Purpose</div>
            <div className="loandetail-purpose-value">{loan.purpose}</div>
          </div>
          {loan.officerComments && (
            <div className="loandetail-purpose-block">
              <div className="loandetail-purpose-label">Officer Comments</div>
              <div className="loandetail-purpose-value">{loan.officerComments}</div>
            </div>
          )}
          {loan.approvedBy && (
            <div className="loandetail-purpose-block">
              <div className="loandetail-purpose-label">Reviewed By</div>
              <div className="loandetail-purpose-value">{loan.approvedBy?.name || "—"}</div>
            </div>
          )}
        </div>
      </div>

      {isOfficerOrAdmin && (
        <div className="loandetail-actions-card">
          <div className="loandetail-card-title">Actions</div>
          <div className="loandetail-action-buttons">
            {canEvaluate && (
              <button
                className="loandetail-btn loandetail-btn-primary"
                onClick={handleEvaluate}
                disabled={actionLoading}
              >
                Evaluate Eligibility
              </button>
            )}
            {canApproveReject && (
              <>
                <button
                  className="loandetail-btn loandetail-btn-primary"
                  onClick={() => handleStatus("approved")}
                  disabled={actionLoading}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button
                  className="loandetail-btn loandetail-btn-danger"
                  onClick={() => setShowReject(!showReject)}
                >
                  Reject
                </button>
              </>
            )}
            {canDownload && (
              <button
                className="loandetail-btn loandetail-btn-secondary"
                onClick={handleDownload}
              >
                <Download size={14} />
                Download Approval Letter
              </button>
            )}
          </div>

          {showReject && (
            <div className="loandetail-reject-panel">
              <label className="loandetail-reject-label">Rejection Reason (optional)</label>
              <textarea
                className="loandetail-reject-textarea"
                value={officerComments}
                onChange={(e) => setOfficerComments(e.target.value)}
                rows={3}
                placeholder="Provide reason for rejection..."
              />
              <button
                className="loandetail-btn loandetail-btn-danger"
                onClick={() => handleStatus("rejected")}
                disabled={actionLoading}
              >
                Confirm Rejection
              </button>
            </div>
          )}
        </div>
      )}

      {installData?.installments?.length > 0 && (
        <div className="loandetail-installments-card">
          <div className="loandetail-installments-header">
            <div className="loandetail-installments-title">Installment Schedule</div>
            <div className="loandetail-installments-meta">
              {installData.summary?.paid}/{installData.summary?.total} paid
              {installData.summary?.overdue > 0 && (
                <span>· {installData.summary.overdue} overdue</span>
              )}
            </div>
          </div>
          <table className="loandetail-table">
            <thead>
              <tr>
                {["#", "Due Date", "Amount", "Status", isOfficerOrAdmin && "Action"]
                  .filter(Boolean)
                  .map((h) => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {installData.installments.map((inst) => {
                const isOverdue = !inst.paid && new Date(inst.dueDate) < new Date();
                return (
                  <tr key={inst._id}>
                    <td>{inst.installmentNumber}</td>
                    <td>
                      {new Date(inst.dueDate).toLocaleDateString("en-PK")}
                      {isOverdue && <span className="loandetail-overdue-tag">Overdue</span>}
                    </td>
                    <td>Rs {inst.amount?.toLocaleString()}</td>
                    <td>
                      <Badge status={inst.paid ? "approved" : isOverdue ? "rejected" : "pending"} />
                    </td>
                    {isOfficerOrAdmin && (
                      <td>
                        {!inst.paid && (
                          <button
                            className="loandetail-mark-paid-btn"
                            onClick={() => handleMarkPaid(inst._id)}
                            disabled={actionLoading}
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
