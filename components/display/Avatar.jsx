import React from "react";
import { Icon } from "./Icon.jsx";

/* Avatar — an empty avatar is a DECLARED placeholder: the media canvas with the media
   role glyph, honest about being empty. This system ships no photography, and initials
   in a grey circle would be pretending otherwise. */
export function Avatar({ size = 40, src, alt, edit = false, className = "", style }) {
  const empty = !src;
  return (
    <span className={"mk-avatar " + className} data-empty={empty ? "true" : "false"}
      style={{ width: size, height: size, ...style }}>
      {empty
        ? <Icon name="user" size={size >= 72 ? "xl" : size >= 48 ? "lg" : "sm"} decorative />
        : <img src={src} alt={alt || ""} />}
      {edit ? <span className="mk-avatar-edit"><Icon name="camera" size="sm" decorative /></span> : null}
    </span>
  );
}
