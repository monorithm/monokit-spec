import React from "react";
import { Pressable } from "../actions/Pressable.jsx";

/* Switch — a state that applies immediately. If it needs a Save button it should be a
   checkbox in a form instead. Flat track, flat knob: borders and light, not shadows.

   It goes through Pressable rather than being a bare button so press reporting, the
   haptic trigger point (haptics.selection on value change) and the debug minimum-target
   assertion are the same ones every other affordance uses. */
export function Switch({ checked = false, onChange, disabled = false, label, id }) {
  return (
    <Pressable
      as="button" id={id} role="switch" aria-checked={checked ? "true" : "false"}
      aria-label={label} disabled={disabled}
      className="mk-switch" data-on={checked ? "true" : "false"}
      onPress={() => onChange && onChange(!checked)}
    >
      <span className="mk-switch-knob" />
    </Pressable>
  );
}
