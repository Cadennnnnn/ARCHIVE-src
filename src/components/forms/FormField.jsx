export default function FormField({ id, label, type = "text", value, onChange, error, placeholder, children, ...rest }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label small text-uppercase fw-bold">{label}</label>
      {children ? (
        children
      ) : (
        <input
          id={id}
          type={type}
          className={`form-control rounded-0 ${error ? "is-invalid" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      )}
      {error && <span className="field-msg error">{error}</span>}
    </div>
  );
}