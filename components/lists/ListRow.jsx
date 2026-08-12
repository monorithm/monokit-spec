import React from "react";
import { Pressable } from "../actions/Pressable.jsx";
import { Icon } from "../display/Icon.jsx";

/* ListRow — one line or two, full bleed, 48 or 64 high. The row itself is never a button:
   when it presses, an overlay press target covers the lead and text columns and stops short
   of the trailing column, so an interactive trailing control (a Switch) is a SIBLING of the
   press target rather than a button inside a button. One tap, one handler, one tab stop each. */
export function ListRow({
  icon, leading, title, subtitle, value, trailing, chevron = false,
  onPress, onLongPress, separator = false, className = "", style,
}) {
  /* No explicit size: chrome resolves from density — 20 at touch, 16 at pointer. */
  /* Which leading kind this row carries. The specification defines two — an icon at its role
     size, or an avatar at the list leading size — and the separator inset differs between them. */
  const leadKind = leading ? "avatar" : icon ? "icon" : "false";
  const lead = leading || (icon ? <Icon name={icon} decorative /> : null);
  const twoLine = !!subtitle;
  const pressable = !!(onPress || onLongPress);
  const name = [title, subtitle].filter((p) => typeof p === "string").join(", ");
  return (
    <div className={"mk-row " + className} style={style}
      data-two-line={twoLine ? "true" : "false"}
      data-separator={separator ? "true" : "false"}
      data-lead={leadKind}
      data-pressable={pressable ? "true" : "false"}>
      {pressable
        ? <Pressable as="button" className="mk-row-hit" onPress={onPress}
            onLongPress={onLongPress} aria-label={name || undefined} />
        : null}
      {lead ? <span className="mk-row-lead">{lead}</span> : <span />}
      <span className="mk-row-text">
        <span className="mk-row-title">{title}</span>
        {subtitle ? <span className="mk-row-sub">{subtitle}</span> : null}
      </span>
      <span className="mk-row-trail">
        {value ? <span className="mk-row-value">{value}</span> : null}
        {trailing}
        {chevron ? <Icon name="chevronRight" decorative /> : null}
      </span>
    </div>
  );
}
