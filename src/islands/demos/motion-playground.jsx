import React from "react";

/* Motion playground - the roles table above, played rather than listed.
 *
 * A table of durations and curves is complete and unreadable: nobody can tell `enter` from
 * `screen` by looking at two numbers and two curves. This sends one subject across a lane on the
 * role the reader picks, using the duration and the easing the contract resolves in this
 * document, and reports how long the run actually took.
 *
 * Nothing here is typed. Every value shown, and every value played, is read back out of the
 * custom properties tokens/motion.css emits, so the specimen cannot drift from the page it sits
 * under and a change to contract/motion.json changes what this demonstration does. The specimen
 * is not authority: it illustrates the table, and the table is what is true.
 *
 * The two schemes sit side by side on purpose. The overshoot in `celebrate` is not staged here:
 * it is in the easing the contract ships, a linear() curve with values above 1, so what a reader
 * sees is the spring itself arriving, passing its mark and settling back. The source demo this is
 * ported from had to approximate that with hand-written keyframes; this realization owns the
 * curve, so it plays the real one.
 *
 * Reduced motion is honoured twice over. The transition is dropped in JS while the query matches,
 * so the subject is simply at the end state on the next frame; and the stylesheet drops it again,
 * in case a first paint gets ahead of the effect. That is the collapse the page describes: the
 * end state arrives, without the journey.
 */

/* Names, not values. The roles are the contract's own, and each resolves through --motion-<role>. */
const ROLES = ["state", "enter", "exit", "emphasis", "screen", "press"];

/* The scales a resolved value is named against, so the readout can say "base" as well as show
   what base resolves to here. Under reduced motion several of these collapse onto one value and
   the first match wins, which is itself the honest report. */
const DURATIONS = ["instant", "fast", "base", "moderate", "slow", "slower", "slowest"]
  .map((name) => [name, "--duration-" + name]);

const EASINGS = [
  ["standard", "--ease-standard"],
  ["monoOut", "--ease-mono-out"],
  ["decelerate", "--ease-decelerate"],
  ["accelerate", "--ease-accelerate"],
  ["linear", "--ease-linear"],
];

const CALM = "--motion-";
const EXPRESSIVE = "--spring-celebrate";

/* ------------------------------------------------------------------ reading the cascade */

/* A custom property, read where the specimen actually sits, so density, theme and any scope the
   page puts around it are all in force. Browsers substitute var() at computed-value time, so this
   is usually a plain read; the recursion is there for the one that does not. */
function readVar(name, el) {
  if (!el) return "";
  return substitute(getComputedStyle(el).getPropertyValue(name).trim(), el, 0);
}

function substitute(value, el, depth) {
  if (!value || depth > 4 || value.indexOf("var(") === -1) return value;
  const next = value.replace(/var\(\s*(--[\w-]+)\s*(?:,([^()]*))?\)/g, (_m, name, fallback) =>
    getComputedStyle(el).getPropertyValue(name).trim() || (fallback ? fallback.trim() : ""));
  return substitute(next, el, depth + 1);
}

/* Split on top-level whitespace only. cubic-bezier() and linear() carry commas, and a browser is
   free to serialise them with a space after each one; splitting naively would tear a curve in
   half and then report the half as an easing. */
function words(value) {
  const out = [];
  let buffer = "";
  let depth = 0;
  for (const ch of value) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (depth === 0 && /\s/.test(ch)) {
      if (buffer) out.push(buffer);
      buffer = "";
    } else {
      buffer += ch;
    }
  }
  if (buffer) out.push(buffer);
  return out;
}

/* A role resolves to a duration and an easing, in either order as far as this is concerned. */
function splitPair(value) {
  const parts = words(value);
  const at = parts.findIndex((p) => /^[\d.]+m?s$/.test(p));
  return {
    duration: at === -1 ? "" : parts[at],
    easing: parts.filter((_p, i) => i !== at).join(" "),
  };
}

function toMs(value) {
  const n = parseFloat(value);
  if (!isFinite(n)) return 0;
  return /ms$/.test(value) ? n : n * 1000;
}

const flat = (value) => String(value).replace(/\s+/g, "");

/* The name the contract gives a resolved value, found by resolving the scale and comparing.
   Never by a table of literals kept in step by hand. */
function nameFor(value, scale, el) {
  if (!value) return "";
  const found = scale.find(([, token]) => flat(readVar(token, el)) === flat(value));
  return found ? found[0] : "";
}

/* ------------------------------------------------------------------ the specimen */

