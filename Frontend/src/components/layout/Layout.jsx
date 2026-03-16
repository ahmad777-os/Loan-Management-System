import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../app/api";
import {
  LayoutDashboard, FileText, Users, Bell, LogOut,
  Menu, X, CreditCard, Settings,
  ShieldCheck, ClipboardList, TrendingUp, Building2
} from "lucide-react";
import "./Layout.css";

const navByRole = {
  applicant: [
    { to: "/dashboard",        label: "Dashboard",    icon: LayoutDashboard },
    { to: "/apply-loan",       label: "Apply for Loan", icon: FileText },
    { to: "/my-installments",  label: "Installments", icon: TrendingUp },
    { to: "/profile",          label: "Profile",      icon: Settings },
  ],
  officer: [
    { to: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { to: "/pending-loans", label: "Pending Loans", icon: ClipboardList },
    { to: "/all-loans",     label: "All Loans",    icon: FileText },
    { to: "/applicants",    label: "Applicants",   icon: Users },
    { to: "/overdue",       label: "Overdue",      icon: TrendingUp },
  ],
  admin: [
    { to: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
    { to: "/all-loans",  label: "All Loans",  icon: FileText },
    { to: "/applicants", label: "Applicants", icon: Users },
    { to: "/officers",   label: "Officers",   icon: ShieldCheck },
    { to: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
    { to: "/overdue",    label: "Overdue",    icon: TrendingUp },
  ],
};

export default function Layout({ children }) {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread]           = useState(0);

  useEffect(() => {
    notificationService.getAll({ unread: "true" })
      .then((res) => setUnread(res.data.unreadCount || 0))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const links = navByRole[user?.role] || [];

  return (
    <div className="layout">

      <aside className={`layout__sidebar ${sidebarOpen ? "layout__sidebar--open" : ""}`}>

        <div className="layout__brand">
          <div className="layout__brand-icon">
            <Building2 size={16} />
          </div>
          <div className="layout__brand-text">
            <p className="layout__brand-name">Akhuwat LMS</p>
            <p className="layout__brand-role">{user?.role}</p>
          </div>
        </div>

        <div className="layout__divider" />

        <nav className="layout__nav">
          <p className="layout__nav-label">Navigation</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `layout__nav-link ${isActive ? "layout__nav-link--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} className="layout__nav-icon" />
              <span className="layout__nav-text">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="layout__sidebar-spacer" />

        <div className="layout__divider" />

        <div className="layout__sidebar-footer">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `layout__nav-link ${isActive ? "layout__nav-link--active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Bell size={16} className="layout__nav-icon" />
            <span className="layout__nav-text">Notifications</span>
            {unread > 0 && (
              <span className="layout__badge">{unread}</span>
            )}
          </NavLink>

          <button className="layout__signout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="layout__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="layout__body">

        <header className="layout__header">
          <button
            className="layout__menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="layout__header-spacer" />

          <div className="layout__header-user">
            <div className="layout__user-info">
              <p className="layout__user-name">{user?.name}</p>
              <p className="layout__user-email">{user?.email}</p>
            </div>
            <div className="layout__avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="layout__main">
          {children}
        </main>
      </div>
    </div>
  );
}