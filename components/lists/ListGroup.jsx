import React from "react";

/* ListGroup — the native containment model. No card, no border box, no rounded island:
   a header in the margin, full-bleed rows, hairlines inset to the text column. The group
   owns the separators so the last row never draws one. */
export function ListGroup({ header, footer, children, className = "", style }) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <section className={"mk-list " + className} style={style}>
      {header ? <h2 className="mk-list-header">{header}</h2> : null}
      <div className="mk-list-body">
        {rows.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { separator: i < rows.length - 1 })
            : child
        )}
      </div>
      {footer ? <p className="mk-list-footer">{footer}</p> : null}
    </section>
  );
}
