import React from "react";

/* Pager — a real swipe, not a carousel: the track follows the finger, rubber-bands past
   the end stops, and settles on the spatial spring. A fling wins on velocity; a short
   drag snaps back. Vertical scrolling still works because the track only claims the
   horizontal axis. Thresholds are the specification's (07 section 4), shared with Sheet. */
const COMMIT_FRACTION = 0.3;    /* interaction.gestures.dismissFraction */
const COMMIT_VELOCITY = 0.7;    /* 700 px/s in px/ms */
const RUBBER_BAND = 0.55;       /* interaction.gestures.rubberBand */
export function Pager({ index = 0, onIndexChange, children, className = "", style }) {
  const panes = React.Children.toArray(children).filter(Boolean);
  const ref = React.useRef(null);
  const start = React.useRef(null);
  /* Same reason as Sheet: the commit decision reads travel from a ref, not from the render
     closure, so a flick whose move and release share a tick still commits. */
  const travel = React.useRef(0);
  const [drag, setDrag] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  const width = () => (ref.current ? ref.current.offsetWidth : 1);

  const onDown = (e) => {
    start.current = { x: e.clientX, t: Date.now() };
    travel.current = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!start.current) return;
    let dx = e.clientX - start.current.x;
    const atStart = index === 0 && dx > 0;
    const atEnd = index === panes.length - 1 && dx < 0;
    if (atStart || atEnd) dx *= RUBBER_BAND;
    travel.current = dx;
    setDrag(dx);
  };
  const onUp = () => {
    if (!start.current) return;
    const dx = travel.current;
    const dt = Math.max(1, Date.now() - start.current.t);
    const velocity = Math.abs(dx) / dt; /* px per ms */
    const far = Math.abs(dx) > width() * COMMIT_FRACTION;
    let next = index;
    if (far || velocity > COMMIT_VELOCITY) next = dx < 0 ? Math.min(index + 1, panes.length - 1) : Math.max(index - 1, 0);
    start.current = null;
    travel.current = 0;
    setDragging(false);
    setDrag(0);
    if (next !== index && onIndexChange) onIndexChange(next);
  };

  const offset = "calc(" + (-index * 100) + "% + " + drag + "px)";

  return (
    <div ref={ref} className={"mk-pager " + className} style={style}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="mk-pager-track"
        style={{
          transform: "translate3d(" + offset + ",0,0)",
          transition: dragging ? "none" : "transform var(--spring-spatial-default)",
        }}>
        {panes.map((pane, i) => (
          <div key={i} className="mk-pager-pane" aria-hidden={i === index ? undefined : "true"}>{pane}</div>
        ))}
      </div>
    </div>
  );
}
