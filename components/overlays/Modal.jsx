import React from "react";

/* Modal — the overlay primitive. It owns the four things every modal surface owes and none of
   them are optional: a focus trap for its lifetime, a background excluded from focus, pointer
   AND semantics, focus restored to the trigger on dismiss, and a labelled dismiss barrier.

   It exists as a primitive because a barrier that is a bare gesture target is invisible to
   assistive technology, which makes the overlay a trap with no exit — the specification names
   this failure directly. Sheet composes it; Dialog and Drawer inherit it rather than
   reimplementing it, which is the point.

   Modal does not manage its own presence. A consumer that animates out needs to outlive its
   own `open` prop, so the consumer decides when Modal is mounted and Modal arms on mount and
   restores on unmount. It also does not wrap its children: the consumer's own element carries
   the dialog role and the transform, so nothing sits between the layer and the surface. */

const FOCUSABLE = [
  "a[href]", "area[href]", "input:not([disabled])", "select:not([disabled])",
  "textarea:not([disabled])", "button:not([disabled])", "iframe", "object", "embed",
  '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]'
].join(",");

/* Exported so a specimen can draw the tab cycle from the same source the trap uses. A diagram
   that computed its own order could disagree with the behaviour it claims to document. */
export function modalFocusables(layer) {
  if (!layer) return [];
  return Array.prototype.filter.call(layer.querySelectorAll(FOCUSABLE), function (el) {
    return el.getClientRects().length > 0;
  });
}

/* Everything outside the layer, marked unreachable by every modality. inert covers focus,
   pointer and semantics in one attribute; where it is unsupported the three are applied by
   hand so the exclusion is never partial. */
function excludeBackground(layer) {
  const supported = "inert" in HTMLElement.prototype;
  const touched = [];
  let node = layer;
  while (node && node.parentElement) {
    const siblings = node.parentElement.children;
    for (let i = 0; i < siblings.length; i++) {
      const el = siblings[i];
      if (el === node) continue;
      if (supported) {
        if (el.inert) continue;
        el.inert = true;
        touched.push({ el, mode: "inert" });
      } else {
        touched.push({ el, mode: "manual",
          hidden: el.getAttribute("aria-hidden"), pointer: el.style.pointerEvents });
        el.setAttribute("aria-hidden", "true");
        el.style.pointerEvents = "none";
      }
    }
    node = node.parentElement;
    if (node === document.body) break;
  }
  return function restore() {
    touched.forEach(function (t) {
      if (t.mode === "inert") { t.el.inert = false; return; }
      if (t.hidden == null) t.el.removeAttribute("aria-hidden");
      else t.el.setAttribute("aria-hidden", t.hidden);
      t.el.style.pointerEvents = t.pointer || "";
    });
  };
}

export function Modal({
  onClose, label, children,
  barrierLabel = "Close",
  barrierStyle,
  placement = "end",
  onFocusChange
}) {
  const layer = React.useRef(null);
  const returnTo = React.useRef(null);

  /* Arm on mount, restore on unmount. Capturing the trigger before the background is excluded
     matters: inert blurs whatever had focus, so reading it later reads null. */
  React.useEffect(() => {
    const node = layer.current;
    if (!node) return;
    returnTo.current = document.activeElement;
    const release = excludeBackground(node);

    const surface = node.querySelector('[role="dialog"]') || node;
    if (surface.focus) surface.focus({ preventScroll: true });

    return () => {
      release();
      const back = returnTo.current;
      /* Only restore if the trigger is still in the document and still focusable. */
      if (back && back.focus && document.contains(back)) back.focus({ preventScroll: true });
    };
  }, []);

  /* Escape, and Tab cycling. The barrier is first in the layer, so Tab runs the content and
     then lands on the dismiss control before wrapping — the exit is the last stop, not the
     first thing between the user and the surface. */
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); if (onClose) onClose(); return; }
      if (e.key !== "Tab") return;
      const items = modalFocusables(layer.current);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = layer.current && layer.current.contains(active);
      if (!inside) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Optional reporting, so a specimen can make an invisible behaviour observable. */
  React.useEffect(() => {
    if (!onFocusChange) return;
    const report = () => onFocusChange(document.activeElement, modalFocusables(layer.current));
    document.addEventListener("focusin", report);
    report();
    return () => document.removeEventListener("focusin", report);
  }, [onFocusChange]);

  return (
    <div className="mk-modal-layer" data-placement={placement} ref={layer}>
      <button type="button" className="mk-modal-barrier" aria-label={barrierLabel}
        style={barrierStyle} onPointerDown={onClose} />
      {children}
    </div>
  );
}
