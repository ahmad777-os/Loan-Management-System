import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact">
      <PublicNav />

      <section className="contact__hero">
        <div className="contact__hero-inner">
          <p className="contact__hero-tag">We're Here to Help</p>
          <h1 className="contact__hero-heading">Get in <span>Touch</span></h1>
          <p className="contact__hero-desc">Have a question about loans, eligibility, or your application? Reach out and we'll respond promptly.</p>
        </div>
      </section>

      <section className="contact__main">
        <div className="contact__inner">
          <div className="contact__grid">
            <div className="contact__info">
              <h2 className="contact__info-heading">Contact Information</h2>
              <p className="contact__info-desc">Reach us through any of the channels below, or fill in the form and we'll get back to you within 1 business day.</p>

              <div className="contact__info-items">
                <div className="contact__info-item">
                  <div className="contact__info-icon"><Mail size={18} /></div>
                  <div>
                    <strong>Email</strong>
                    <p>info@akhuwat.org.pk</p>
                  </div>
                </div>
                <div className="contact__info-item">
                  <div className="contact__info-icon"><Phone size={18} /></div>
                  <div>
                    <strong>Phone</strong>
                    <p>+92 42 3578 5101</p>
                  </div>
                </div>
                <div className="contact__info-item">
                  <div className="contact__info-icon"><MapPin size={18} /></div>
                  <div>
                    <strong>Head Office</strong>
                    <p>23-L Model Town, Lahore, Pakistan</p>
                  </div>
                </div>
                <div className="contact__info-item">
                  <div className="contact__info-icon"><Clock size={18} /></div>
                  <div>
                    <strong>Office Hours</strong>
                    <p>Mon–Fri: 9:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact__form-wrap">
              {sent ? (
                <div className="contact__success">
                  <CheckCircle2 size={48} />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will respond within 1 business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact__form">
                  <h3 className="contact__form-heading">Send Us a Message</h3>
                  <div className="contact__form-row">
                    <div className="contact__field">
                      <label>Full Name</label>
                      <input type="text" placeholder="Muhammad Ali" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="contact__field">
                      <label>Email</label>
                      <input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="contact__form-row">
                    <div className="contact__field">
                      <label>Phone (optional)</label>
                      <input type="tel" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="contact__field">
                      <label>Subject</label>
                      <input type="text" placeholder="Loan inquiry" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                    </div>
                  </div>
                  <div className="contact__field">
                    <label>Message</label>
                    <textarea rows={5} placeholder="Tell us how we can help you..." required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="contact__submit">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}