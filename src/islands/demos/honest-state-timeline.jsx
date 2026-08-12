import React from "react";

/* honest-state-timeline — the command lifecycle played, rather than tabulated.
 *
 * The phase table on the states page can name pending, reconciling and succeeded, but it cannot
 * show that they are TIMED: a table renders every phase at once and none of them for any length
 * of time. This specimen runs one command down a visible track so the two rules the page states
 * can be watched instead of taken on trust:
 *
 *   one sweep means settled       the reconciling sweep is the system's own mk-shimmer keyframe
 *                                 with an iteration count of 1. A looping shimmer would mean
 *                                 loading, and the page spends that meaning elsewhere.
 *   no premature checkmark        success ink, the success label and the check are bound to the
 *                                 `succeeded` phase alone. `accepted` shows the same neutral
 *                                 badge pending shows, because the server holding your intent
 *                                 is not success.
 *
 * Force failure sends the same run to `stalled` instead: the optimistic render rolls back, the
 * badge reads the terminal copy the page prescribes, and the retry is the affordance.
 *
 * It is a specimen, not authority. Every duration is read from the motion tokens at run time
 * (see `ms`), and every colour resolves from a semantic token — so nothing here can become the
 * source of a value, and the reduced-motion redefinition of those same tokens collapses the
 * specimen's clock along with the motion it is timing.
 */

const MS_PER_SECOND = 1000;

/* Durations are read from the contract, never typed. `--duration-fast` acknowledges the press,
   `--loop-spinner` is one revolution of a pending indicator and stands in for the two waits on
   the server, and the sweep inside the reconciling window is `--duration-slowest` — the ceiling,
   spent once. They are read at the moment each step is scheduled rather than at mount, because
   the reduced-motion media query redefines them on :root and a reader can flip that setting
   with the page open. */
function ms(name) {
  if (typeof window === "undefined" || typeof getComputedStyle !== "function") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 0;
  return raw.endsWith("ms") ? n : raw.endsWith("s") ? n * MS_PER_SECOND : n;
}

const STOPS = ["Press", "Pending", "Reconciling", "Settled"];

/* Where each phase sits on the track. `stalled` sits on the reconciling stop because that is
   where the run stopped — it never reached the fourth. */
const STOP_OF = { pressed: 0, pending: 1, reconciling: 2, succeeded: 3, stalled: 2 };

/* Three commands, with copy from the fixed vocabulary the page publishes. The strings belong to
   the app; the slots belong to the system.
 *
 * Each one leads with an icon so that pending has a slot to swap: Button renders the spinner
 * where the icon was, which is what lets a pending button hold its width. Without the icon the
 * spinner is an extra child, and the specimen would jump exactly where the page says it does
 * not. */
const ACTIONS = [
  { id: "send", label: "Send", icon: "send", entity: "Message to Ama",
    pending: "Sending\u2026", settled: "Sent",
    stalled: "Couldn't send", stalledBadge: "Not sent" },
  { id: "publish", label: "Publish", icon: "upload", entity: "Draft: Kete weaving",
    pending: "Publishing\u2026", settled: "Published",
    stalled: "Couldn't publish", stalledBadge: "Not published" },
  { id: "buy", label: "Buy", icon: "cart", entity: "Order for two tickets",
    pending: "Processing\u2026", settled: "Paid",
    stalled: "Couldn't reach the payment server", stalledBadge: "Not charged" },
];

const DASH = " \u2014 ";

