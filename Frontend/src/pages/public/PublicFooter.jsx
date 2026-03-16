import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import "./PublicFooter.css";

export default function PublicFooter() {
  return (
    <footer className="pfooter">
      <div className="pfooter__inner">
        <div className="pfooter__top">
          <div className="pfooter__col pfooter__col--brand">
            <div className="pfooter__brand">
              <div className="pfooter__brand-icon">
                <Building2 size={20} />
              </div>
              <div>
                <span className="pfooter__brand-name">Akhuwat</span>
                <span className="pfooter__brand-tag">Loan Management System</span>
              </div>
            </div>
            <p className="pfooter__brand-desc">
              Empowering communities through interest-free microfinance. Building a future where financial dignity is accessible to all.
            </p>
          </div>

          <div className="pfooter__col">
            <h4 className="pfooter__col-heading">Quick Links</h4>
            <Link to="/" className="pfooter__link">Home</Link>
            <Link to="/about" className="pfooter__link">About Us</Link>
            <Link to="/loan-programs" className="pfooter__link">Loan Programs</Link>
            <Link to="/how-it-works" className="pfooter__link">How It Works</Link>
            <Link to="/contact" className="pfooter__link">Contact</Link>
          </div>

          <div className="pfooter__col">
            <h4 className="pfooter__col-heading">For Applicants</h4>
            <Link to="/register" className="pfooter__link">Create Account</Link>
            <Link to="/login" className="pfooter__link">Sign In</Link>
            <Link to="/loan-programs" className="pfooter__link">View Programs</Link>
            <Link to="/how-it-works" className="pfooter__link">Application Guide</Link>
          </div>

          <div className="pfooter__col">
            <h4 className="pfooter__col-heading">Contact Us</h4>
            <div className="pfooter__contact-item">
              <Mail size={14} />
              <span>info@akhuwat.org.pk</span>
            </div>
            <div className="pfooter__contact-item">
              <Phone size={14} />
              <span>+92 42 3578 5101</span>
            </div>
            <div className="pfooter__contact-item">
              <MapPin size={14} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>
        </div>

        <div className="pfooter__bottom">
          <p className="pfooter__copy">
            &copy; {new Date().getFullYear()} Akhuwat Loan Management System. All rights reserved.
          </p>
          <p className="pfooter__note">Interest-free financing for a dignified life.</p>
        </div>
      </div>
    </footer>
  );
}