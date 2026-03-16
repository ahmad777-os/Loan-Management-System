import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import "./PublicNav.css";

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/loan-programs", label: "Loan Programs" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`pnav ${scrolled ? "pnav--scrolled" : ""}`}>
      <div className="pnav__inner">
        <Link to="/" className="pnav__brand">
          <div className="pnav__brand-icon">
            <Building2 size={18} />
          </div>
          <div>
            <span className="pnav__brand-name">Akhuwat</span>
            <span className="pnav__brand-tag">Interest Free Loans</span>
          </div>
        </Link>

        <div className="pnav__links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`pnav__link ${location.pathname === l.to ? "pnav__link--active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="pnav__actions">
          <Link to="/login" className="pnav__btn-ghost">Sign In</Link>
          <Link to="/register" className="pnav__btn-solid">Apply Now</Link>
        </div>

        <button className="pnav__hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="pnav__mobile">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`pnav__mobile-link ${location.pathname === l.to ? "pnav__mobile-link--active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pnav__mobile-actions">
            <Link to="/login" className="pnav__btn-ghost">Sign In</Link>
            <Link to="/register" className="pnav__btn-solid">Apply Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
}