export function HonestStateTimeline({ K }) {
  const [phase, setPhase] = React.useState("idle");
  const [action, setAction] = React.useState(null);
  const [fail, setFail] = React.useState(false);
  /* A fresh key per run remounts the sweep, which is how a CSS animation is restarted without
     reaching into the DOM to force a reflow. */
  const [runId, setRunId] = React.useState(0);
  const [announce, setAnnounce] = React.useState(
    "Idle. Choose a command to run its lifecycle.");

  const stage = React.useRef(null);
  const timers = React.useRef([]);
  const uid = React.useId();
  const failId = uid + "-fail";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (delay, fn) => { timers.current.push(setTimeout(fn, delay)); };

  /* Every timer, on unmount and on restart. The specimen has to survive being mounted, unmounted
     and mounted again with a run in flight. */
  React.useEffect(() => clearTimers, []);

  /* `pending` disables the control it is on, and a focused element that becomes disabled drops
     focus to the body — so a keyboard reader who pressed Send would land back at the top of the
     document when the run settled. Focus goes back where it was left, and only if it was lost:
     a reader who has moved on is never dragged back.
   *
   * In an effect rather than in the timer that ends the run, because the control is still
   * rendered disabled at that point — React has not committed the terminal phase yet, and
   * focusing a disabled button does nothing at all. */
  React.useEffect(() => {
    if (phase !== "succeeded" && phase !== "stalled") return;
    const host = stage.current;
    if (!host || !action) return;
    if (document.activeElement && document.activeElement !== document.body) return;
    const el = host.querySelector('[data-action="' + action.id + '"]');
    if (el && el.focus) el.focus({ preventScroll: true });
  }, [phase, action]);

  const start = (which, willFail) => {
    clearTimers();
    setAction(which);
    setRunId((n) => n + 1);
    /* The press lands instantly and says nothing: it is the affordance answering, not a phase
       worth announcing. A live region that narrates every transition is the chatty failure the
       page warns about. */
    setPhase("pressed");

    after(ms("--duration-fast"), () => {
      setPhase("pending");
      setAnnounce(which.entity + DASH + "pending, " + which.pending);

      after(ms("--loop-spinner"), () => {
        setPhase("reconciling");
        setAnnounce(which.entity + DASH +
          "accepted. The server has it and the view is catching up. Not " +
          which.settled.toLowerCase() + " yet.");

        after(ms("--loop-spinner"), () => {
          if (willFail) {
            setPhase("stalled");
            setAnnounce(which.entity + DASH + which.stalled + ". " +
              which.stalledBadge + ". Retry to run it again.");
          } else {
            setPhase("succeeded");
            setAnnounce(which.entity + DASH + which.settled + ".");
          }
        });
      });
    });
  };

  const retry = () => {
    /* Retry re-runs the same command, and clears the forced failure so it can reach settled —
       the point of the affordance is that the user decides, and the decision has an outcome. */
    setFail(false);
    if (action) start(action, false);
  };

  const at = STOP_OF[phase];
  const running = phase === "pressed" || phase === "pending" || phase === "reconciling";
  const inFlight = phase === "pending" || phase === "reconciling";

  const stopState = (i) => {
    if (phase === "idle") return "todo";
    if (phase === "stalled") return i < 2 ? "done" : i === 2 ? "failed" : "todo";
    if (i < at) return "done";
    if (i > at) return "todo";
    return phase === "succeeded" ? "done" : "active";
  };

  const badge = phase === "reconciling" ? "Accepted"
    : phase === "pending" ? action.pending
    : phase === "stalled" ? action.stalledBadge
    : null;

  return (
    <div className="demo demo-honest-state-timeline" data-density="touch" data-phase={phase}
      ref={stage}>
      <div className="hst-controls" role="group" aria-label="Run a command lifecycle">
        {ACTIONS.map((a) => (
          <K.Button key={a.id} data-action={a.id} icon={a.icon}
            variant={a.id === "send" ? "primary" : "secondary"}
            pending={running && action.id === a.id}
            onPress={() => start(a, fail)}>{a.label}</K.Button>
        ))}
        <span className="hst-fail">
          <K.Switch id={failId} checked={fail} onChange={setFail} label="Force failure" />
          <label className="hst-fail-name" htmlFor={failId}>Force failure</label>
        </span>
      </div>

      {/* The track is readable at any moment rather than only when it moves: the stop names are
          text, and the current one carries aria-current, which does not announce on its own. */}
      <ol className="hst-track">
        {STOPS.map((name, i) => (
          <li key={name} className="hst-stop" data-state={stopState(i)}
            aria-current={phase !== "idle" && i === at ? "step" : undefined}>
            <span className="hst-dot" aria-hidden="true" />
            <span>{name}</span>
          </li>
        ))}
      </ol>

      <div className="hst-entity">
        {/* One sweep. The element is remounted per run and the animation declares an iteration
            count of 1, so it can only play once; under reduced motion it degrades to a tint that
            fades in and out with the phase. */}
        <span key={runId} className="hst-sweep"
          data-sweeping={phase === "reconciling" ? "true" : "false"} aria-hidden="true" />
        <span className="hst-entity-name">
          {action ? action.entity : "No command running"}
        </span>
        {badge ? (
          <span className="hst-badge" data-tone={phase === "stalled" ? "warning" : "neutral"}>
            {inFlight ? <span className="hst-badge-dot" aria-hidden="true" /> : null}
            {badge}
          </span>
        ) : null}
        {/* Bound to `succeeded`, and to nothing else. */}
        {phase === "succeeded" ? (
          <span className="hst-settled">
            <K.Icon name="check" size="sm" decorative />
            {action.settled}
          </span>
        ) : null}
      </div>

      {phase === "stalled" ? (
        <div className="hst-stalled">
          <K.Icon name="warning" size="sm" decorative />
          <span className="hst-stalled-msg">{action.stalled}</span>
          <K.Button className="hst-retry" variant="secondary" icon="refresh"
            onPress={retry}>Retry</K.Button>
        </div>
      ) : null}

      {/* Same truth, same moment, for readers who cannot see the track. */}
      <p className="demo-log hst-status" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
      <p className="hst-note">
        Force failure rolls the next run back instead of settling it. Retry runs the same command
        again.
      </p>
    </div>
  );
}