export function MotionPlayground({ K }) {
  const host = React.useRef(null);
  const puck = React.useRef(null);
  const startedAt = React.useRef(0);
  const calmId = React.useId();
  const springId = React.useId();

  const [pick, setPick] = React.useState({ scheme: "calm", role: "enter" });
  const [at, setAt] = React.useState("start");
  const [facts, setFacts] = React.useState(null);
  const [settled, setSettled] = React.useState(null);
  const [played, setPlayed] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  const token = pick.scheme === "celebrate" ? EXPRESSIVE : CALM + pick.role;

  /* The reader's own setting, live: a preference changed while the page is open is the same
     preference, and a specimen whose subject is motion should follow it without a reload. */
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    if (query.addEventListener) {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  const read = React.useCallback((name) => {
    const el = host.current || document.documentElement;
    const value = readVar(name, el);
    const pair = splitPair(value);
    return {
      token: name,
      value,
      duration: pair.duration,
      easing: pair.easing,
      durationName: nameFor(pair.duration, DURATIONS, el),
      easingName: nameFor(pair.easing, EASINGS, el),
      ms: toMs(pair.duration),
    };
  }, []);

  /* One effect per run: re-read what the run is about to use, then arm the fallback that closes
     the run off. transitionend is the measurement; the fallback is what reports a run that never
     transitioned at all, which is exactly what reduced motion produces. Its slack is the fast
     duration rather than a number invented here. */
  React.useEffect(() => {
    const current = read(token);
    setFacts(current);
    if (!played) return undefined;
    const slack = toMs(readVar("--duration-fast", host.current || document.documentElement));
    const timer = setTimeout(
      () => setSettled((s) => (s === null ? { jumped: true } : s)),
      current.ms + slack,
    );
    return () => clearTimeout(timer);
  }, [read, token, at, reduced, played]);

  const play = (scheme, role) => {
    startedAt.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    setSettled(null);
    setPlayed(true);
    setPick({ scheme, role });
    /* There and back, so a second press on the same role is a second run rather than nothing. */
    setAt((a) => (a === "start" ? "end" : "start"));
  };

  const onEnd = (event) => {
    if (event.propertyName !== "transform" || event.target !== puck.current) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    setSettled({ measured: Math.round(now - startedAt.current) });
  };

  const selected = (scheme, role) =>
    pick.scheme === scheme && (scheme !== "calm" || pick.role === role);

  const subject = pick.scheme === "celebrate" ? "celebrate spring" : pick.role + " role";
  const status = !facts
    ? "reading the resolved tokens"
    : subject + ": " + (facts.duration || "no duration") +
      (facts.durationName ? " (" + facts.durationName + ")" : "") + ", " +
      (facts.easingName || facts.easing || "no curve") +
      (reduced ? " \u2014 reduced motion is on, so the subject arrives without crossing" : "");

  const settleText = !played
    ? "pick a role to send the subject across"
    : settled === null
      ? "running"
      : settled.measured != null
        ? "settled in " + settled.measured + "ms, measured from the press"
        : "arrived with no transform transition \u2014 the collapse, not a slower move";

  return (
    <div className="demo demo-motion" data-at={at} ref={host}>
      <div className="demo-motion__track">
        <div className="demo-motion__rail">
          {/* Decorative: everything it has to say is said by the status line, which announces. */}
          <span className="demo-motion__puck" ref={puck} aria-hidden="true" onTransitionEnd={onEnd}
            style={{ transition: reduced ? "none" : "transform var(" + token + ")" }} />
        </div>
      </div>

      <p className="demo-motion__status" aria-live="polite">{status}</p>
      <p className="demo-motion__settle">{settleText}</p>

      {/* Resolved in this document, from the properties the contract emits. */}
      <dl className="demo-motion__facts">
        <div className="demo-motion__fact">
          <dt>token</dt>
          <dd>{facts ? facts.token : "\u2014"}</dd>
        </div>
        <div className="demo-motion__fact">
          <dt>duration</dt>
          <dd>{facts && facts.duration ? facts.duration : "\u2014"}</dd>
        </div>
        <div className="demo-motion__fact">
          <dt>easing</dt>
          <dd>{facts && facts.easing ? facts.easing : "\u2014"}</dd>
        </div>
      </dl>

      <div className="demo-motion__group" role="group" aria-labelledby={calmId}>
        <span className="demo-motion__legend" id={calmId}>calm roles</span>
        {ROLES.map((role) => (
          <K.Button key={role} variant={selected("calm", role) ? "primary" : "soft"}
            aria-pressed={selected("calm", role)} onPress={() => play("calm", role)}>{role}</K.Button>
        ))}
      </div>

      <div className="demo-motion__group" role="group" aria-labelledby={springId}>
        <span className="demo-motion__legend" id={springId}>expressive spring</span>
        <K.Button icon="like" variant={selected("celebrate") ? "primary" : "soft"}
          aria-pressed={selected("celebrate")}
          onPress={() => play("celebrate", pick.role)}>celebrate</K.Button>
        <span className="demo-motion__hint">
          A budget, not a style: a reaction landing, a purchase succeeding, going live.
        </span>
      </div>

      <p className="demo-motion__note">
        One subject, one reason, one run: the lane holds a single moving thing, because the page
        this sits on says chrome never staggers. The distance is whatever the lane measures, and
        only the duration and the curve come from the role, which is the whole of the difference
        being watched. The room at each end of the lane is where the spring overshoots before it
        settles. The settle figure is measured from the press, so it reads a frame or two over the
        role itself.
      </p>
    </div>
  );
}
