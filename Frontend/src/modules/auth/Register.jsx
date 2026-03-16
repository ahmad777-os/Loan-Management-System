import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../app/api";
import { Building2, Eye, EyeOff, CheckCircle, Circle } from "lucide-react";
import "./Register.css";

const checks = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character (@#$!%&*^())", test: (p) => /[@#$!%&*^()]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChecks, setShowChecks] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authService.register(form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <div className="register-brand">
          <div className="register-brand-icon">
            <Building2 size={16} />
          </div>
          <span className="register-brand-name">Akhuwat LMS</span>
        </div>

        <h2 className="register-heading">Create account</h2>
        <p className="register-subheading">Join Akhuwat to access interest-free financing</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="register-alert-error">{error}</div>}
          {success && <div className="register-alert-success">{success}</div>}

          <div className="register-field">
            <label className="register-label">Full Name</label>
            <input
              className="register-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Muhammad Ali"
              required
            />
          </div>

          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              className="register-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <div className="register-pw-wrap">
              <input
                className="register-input"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setShowChecks(true)}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {showChecks && form.password && (
              <div className="register-checks">
                {checks.map((c) => {
                  const ok = c.test(form.password);
                  return (
                    <div
                      key={c.label}
                      className={`register-check-item ${ok ? "register-check-item--pass" : "register-check-item--fail"}`}
                    >
                      <span className="register-check-icon">
                        {ok ? <CheckCircle size={12} /> : <Circle size={12} />}
                      </span>
                      {c.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading && <div className="register-spinner" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="register-footer-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
