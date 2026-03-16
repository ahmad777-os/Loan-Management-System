import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";
import "./Unauthorized.css";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="unauth-root">
      <div className="unauth-card">
        <div className="unauth-icon-wrap">
          <ShieldX size={30} />
        </div>
        <h1 className="unauth-title">Access Denied</h1>
        <p className="unauth-desc">You don&apos;t have permission to view this page.</p>
        <button className="unauth-btn" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
