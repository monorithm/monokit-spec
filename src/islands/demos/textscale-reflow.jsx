import React from "react";

/* Text-scale reflow.
 *
 * The specimen for the text-scaling policy on this page: OS text scale to 200% with no loss of
 * content or function. It is a MEASUREMENT, not an illustration. Status lists text scaling as
 * untested at 1.3 and 2.0, so a specimen that drew a well-behaved screen would be asserting the
 * very thing under test. This one renders real components at the chosen scale, reads their boxes
 * back on every change, and reports what escapes - including when the answer is the button label.
 *
 * HOW THE SCALE IS APPLIED. Every type role in this system is declared in rem, and an OS or
 * browser text-scale setting is a change to the root font size. Multiplying the roles inside the
 * column reproduces that, and reproduces the half of it that matters most: spacing, icon and
 * target tokens are px, so they do NOT move, and a control that takes its height from a spacing
 * constant alone cannot grow with its label. The controls above the column are the specimen's own
 * chrome and stay at the page's scale, so the reader keeps a fixed reference to measure against.
 *
 * Nothing is special-cased. The column is a compact-width app surface embedded in the document,
 * and what overflows it is reported as overflowing it.
 */

/* The roles the sample consumes, captured once on the outer scope and multiplied on the inner:
   a custom property cannot be defined in terms of itself, so the base has to be read from an
   ancestor. Named rather than globbed - these are the roles this sample actually reads, and a
   role that appears here but not in the sample would be a claim the specimen does not test. */
const ROLES = [
  "--text-button", "--text-body-large", "--text-body-medium",
  "--text-label-large", "--text-label-medium", "--text-headline-medium",
];

const alias = (role) => "--ts" + role.slice("--text".length);
const BASE = Object.fromEntries(ROLES.map((r) => [alias(r), "var(" + r + ")"]));
const scaled = (factor) =>
  Object.fromEntries(ROLES.map((r) => [r, "calc(var(" + alias(r) + ") * " + factor + ")"]));

/* The scale factors the policy names: unscaled, the common large-text setting, and the 200%
   ceiling the specification supports. The slider covers the range between them. */
const SNAPS = [100, 130, 200];

/* Each probed part, with what its geometry rests on. The notes describe the mechanism in the
   realization being measured; the numbers beside them come from the rendered boxes, never from
   here. */
const PARTS = [
  { selector: ".mk-row", name: "List row",
    note: "min-height plus a text column that wraps, so the row grows downward" },
  { selector: ".mk-otp", name: "Code row",
    note: "cells take a fixed height, not a minimum, and the six share a row that cannot wrap" },
  { selector: ".mk-btn", name: "Block CTA",
    note: "min-height grows the pill, but the label is nowrap and cannot wrap into it" },
];

/* Sub-pixel layout and rounded borders put every reading a fraction over its container. One pixel
   of slack keeps that from being reported as an overflow; anything a reader could see clears it. */
const SLACK = 1;

/* What the content actually paints, rather than what its box claims. A Range over the contents
   measures the text where it lands, so a label that has spilled out of the pill it sits in is
   measurable - scrollWidth reports that inconsistently for a box whose overflow is visible, which
   is every box in this sample. */
function contentRect(el) {
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    return r.width || r.height ? r : el.getBoundingClientRect();
  } catch (e) {
    return el.getBoundingClientRect();
  }
}

const beyond = (edges) => {
  const worst = Math.max(0, ...edges) - SLACK;
  return worst > 0 ? Math.round(worst) : 0;
};

