import { useState } from "react";
import { applicantService, authService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { Alert, PageLoader } from "../../components/ui/UI";
import "./Profile.css";

const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK", "ICT"];

export default function Profile() {
  const { user } = useAuth();
  const { data: applicant, loading, refetch } = useFetch(applicantService.getMyProfile);
  const [tab, setTab] = useState("profile");
  const [regForm, setRegForm] = useState({
    cnic: "", cnicIssueDate: "", cnicExpiryDate: "",
    cnicFront: "", cnicBack: "", phone: "", altPhone: "",
    address: "", city: "", province: "", occupation: "",
    monthlyIncome: "", dependents: "",
  });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading2, setLoading2] = useState(false);

  const setR = (k) => (e) => setRegForm({ ...regForm, [k]: e.target.value });
  const setPw = (k) => (e) => setPwForm({ ...pwForm, [k]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading2(true);
    try {
      await applicantService.register(regForm);
      setSuccess("Applicant profile created successfully!");
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading2(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading2(true);
    try {
      await authService.changePassword(pwForm);
      setSuccess("Password changed. Please log in again.");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading2(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="profile-root">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-tabs">
        {["profile", "security"].map((t) => (
          <button
            key={t}
            className={`profile-tab-btn${tab === t ? " profile-tab-btn--active" : ""}`}
            onClick={() => { setTab(t); setError(""); setSuccess(""); }}
          >
            {t}
          </button>
        ))}
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {tab === "profile" && (
        <>
          <div className="profile-card">
            <div className="profile-card-title">Account Info</div>
            <div className="profile-info-rows">
              {[
                { label: "Name", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "Role", value: user?.role },
              ].map((r) => (
                <div className="profile-info-row" key={r.label}>
                  <span className="profile-info-label">{r.label}</span>
                  <span className="profile-info-value">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {applicant ? (
            <div className="profile-card">
              <div className="profile-card-title">Applicant Profile</div>
              <div className="profile-info-rows">
                {[
                  { label: "Applicant ID", value: applicant.applicantID },
                  { label: "CNIC", value: applicant.cnic },
                  { label: "Phone", value: applicant.phone },
                  { label: "Alt Phone", value: applicant.altPhone || "—" },
                  { label: "City", value: applicant.city || "—" },
                  { label: "Province", value: applicant.province || "—" },
                  { label: "Occupation", value: applicant.occupation || "—" },
                  { label: "Monthly Income", value: applicant.monthlyIncome ? `Rs ${applicant.monthlyIncome?.toLocaleString()}` : "—" },
                  { label: "Dependents", value: applicant.dependents ?? "—" },
                ].map((r) => (
                  <div className="profile-info-row" key={r.label}>
                    <span className="profile-info-label">{r.label}</span>
                    <span className="profile-info-value">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="profile-address-block">
                <div className="profile-address-label">Address</div>
                <div className="profile-address-value">{applicant.address}</div>
              </div>
            </div>
          ) : user?.role === "applicant" ? (
            <div className="profile-card">
              <div className="profile-card-title">Complete Your Profile</div>
              <p className="profile-complete-desc">Register your applicant profile to apply for loans</p>
              <form onSubmit={handleRegister}>
                <div className="profile-form-grid-2">
                  <div className="profile-field">
                    <label className="profile-label">CNIC (13 digits)</label>
                    <input className="profile-input" value={regForm.cnic} onChange={setR("cnic")} placeholder="1234567890123" required />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Phone</label>
                    <input className="profile-input" value={regForm.phone} onChange={setR("phone")} placeholder="03001234567" required />
                  </div>
                </div>
                <div className="profile-form-grid-2">
                  <div className="profile-field">
                    <label className="profile-label">CNIC Issue Date</label>
                    <input className="profile-input" type="date" value={regForm.cnicIssueDate} onChange={setR("cnicIssueDate")} required />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">CNIC Expiry Date</label>
                    <input className="profile-input" type="date" value={regForm.cnicExpiryDate} onChange={setR("cnicExpiryDate")} required />
                  </div>
                </div>
                <div className="profile-form-grid-2">
                  <div className="profile-field">
                    <label className="profile-label">CNIC Front (URL)</label>
                    <input className="profile-input" value={regForm.cnicFront} onChange={setR("cnicFront")} placeholder="https://..." required />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">CNIC Back (URL)</label>
                    <input className="profile-input" value={regForm.cnicBack} onChange={setR("cnicBack")} placeholder="https://..." required />
                  </div>
                </div>
                <div className="profile-field profile-field-full">
                  <label className="profile-label">Alt Phone</label>
                  <input className="profile-input" value={regForm.altPhone} onChange={setR("altPhone")} placeholder="03001234567" />
                </div>
                <div className="profile-field profile-field-full">
                  <label className="profile-label">Address</label>
                  <textarea className="profile-textarea" value={regForm.address} onChange={setR("address")} rows={2} required placeholder="House #, Street, Area" />
                </div>
                <div className="profile-form-grid-2">
                  <div className="profile-field">
                    <label className="profile-label">City</label>
                    <input className="profile-input" value={regForm.city} onChange={setR("city")} placeholder="Lahore" />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Province</label>
                    <select className="profile-select" value={regForm.province} onChange={setR("province")}>
                      <option value="">Select Province</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="profile-form-grid-3">
                  <div className="profile-field">
                    <label className="profile-label">Occupation</label>
                    <input className="profile-input" value={regForm.occupation} onChange={setR("occupation")} placeholder="Teacher" />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Monthly Income (Rs)</label>
                    <input className="profile-input" type="number" value={regForm.monthlyIncome} onChange={setR("monthlyIncome")} placeholder="30000" />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Dependents</label>
                    <input className="profile-input" type="number" value={regForm.dependents} onChange={setR("dependents")} placeholder="2" />
                  </div>
                </div>
                <button type="submit" className="profile-submit-btn" disabled={loading2}>
                  {loading2 && <div className="profile-spinner" />}
                  Save Profile
                </button>
              </form>
            </div>
          ) : null}
        </>
      )}

      {tab === "security" && (
        <div className="profile-card">
          <div className="profile-card-title">Change Password</div>
          <p className="profile-pw-hint">
            Password must have 8+ characters, uppercase, lowercase, number, and special character (@#$!%&*^())
          </p>
          <form onSubmit={handlePasswordChange}>
            <div className="profile-field profile-field-full">
              <label className="profile-label">Current Password</label>
              <input className="profile-input" type="password" value={pwForm.currentPassword} onChange={setPw("currentPassword")} required autoComplete="current-password" />
            </div>
            <div className="profile-field profile-field-full">
              <label className="profile-label">New Password</label>
              <input className="profile-input" type="password" value={pwForm.newPassword} onChange={setPw("newPassword")} required autoComplete="new-password" />
            </div>
            <button type="submit" className="profile-submit-btn" disabled={loading2}>
              {loading2 && <div className="profile-spinner" />}
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
