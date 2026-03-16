import { Heart, Users, Globe, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import "./About.css";

const values = [
  {
    icon: Heart,
    title: "Brotherhood",
    desc: "Rooted in the Islamic principle of Qarz-e-Hasna — a beautiful loan given in the spirit of brotherhood, not profit.",
  },
  {
    icon: Users,
    title: "Inclusion",
    desc: "Every individual deserves financial dignity. We serve those overlooked by conventional banking systems.",
  },
  {
    icon: Globe,
    title: "Impact",
    desc: "Our model has been recognized globally as a transformative approach to poverty alleviation through microfinance.",
  },
  {
    icon: Award,
    title: "Trust",
    desc: "Built on decades of trust, transparent operations, and a repayment rate that rivals any financial institution.",
  },
];

const milestones = [
  { year: "2001", event: "Founded in Lahore with a single loan of PKR 10,000" },
  { year: "2004", event: "Expanded to 10 cities across Punjab" },
  { year: "2008", event: "Crossed 100,000 loan beneficiaries milestone" },
  { year: "2012", event: "Received international recognition for the interest-free model" },
  { year: "2016", event: "Surpassed PKR 50 billion in total loan disbursements" },
  { year: "2020", event: "Launched digital loan management platform" },
  { year: "2024", event: "500,000+ families served across 200+ cities" },
];

export default function About() {
  return (
    <div className="about">
      <PublicNav />

      <section className="about__hero">
        <div className="about__hero-inner">
          <p className="about__tag">Our Story</p>
          <h1 className="about__hero-heading">
            Empowering Lives Through<br />
            <span>Interest-Free Finance</span>
          </h1>
          <p className="about__hero-desc">
            Akhuwat was founded on a simple but revolutionary idea — that the poor deserve access to financial resources without being burdened by interest.
          </p>
        </div>
      </section>

      <section className="about__mission">
        <div className="about__section-inner">
          <div className="about__mission-grid">
            <div className="about__mission-text">
              <p className="about__section-tag">Our Mission</p>
              <h2 className="about__heading">Financial Dignity<br />for Every Pakistani</h2>
              <p className="about__body-text">
                Akhuwat's mission is to alleviate poverty by creating a compassionate and inclusive financial system inspired by the Islamic principles of mutual support. We believe that no one should be denied economic opportunity because of a lack of collateral or an inability to pay interest.
              </p>
              <p className="about__body-text">
                Our interest-free loans — called Qarz-e-Hasna — are disbursed through a community-based model that fosters accountability, solidarity, and long-term transformation.
              </p>
              <Link to="/loan-programs" className="about__btn-primary">
                View Loan Programs <ArrowRight size={15} />
              </Link>
            </div>
            <div className="about__mission-visual">
              <div className="about__mission-card about__mission-card--top">
                <div className="about__mission-card-icon">0%</div>
                <div>
                  <strong>Zero Interest</strong>
                  <p>No riba. No hidden charges. Ever.</p>
                </div>
              </div>
              <div className="about__mission-card about__mission-card--mid">
                <div className="about__mission-card-icon">97%</div>
                <div>
                  <strong>Repayment Rate</strong>
                  <p>Among the highest in global microfinance.</p>
                </div>
              </div>
              <div className="about__mission-card about__mission-card--bot">
                <div className="about__mission-card-icon">500K+</div>
                <div>
                  <strong>Families Served</strong>
                  <p>Real lives changed across Pakistan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about__values">
        <div className="about__section-inner">
          <div className="about__section-header">
            <p className="about__section-tag">What Drives Us</p>
            <h2 className="about__heading">Our Core Values</h2>
          </div>
          <div className="about__values-grid">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="about__value-card">
                  <div className="about__value-icon">
                    <Icon size={20} />
                  </div>
                  <h3 className="about__value-title">{v.title}</h3>
                  <p className="about__value-desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about__timeline">
        <div className="about__section-inner">
          <div className="about__section-header">
            <p className="about__section-tag">Our Journey</p>
            <h2 className="about__heading">Milestones That Matter</h2>
          </div>
          <div className="about__timeline-list">
            {milestones.map((m, i) => (
              <div key={m.year} className={`about__timeline-item ${i % 2 === 0 ? "about__timeline-item--left" : "about__timeline-item--right"}`}>
                <div className="about__timeline-dot" />
                <div className="about__timeline-content">
                  <span className="about__timeline-year">{m.year}</span>
                  <p className="about__timeline-event">{m.event}</p>
                </div>
              </div>
            ))}
            <div className="about__timeline-line" />
          </div>
        </div>
      </section>

      <section className="about__cta">
        <div className="about__section-inner about__cta-inner">
          <h2 className="about__cta-heading">Be Part of the Change</h2>
          <p className="about__cta-sub">Apply for an interest-free loan today and take your first step toward a better future.</p>
          <Link to="/register" className="about__btn-primary">
            Apply Now <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}