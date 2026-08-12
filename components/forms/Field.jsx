import React from "react";

/* Field — label, control, and the one line that tells the truth about it. Errors name
   the failure and carry the recovery; they never say "invalid input". Error replaces
   hint rather than stacking, so the row never grows twice. */
export function Field({ label, hint, error, htmlFor, children, className = "", style }) {
  return (
    <div className={"mk-field " + className} style={style}>
      {label ? <label className="mk-field-label" htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {error
        ? <span className="mk-field-error" role="alert">{error}</span>
        : hint ? <span className="mk-field-hint">{hint}</span> : null}
    </div>
  );
}
