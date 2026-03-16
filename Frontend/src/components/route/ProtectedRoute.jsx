import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ProtectedRoute.css";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="pr-loading">
        <div className="pr-loading__inner">
          <div className="pr-loading__spinner" />
          <span className="pr-loading__label">Loading</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}