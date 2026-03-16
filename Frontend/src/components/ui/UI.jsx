import "./UI.css";

/* ─────────────────────────────────────────
   Card
───────────────────────────────────────── */
export function Card({ children, className = "" }) {
  return (
    <div className={`ui-card ${className}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Badge
───────────────────────────────────────── */
export function Badge({ status }) {
  const mod = status?.replace(/_/g, "-") || "default";
  return (
    <span className={`ui-badge ui-badge--${mod}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

/* ─────────────────────────────────────────
   Spinner
───────────────────────────────────────── */
export function Spinner({ size = "md" }) {
  return <div className={`ui-spinner ui-spinner--${size}`} />;
}

/* ─────────────────────────────────────────
   PageLoader
───────────────────────────────────────── */
export function PageLoader() {
  return (
    <div className="ui-page-loader">
      <Spinner size="lg" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Alert
───────────────────────────────────────── */
export function Alert({ type = "error", message }) {
  if (!message) return null;
  return (
    <div className={`ui-alert ui-alert--${type}`}>
      <span className="ui-alert__dot" />
      <span className="ui-alert__msg">{message}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Input
───────────────────────────────────────── */
export function Input({ label, error, ...props }) {
  return (
    <div className="ui-field">
      {label && <label className="ui-label">{label}</label>}
      <input className={`ui-input ${error ? "ui-input--error" : ""}`} {...props} />
      {error && <p className="ui-field__error">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Select
───────────────────────────────────────── */
export function Select({ label, error, children, ...props }) {
  return (
    <div className="ui-field">
      {label && <label className="ui-label">{label}</label>}
      <div className="ui-select-wrap">
        <select className={`ui-select ${error ? "ui-select--error" : ""}`} {...props}>
          {children}
        </select>
        <span className="ui-select-arrow">&#8964;</span>
      </div>
      {error && <p className="ui-field__error">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Textarea
───────────────────────────────────────── */
export function Textarea({ label, error, ...props }) {
  return (
    <div className="ui-field">
      {label && <label className="ui-label">{label}</label>}
      <textarea className={`ui-textarea ${error ? "ui-textarea--error" : ""}`} {...props} />
      {error && <p className="ui-field__error">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Button
───────────────────────────────────────── */
export function Button({ children, loading, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="ui-btn__spinner" />}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   StatCard
───────────────────────────────────────── */
export function StatCard({ label, value, icon: Icon, color = "forest", sub }) {
  return (
    <div className={`ui-stat ui-stat--${color}`}>
      <div className="ui-stat__icon-wrap">
        <Icon size={18} className="ui-stat__icon" />
      </div>
      <div className="ui-stat__body">
        <p className="ui-stat__label">{label}</p>
        <p className="ui-stat__value">{value}</p>
        {sub && <p className="ui-stat__sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EmptyState
───────────────────────────────────────── */
export function EmptyState({ message = "No data found" }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty__icon">∅</div>
      <p className="ui-empty__msg">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Table
───────────────────────────────────────── */
export function Table({ headers, children }) {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="ui-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────
   Pagination
───────────────────────────────────────── */
export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <div className="ui-pagination">
      <span className="ui-pagination__info">
        Page {pagination.page} of {pagination.pages}
        <span className="ui-pagination__total"> ({pagination.total} total)</span>
      </span>
      <div className="ui-pagination__controls">
        <button
          className="ui-pagination__btn"
          onClick={() => onPage(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          ← Prev
        </button>
        <span className="ui-pagination__page">{pagination.page}</span>
        <button
          className="ui-pagination__btn"
          onClick={() => onPage(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
