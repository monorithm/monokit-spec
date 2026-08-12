import React from "react";

const SIZES = { xs: 16, sm: 20, md: 24, lg: 28, xl: 32 };

/* Icon — a semantic ROLE resolved to a glyph, never a vendor name: callers ask for
   `like` or `back`, and the role-to-glyph binding lives only in the generated
   assets/icons/icon-roles.js. Stroke-only on the 24 grid, 1.5 at rest, 2.0 active, with
   the sanctioned optical floor at 16. Chrome resolves its default size from density —
   16 at pointer, 20 at touch — so an icon in a toolbar is the right size on both.

   Load assets/icons/icon-paths.js and assets/icons/icon-roles.js once per document. */

const MIRRORED_DIR = "rtl";

const warned = new Set();
function resolveRole(name) {
  const roles = (typeof window !== "undefined" && window.MonokitIconRoles) || {};
  if (roles[name]) return roles[name];
  /* Deprecated path: a raw vendor glyph id. Kept so the web realization's call sites keep
     rendering, warned once each so they get migrated to roles. */
  if (!warned.has(name)) {
    warned.add(name);
    if (typeof console !== "undefined") {
      console.warn("monokit: \"" + name + "\" is a vendor glyph id, not a semantic role. " +
        "Ask for a role from contract/icon.json — the role-to-glyph binding is the system's concern.");
    }
  }
  return { glyph: name, label: null, mirror: 0 };
}

export function Icon({ name, size, active = false, color, label, decorative = false, style, className = "" }) {
  const role = resolveRole(name);
  /* No size means chrome: the stylesheet resolves it from the density scope, so switching
     density changes it live and the component never probes the platform. */
  const chrome = !size;
  const px = chrome ? undefined : (SIZES[size] || size);
  const paths = (typeof window !== "undefined" && window.MonokitIconPaths) || {};
  const inner = role.glyph ? paths[role.glyph] : null;
  const rtl = typeof document !== "undefined" && document.dir === MIRRORED_DIR;
  const mirror = role.mirror && rtl;
  const name11y = decorative ? undefined : (label || role.label || undefined);

  if (!inner) {
    /* Absent role, or a glyph this realization does not ship. It holds its space rather
       than substituting a look-alike from another metaphor. */
    return <span className={"mk-icon " + className} aria-hidden="true"
      data-size={chrome ? "chrome" : undefined}
      data-absent={role.glyph ? undefined : "true"}
      style={chrome ? style : { width: px, height: px, ...style }} />;
  }

  return (
    <span
      className={"mk-icon " + className}
      data-active={active ? "true" : "false"}
      data-size={chrome ? "chrome" : (typeof size === "string" ? size : undefined)}
      role={name11y ? "img" : "presentation"}
      aria-label={name11y}
      aria-hidden={name11y ? undefined : "true"}
      style={{ ...(chrome ? {} : { width: px, height: px }), color,
               ...(mirror ? { transform: "scaleX(-1)" } : {}), ...style }}
      dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" focusable="false">' + inner + "</svg>" }}
    />
  );
}
