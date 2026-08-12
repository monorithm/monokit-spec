import React from "react";

/* Screen — one primary subject, three regions: chrome, scrolling content, committed
   action. The app is a viewport, not a document, so the screen does not scroll — its
   content region does, with momentum and contained overscroll. The footer lifts on the
   keyboard inset, because the app never draws keys. */
export function Screen({
  header, footer, onMedia = false, scroll = true, safeTop = true, safeBottom = true,
  padded = true, children, className = "", style,
}) {
  return (
    <div className={"mk-screen " + className} data-on-media={onMedia ? "true" : "false"} style={style}>
      <div className={safeTop ? "mk-safe-top" : ""}>{header}</div>
      <div className={scroll ? "mk-scroll" : ""}
        style={padded ? { padding: "0 var(--page-inset)" } : undefined}>
        {children}
      </div>
      <div className={"mk-lift " + (safeBottom ? "mk-safe-bottom" : "")}
        style={footer ? { padding: "var(--space-12) var(--page-inset) var(--space-16)" } : undefined}>
        {footer}
      </div>
    </div>
  );
}
