import React from "react";

/* InputOtp — the single-decision screen made literal. One hidden input owns keystrokes,
   paste, and the platform's one-time-code autofill; the cells are presentation. Digits
   take the content voice with tabular figures, not the mono register: the user reads and
   types this code, so it is content. The active cell carries a brand caret — here focus
   IS intent, which is why it is not the neutral ring. */
export function InputOtp({
  length = 6, value = "", onChange, onComplete, invalid = false,
  autoFocus = false, disabled = false, label = "Verification code",
}) {
  const ref = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const digits = value.slice(0, length).split("");
  const active = Math.min(digits.length, length - 1);

  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  React.useEffect(() => {
    if (value.length === length && onComplete) onComplete(value);
  }, [value, length]);

  return (
    <div className="mk-otp" data-invalid={invalid ? "true" : "false"}
      onPointerDown={() => ref.current && ref.current.focus()}>
      <input ref={ref} className="mk-otp-input" value={value} inputMode="numeric"
        autoComplete="one-time-code" aria-label={label} disabled={disabled} maxLength={length}
        onChange={(e) => onChange && onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, length))}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {Array.from({ length }).map((_, i) => {
        const isActive = focused && i === active && !invalid;
        return (
          <div key={i} className="mk-otp-cell" data-active={isActive ? "true" : "false"}>
            {digits[i] ? digits[i] : (isActive ? <span className="mk-otp-caret" /> : null)}
          </div>
        );
      })}
    </div>
  );
}