function read(column) {
  const box = column.getBoundingClientRect();
  return PARTS.map((part) => {
    const el = column.querySelector(part.selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = contentRect(el);
    return {
      name: part.name,
      note: part.note,
      height: Math.round(r.height),
      /* content outside the part's own box */
      spill: beyond([c.right - r.right, r.left - c.left, c.bottom - r.bottom, r.top - c.top]),
      /* the part, or its content, outside the screen it is on */
      past: beyond([Math.max(r.right, c.right) - box.right, box.left - Math.min(r.left, c.left)]),
    };
  }).filter(Boolean);
}

function verdict(r) {
  if (r.spill && r.past) {
    return "escapes its box by " + r.spill + "px, the screen by " + r.past + "px";
  }
  if (r.spill) return "content escapes its box by " + r.spill + "px";
  if (r.past) return "overflows the screen by " + r.past + "px";
  return "reflows inside the screen";
}

export function TextScaleReflow({ K }) {
  const id = React.useId();
  const column = React.useRef(null);
  const [pct, setPct] = React.useState(100);
  const [code, setCode] = React.useState("41902");
  const [readings, setReadings] = React.useState([]);

  /* Measured after layout, again once the fonts land, and again whenever the column changes size -
     the three moments the anatomy pins measure at, for the same reason: a reading taken against
     fallback font metrics is a reading of a different screen. */
  React.useEffect(() => {
    const host = column.current;
    if (!host) return;
    let live = true;
    const measure = () => { if (live) setReadings(read(host)); };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => { live = false; observer.disconnect(); };
  }, [pct, code]);

  /* The announcement carries the OUTCOME and not the value. The slider announces its own value on
     every step, and a live region that repeated it would fire many times a second while the slider
     is dragged - which this page's own timing rule forbids. This string changes only when a part
     crosses from reflowing to overflowing, so it is spoken at the moment that is worth hearing and
     stays silent for every step in between. */
  const faults = readings.filter((r) => r.past || r.spill);
  const summary = readings.length === 0
    ? "Measuring the sample screen."
    : (readings.length - faults.length) + " of " + readings.length +
      " parts reflow inside the screen" +
      (faults.length
        ? ". Overflowing: " + faults.map((f) => f.name).join(", ") + "."
        : ", and nothing escapes its box.");

  return (
    <div className="demo demo-textscale" style={BASE}>
      <div className="demo-textscale-controls">
        <label className="demo-textscale-name" htmlFor={id}>OS text scale</label>
        {/* valuetext because the raw value is a percentage of a scale, not of the slider's own
            range: without it the reading is "170 of 100 to 200". */}
        <input className="demo-textscale-slider" id={id} type="range"
          min={SNAPS[0]} max={SNAPS[SNAPS.length - 1]} step={5} value={pct}
          aria-valuetext={pct + "%"}
          onChange={(e) => setPct(Number(e.target.value))} />
        {/* A visual echo of what the slider already announces. Left live, it would announce the
            same number a second time on every step of a drag. */}
        <output className="demo-textscale-value" htmlFor={id} aria-live="off">{pct}%</output>
        <span className="demo-textscale-snaps" role="group" aria-label="Text scale presets">
          {SNAPS.map((s) => (
            <K.Button key={s} variant={pct === s ? "soft" : "ghost"} aria-pressed={pct === s}
              onPress={() => setPct(s)}>{(s / 100).toFixed(1)}x</K.Button>
          ))}
        </span>
      </div>

      {/* A compact-width app surface. Its width does not grow with the text, because a screen
          does not: that is the whole constraint the policy is about. */}
      <div className="demo-textscale-stage">
        <div className="demo-textscale-column" ref={column} data-density="touch"
          style={scaled(pct / 100)}>
          <K.ListGroup header="Your order">
            <K.ListRow icon="cart" title="Kente wrap, two yards"
              subtitle="Ships from Accra on Tuesday" value="GHS 420" />
            <K.ListRow icon="notification" title="Delivery updates"
              subtitle="Texts to the number ending 0000" />
          </K.ListGroup>
          <div className="demo-textscale-pad">
            <K.Field label="Verification code" hint="Sent to the number ending 0000">
              {/* InputOtp lays its one real input over the cells absolutely, and takes its
                  containing block from whatever above it is positioned. Nothing in this
                  composition is, so the input would stretch over the whole page and swallow every
                  press in the specimen. The wrapper is the containing block it expects. */}
              <span className="demo-textscale-otp">
                <K.InputOtp length={6} value={code} onChange={setCode} label="Verification code" />
              </span>
            </K.Field>
            <K.Button block size="cta" onPress={() => {}}>Continue to secure checkout</K.Button>
          </div>
        </div>
      </div>

      <table className="demo-textscale-readings">
        <thead>
          <tr>
            <th scope="col">Part</th>
            <th scope="col">Box height</th>
            <th scope="col">At {pct}%</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((r) => (
            <tr key={r.name}>
              <th scope="row">{r.name}<span className="note">{r.note}</span></th>
              <td className="num">{r.height}px</td>
              <td>
                <span className="demo-textscale-verdict"
                  data-ok={r.past || r.spill ? "false" : "true"}>{verdict(r)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="note" role="status" aria-live="polite">{summary}</p>
      <p className="note">
        The slider multiplies the type roles inside the screen, which is what an OS text-scale
        setting does to roles declared in rem. Spacing, icon and target tokens are px and stay
        where they are, so a control that takes its height from a spacing constant alone cannot
        grow with its label. Nothing here is special-cased: the readings come from the rendered
        boxes, and what overflows is reported as overflowing.
      </p>
    </div>
  );
}
