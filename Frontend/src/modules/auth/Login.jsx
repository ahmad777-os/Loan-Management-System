import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Building2, Eye, EyeOff } from "lucide-react";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-orb-1" />
        <div className="login-left-orb-2" />

        <div className="login-brand">
          <div className="login-brand-icon">
            <Building2 size={20} />
          </div>
          <div>
            <div className="login-brand-text-primary">Akhuwat</div>
            <div className="login-brand-text-secondary">Loan Management</div>
          </div>
        </div>

        <div className="login-hero">
          <h1 className="login-hero-heading">
            Empowering communities<br />
            <span>through microfinance</span>
          </h1>
          <p className="login-hero-desc">
            Interest-free loans for those who need it most. Manage your applications, track repayments, and build a better future.
          </p>
        </div>

        <div className="login-stats">
          {[
            { label: "Loans Disbursed", value: "50K+" },
            { label: "Interest Rate", value: "0%" },
            { label: "Cities Served", value: "200+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="login-stat-value">{s.value}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-brand">
            <div className="login-card-brand-dot">
              <Building2 size={16} />
            </div>
            <span className="login-card-brand-name">Akhuwat LMS</span>
          </div>

          <h2 className="login-heading">Welcome back</h2>
          <p className="login-subheading">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-password-wrap">
                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading && <div className="login-spinner" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="login-footer-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
