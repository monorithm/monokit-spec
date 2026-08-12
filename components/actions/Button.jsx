import React from "react";
import { Pressable } from "./Pressable.jsx";
import { Icon } from "../display/Icon.jsx";

/* Button — confirms, never surprises. Native geometry: 44 minimum at md, 48 for the
   block CTA that owns the bottom of a screen. Press is a scale plus a derived fill
   darkening, in one frame. No shadow at any variant. */
export function Button({
  variant = "primary", size = "md", block = false, icon, iconEnd, pending = false,
  disabled = false, onPress, onLongPress, label, children, className = "", style, ...rest
}) {
  const isIconOnly = !children && !!icon;
  const cls = [
    "mk-btn",
    size === "cta" ? "mk-btn-cta" : "mk-btn-md",
    "mk-btn-" + variant,
    block ? "mk-btn-block" : "",
    isIconOnly ? "mk-btn-icon" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Pressable
      className={cls} style={style} onPress={onPress} onLongPress={onLongPress}
      disabled={disabled} pending={pending} aria-label={isIconOnly ? label : undefined} {...rest}
    >
      {pending ? <span className="mk-btn-spinner" /> : icon ? <Icon name={icon} size={isIconOnly ? "md" : "sm"} decorative /> : null}
      {children}
      {iconEnd && !pending ? <Icon name={iconEnd} size="sm" decorative /> : null}
    </Pressable>
  );
}
