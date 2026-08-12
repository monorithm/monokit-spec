import React from "react";

/* PageDots — position, not navigation. The active dot widens into a bar; dots do not
   compete with the content for attention and are never the only way to move. */
export function PageDots({ count, index = 0, onMedia = false, label = "Page" }) {
  return (
    <div className="mk-dots" data-on-media={onMedia ? "true" : "false"}
      role="tablist" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="mk-dot" data-active={i === index ? "true" : "false"}
          role="tab" aria-selected={i === index ? "true" : "false"}
          aria-label={label + " " + (i + 1)} />
      ))}
    </div>
  );
}
