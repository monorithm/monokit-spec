import React from "react";
import { Modal } from "./Modal.jsx";

/* Sheet — the native answer to one decision. It enters from the edge it belongs to, it is
   draggable, and it dismisses by gesture at the specified thresholds: travel past 30% of
   its height, or release velocity above 700 px/s along the dismiss axis. Upward drag
   rubber-bands. Radius scales with surface size, so a sheet takes the largest step.

   Position has exactly ONE driver: an inline transform with a transition. Entry, drag,
   return and exit are all the same property, so nothing can override anything else — a CSS
   keyframe entry cannot coexist with a dragged transform, because re-adding the animation
   after a drag restarts it from its first frame and throws the sheet off screen.

   Both phase changes force a style flush before the transform moves. A transition only
   interpolates when the property it animates changes in a LATER commit than the transition
   itself; batching them produces a jump, and frame-scheduling that ordering is unreliable.

   Accessibility is Modal's: the focus trap, the background exclusion, the restore to the
   trigger, Escape, and the barrier being a real labelled button rather than a scrim with a
   pointer handler. Sheet owns only what is its own — position, gesture, and chrome. */

const DISMISS_FRACTION = 0.3;   /* interaction.gestures.dismissFraction */
const DISMISS_VELOCITY = 0.7;   /* 700 px/s, expressed in px/ms to match pointer timing */
const RUBBER_BAND = 0.55;       /* interaction.gestures.rubberBand */
const EXIT_MS = 100;            /* motion.duration.fast — an exit runs one step shorter than its enter */

const CLOSED = "translate3d(0,100%,0)";
const OPEN_EASE = "transform var(--motion-emphasis)";
const RETURN_EASE = "transform var(--spring-spatial-default)";
const EXIT_EASE = "transform var(--motion-exit)";

export function Sheet({ open, onClose, title, children, footer }) {
  const [mounted, setMounted] = React.useState(false);
  const [seated, setSeated] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [y, setY] = React.useState(0);
  const [ease, setEase] = React.useState(OPEN_EASE);
  const start = React.useRef(null);
  const ref = React.useRef(null);
  /* Travel is decided from a ref: pointermove and pointerup can land in the same tick on a
     fast flick, and reading y's render closure would judge the release on stale travel. */
  const travel = React.useRef(0);

  /* The sheet outlives `open` by one exit so it can animate out. */
  React.useEffect(() => {
    if (open) {
      travel.current = 0;
      setY(0);
      setEase(OPEN_EASE);
      setLeaving(false);
      setMounted(true);
      return;
    }
    if (!mounted) return;
    /* Put the exit curve on the node before React commits the new transform, so the change
       has something to interpolate against. */
    if (ref.current) ref.current.style.transition = EXIT_EASE;
    setEase(EXIT_EASE);
    setLeaving(true);
    const t = setTimeout(() => { setMounted(false); setSeated(false); setLeaving(false); }, EXIT_MS);
    return () => clearTimeout(t);
  }, [open, mounted]);

  /* Seat it: the first paint is off screen, then a forced style flush makes the move to rest
     a separate commit, which is what the transition needs to run. */
  React.useLayoutEffect(() => {
    if (!mounted || seated || leaving || !ref.current) return;
    void ref.current.offsetHeight;
    setSeated(true);
  }, [mounted, seated, leaving]);

  if (!mounted) return null;

  const height = () => (ref.current ? ref.current.offsetHeight : 1);
  const onDown = (e) => {
    if (leaving) return;
    start.current = { y: e.clientY, t: Date.now() };
    travel.current = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!start.current) return;
    let dy = e.clientY - start.current.y;
    if (dy < 0) dy *= RUBBER_BAND;
    travel.current = dy;
    setY(dy);
  };
  const onUp = () => {
    if (!start.current) return;
    const dy = travel.current;
    const dt = Math.max(1, Date.now() - start.current.t);
    const velocity = dy / dt;
    const far = dy > height() * DISMISS_FRACTION;
    start.current = null;
    travel.current = 0;
    setDragging(false);
    if ((far || velocity > DISMISS_VELOCITY) && onClose) { onClose(); return; }
    /* A cancelled gesture leaves no trace: back to rest on the spatial spring. */
    setEase(RETURN_EASE);
    setY(0);
  };

  const away = !seated || leaving;
  const transform = away ? CLOSED : "translate3d(0," + Math.max(0, y) + "px,0)";
  const transition = dragging ? "none" : ease;

  return (
    <Modal onClose={onClose} label={title} barrierLabel={title ? "Close " + title : "Close"}
      barrierStyle={{ opacity: away ? 0 : Math.max(0, 1 - y / 400),
                      transition: dragging ? "none" : ease.replace("transform", "opacity") }}>
      <div ref={ref} className="mk-sheet" role="dialog" aria-modal="true" aria-label={title}
        tabIndex={-1} style={{ transform, transition }}>
        <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="mk-sheet-grab" />
          {title ? <h2 className="mk-sheet-title">{title}</h2> : null}
        </div>
        <div className="mk-sheet-body">{children}</div>
        {footer}
      </div>
    </Modal>
  );
}
