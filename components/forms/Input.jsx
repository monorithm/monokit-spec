import React from "react";

/* Input — a well, not a box: the muted surface carries the field and no border draws a
   rectangle. `lg` is the single-subject size for a screen whose whole job is one value. */
export function Input({
  value, onChange, placeholder, type = "text", size = "md", invalid = false, disabled = false,
  inputMode, autoComplete, maxLength, id, prefix, className = "", style, ...rest
}) {
  const input = (
    <input
      id={id}
      className={"mk-input " + (size === "lg" ? "mk-input-lg " : "") + (prefix ? "mk-input-plain " : "") + className}
      style={prefix ? undefined : style}
      type={type} value={value} placeholder={placeholder} disabled={disabled}
      inputMode={inputMode} autoComplete={autoComplete} maxLength={maxLength}
      aria-invalid={invalid ? "true" : undefined}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...rest}
    />
  );
  if (!prefix) return input;
  return (
    <span className={"mk-input " + (size === "lg" ? "mk-input-lg" : "")}
      style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", ...style }}
      aria-invalid={invalid ? "true" : undefined}>
      <span style={{ color: "var(--muted-foreground)" }}>{prefix}</span>{input}
    </span>
  );
}
