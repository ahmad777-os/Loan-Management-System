import { useState } from "react";
import { adminService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { PageLoader, EmptyState, Alert, Badge } from "../../components/ui/UI";
import { Plus, X } from "lucide-react";
import "./Officers.css";

export default function Officers() {
  const { data, loading, refetch } = useFetch(adminService.getOfficers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await adminService.createOfficer(form);
      setCredentials(res.data.credentials);
      setForm({ name: "", email: "" });
      setShowForm(false);
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create officer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    setActionError("");
    try {
      await adminService.toggleUserStatus(id, { action: isActive ? "deactivate" : "activate" });
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="officers-root">
      <div className="officers-header">
        <div>
          <h1 className="officers-title">Officers</h1>
          <p className="officers-subtitle">{data?.length ?? 0} loan officers</p>
        </div>
        <button
          className={`officers-add-btn${showForm ? " officers-add-btn--cancel" : ""}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add Officer"}
        </button>
      </div>

      <Alert type="error" message={actionError} />

      {credentials && (
        <div className="officers-credentials-banner">
          <div className="officers-credentials-top">
            <span className="officers-credentials-label">Officer Created — Save Credentials</span>
            <button className="officers-credentials-close" onClick={() => setCredentials(null)}>
              <X size={15} />
            </button>
          </div>
          <div className="officers-credentials-grid">
            <div className="officers-cred-item">
              <div className="officers-cred-key">Email</div>
              <div className="officers-cred-value">{credentials.email}</div>
            </div>
            <div className="officers-cred-item">
              <div className="officers-cred-key">Password</div>
              <div className="officers-cred-value">{credentials.password}</div>
            </div>
          </div>
          <div className="officers-credentials-warning">
            Share these credentials securely. This will not be shown again.
          </div>
        </div>
      )}

      {showForm && (
        <div className="officers-form-card">
          <div className="officers-form-title">Create New Officer</div>
          <form onSubmit={handleCreate}>
            <Alert type="error" message={error} />
            <div className="officers-form-grid">
              <div className="officers-field">
                <label className="officers-label">Name</label>
                <input
                  className="officers-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Officer Name"
                  required
                />
              </div>
              <div className="officers-field">
                <label className="officers-label">Email (optional — auto-generated if empty)</label>
                <input
                  className="officers-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="officer@akhuwat.org"
                />
              </div>
            </div>
            <button type="submit" className="officers-submit-btn" disabled={submitting}>
              {submitting && <div className="officers-spinner" />}
              Create Officer
            </button>
          </form>
        </div>
      )}

      <div className="officers-card">
        {loading ? (
          <PageLoader />
        ) : data?.length ? (
          <table className="officers-table">
            <thead>
              <tr>
                {["Name", "Email", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o._id}>
                  <td><span className="officers-name">{o.name}</span></td>
                  <td><span className="officers-email">{o.email}</span></td>
                  <td><Badge status={o.isActive ? "active" : "inactive"} /></td>
                  <td>{o.lastLogin ? new Date(o.lastLogin).toLocaleDateString("en-PK") : "Never"}</td>
                  <td>
                    <button
                      className={`officers-toggle-btn ${o.isActive ? "officers-toggle-btn--deactivate" : "officers-toggle-btn--activate"}`}
                      onClick={() => handleToggle(o._id, o.isActive)}
                    >
                      {o.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No officers found. Create your first officer." />
        )}
      </div>
    </div>
  );
}
