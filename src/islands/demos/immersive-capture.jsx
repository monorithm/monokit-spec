/* immersive-capture — the three commitments on one surface.
 *
 * A capture screen is the hardest immersion case and therefore the honest one: it has a subject
 * that owns every pixel, chrome that must sit over that subject without framing it, and a reason
 * for that chrome to leave. Everything this page states is visible here at once —
 *
 *   · the canvas is `--media-canvas` and nothing else, in both brightness modes. Flip the site
 *     theme with the surface open: the page around it repaints and the surface does not.
 *   · the subject is a DECLARED placeholder. This system ships no photography, so a specimen that
 *     faked a photo would be asserting a capability the Status page denies. It draws the media
 *     role glyph on the canvas and says what it is.
 *   · every layer is a real element, in paint order, and there is not one z-index in the stylesheet.
 *     Ordering across layers is solved by moving layers.
 *   · chrome recedes on `--delay-chrome-rest` and returns on intent — tap, focus, or a key that is
 *     consumed rather than passed to a control the reader cannot see.
 *
 * It is a specimen, not authority. Where it and the prose above disagree, the prose is right.
 */
import React from "react";

/* One subject per mode, and the chrome changes with it — voice has no camera, so it shows no
   camera affordances rather than showing dead ones. */
const MODES = [
  { id: "photo", label: "Photo", icon: "camera", subject: "One still frame",
    action: "Take a photo" },
  { id: "video", label: "Video", icon: "video", subject: "Moving image, with sound",
    action: "Record video" },
  { id: "voice", label: "Voice", icon: "mic", subject: "Sound alone — no camera",
    action: "Record voice" },
];

const POLICIES = [
  { id: "persistent", label: "Persistent",
    note: "Never auto-hides, however long the watch. Tap carries no chrome meaning, so the media rect is not a target here." },
  { id: "resting", label: "Resting",
    note: "Recedes after the idle delay and returns on intent. The timer resets on any interaction." },
  { id: "hidden", label: "Hidden",
    note: "Absent until summoned — the pre-roll state. Tap the subject to summon it." },
];

const LAYERS = [
  { id: "z0", name: "canvas",
    note: "The media canvas. The same fill in light and dark; there is nothing here to repaint." },
  { id: "z1", name: "content",
    note: "The subject, full-bleed and never letterboxed by chrome. A declared placeholder: no photography exists in this system." },
  { id: "z2", name: "scrims",
    note: "Ceiling and floor fades. Paint, not a surface — they take no pointer and they recede with the chrome they protect." },
  { id: "z3", name: "controls",
    note: "Glass chips and the capture rail, over the subject rather than around it." },
  { id: "z4", name: "overlays",
    note: "Nothing open. An open overlay would pin the chrome, because chrome may not recede beneath one." },
  { id: "z5", name: "system",
    note: "The banner. It paints above every other layer, and its arrival does not return receded chrome." },
];

/* A behavioural timing, read off the surface rather than typed here. The contract owns the idle
   delay and the toast hold; a specimen that restated either would become a second opinion about a
   number that already has an owner. */
function readTiming(el, name) {
  if (!el || typeof getComputedStyle !== "function") return 0;
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return raw.endsWith("ms") ? n : n * 1000;
}

/* A single-select group, used twice: for the capture mode on the rail and for the chrome policy
   beside the surface. A radiogroup with roving tabindex rather than a row of independent toggles,
   because these are one decision with three or four answers and a reader on a keyboard should be
   able to arrow through them the way the platform does. */
function Choice({ K, label, options, value, onChange, groupClassName, itemClassName,
  press = false, onNudge }) {
  const group = React.useRef(null);
  const pick = (id) => { onChange(id); if (onNudge) onNudge(); };
  const step = (delta) => {
    const at = options.findIndex((o) => o.id === value);
    const next = options[(at + delta + options.length) % options.length];
    pick(next.id);
    const el = group.current && group.current.querySelector('[data-choice="' + next.id + '"]');
    if (el) el.focus();
  };
  const onKeyDown = (e) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    step(delta);
  };
  /* On the surface the items are monokit targets, so they press like everything else there.
     Beside it they are page furniture, and a bare button is the right element for that. */
  const Item = press ? K.Pressable : "button";
  return (
    <div ref={group} role="radiogroup" aria-label={label} className={groupClassName}>
      {options.map((o) => {
        const on = o.id === value;
        const bind = press ? { onPress: () => pick(o.id) }
          : { type: "button", onClick: () => pick(o.id) };
        return (
          <Item key={o.id} className={itemClassName} data-choice={o.id} role="radio"
            aria-checked={on ? "true" : "false"} tabIndex={on ? 0 : -1}
            onKeyDown={onKeyDown} {...bind}>{o.label}</Item>
        );
      })}
    </div>
  );
}

export function ImmersiveCapture({ K }) {
  const frame = React.useRef(null);
  const [mode, setMode] = React.useState("photo");
  const [policy, setPolicy] = React.useState("resting");
  const [visible, setVisible] = React.useState(true);
  const [recording, setRecording] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [focusInChrome, setFocusInChrome] = React.useState(false);
  const [nudge, setNudge] = React.useState(0);
  const [banner, setBanner] = React.useState("");
  const [lit, setLit] = React.useState(null);
  const [note, setNote] = React.useState("resting — the chrome recedes when you stop");

  const active = MODES.find((m) => m.id === mode) || MODES[0];
  const policyNote = (POLICIES.find((p) => p.id === policy) || POLICIES[0]).note;

  /* The recede exceptions, in one expression so the readout and the timer cannot disagree about
     why the chrome is staying. Assistive technology would belong here too — it makes chrome
     persistent outright — but it is not detectable from a page, so the specification carries that
     clause and the specimen does not pretend to. */
  const pinnedBy = policy === "persistent" ? "the persistent policy"
    : hovering ? "a pointer over a control"
    : focusInChrome ? "keyboard focus inside the chrome"
    : null;

  const bump = (why) => { setNudge((n) => n + 1); if (why) setNote(why); };

  /* Recede. Restarted by `nudge`, which every interaction increments — that is the whole of "the
     timer resets on any interaction". */
  React.useEffect(() => {
    if (!visible || pinnedBy) return;
    /* No delay resolved means no token resolved, and chrome that vanished on a zero timer would
       be reporting a missing value as a behaviour. It stays. */
    const ms = readTiming(frame.current, "--delay-chrome-rest");
    if (!ms) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setNote("receded — the idle delay ran out, and it is a token, not a number typed here");
    }, ms);
    return () => clearTimeout(timer);
  }, [visible, pinnedBy, nudge]);

  React.useEffect(() => {
    setVisible(policy !== "hidden");
    setNote(policy === "hidden" ? "hidden — summon it from the subject"
      : policy === "persistent" ? "persistent — this policy never auto-hides"
      : "resting — the chrome recedes when you stop");
  }, [policy]);

  /* One subject at a time: changing it ends the take rather than carrying it across. */
  React.useEffect(() => { setRecording(false); }, [mode]);

  React.useEffect(() => {
    if (!banner) return;
    const ms = readTiming(frame.current, "--hold-toast");
    if (!ms) return;
    const timer = setTimeout(() => setBanner(""), ms);
    return () => clearTimeout(timer);
  }, [banner]);

  /* Tap to toggle. The target is the whole media rect and there is no dead zone in it, so this
     handler is the only meaning tap carries on this surface — one tap, one effect. */
  const tap = () => {
    const next = !visible;
    setVisible(next);
    bump(next ? "tap returned the chrome" : "tap sent the chrome away — one tap, one effect");
  };

  /* While the chrome is hidden the first key event returns it and is CONSUMED. Capture phase, so
     it lands before the control under focus ever sees it: a reader must never activate something
     they cannot see. */
  const onKeyDownCapture = (e) => {
    if (visible) { bump(); return; }
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
    bump("a key returned the chrome and was consumed — it reached no control");
  };

  const shutter = () => {
    if (mode === "photo") {
      setBanner("Saved to your library");
      bump("captured — the confirmation arrives at z5, over everything");
      return;
    }
    const next = !recording;
    setRecording(next);
    bump(next ? "recording — the indicator is subject truth, so it stays when the chrome goes"
      : "stopped — the indicator goes with the take, not with the chrome");
  };

  const status = [
    visible ? "chrome visible" : "chrome hidden",
    pinnedBy ? "pinned by " + pinnedBy : null,
    note,
  ].filter(Boolean).join(" · ");

  const layerClass = (id) => "demo-capture__layer demo-capture__" + id +
    (lit === id ? " demo-capture__lit" : "");

  const chip = (icon, label, extra) => (
    <K.Button variant="ghost" icon={icon} label={label} className="demo-capture__chip" {...extra} />
  );

  return (
    <div className="demo demo-capture">
      <div className="demo-capture__stage">
        <div ref={frame} className="demo-capture__frame mk-media-canvas"
          data-density="touch" data-mode={mode}
          data-chrome={visible ? "shown" : "hidden"}
          onKeyDownCapture={onKeyDownCapture}>

          {/* z0 — the canvas. The only layer that paints a fill, which is why the outline of every
              layer above it is visible through them. */}
          <div className={layerClass("z0")} data-layer="z0" aria-hidden="true" />

          {/* z1 — the subject, edge to edge. The placeholder declares itself rather than faking a
              photograph, and its caption is on-media muted ink over pure black, which passes. */}
          <div className={layerClass("z1")} data-layer="z1">
            <div className="mk-media-ph demo-capture__ph">
              <K.Icon name={active.icon} size="xl" decorative />
              <p className="mk-media-caption mk-on-media-muted demo-capture__ph-label">
                {active.subject}
              </p>
              <p className="mk-media-caption mk-on-media-muted demo-capture__ph-label">
                Declared placeholder — this system ships no photography
              </p>
            </div>
            {policy === "persistent" ? null : (
              <K.Pressable className="demo-capture__tap" onPress={tap}
                aria-label={visible ? "Hide the controls" : "Show the controls"} />
            )}
          </div>

          {/* z2 — scrims. Pointer-transparent, excluded from semantics, and never stacked: one
              state per media rect at a time. */}
          <div className={layerClass("z2")} data-layer="z2" aria-hidden="true">
            <div className="mk-scrim-ceiling" />
            <div className="mk-scrim-floor" />
          </div>

          {/* z3 — controls. Over the subject, translucent, and able to leave. */}
          <div className={layerClass("z3")} data-layer="z3"
            /* Hover is not a native input, so the pin is opt-in behind a real mouse: a touch
               reports pointerover too, and it never reports the leave that would release it. */
            onPointerOver={(e) => { if (e.pointerType === "mouse") setHovering(true); }}
            onPointerOut={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setHovering(false);
            }}
            onFocusCapture={() => { setFocusInChrome(true); setVisible(true); }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setFocusInChrome(false);
            }}>
            <div className="demo-capture__bar demo-capture__bar-top">
              {chip("close", "Close the capture surface",
                { onPress: () => bump("close is chrome — it never touches the subject") })}
              {mode === "voice" ? <span /> : chip("flash", "Flash", {
                "aria-pressed": flash ? "true" : "false",
                onPress: () => { setFlash(!flash); bump(); },
              })}
            </div>
            <div className="demo-capture__bar demo-capture__bar-bottom">
              <div className="demo-capture__shutter-row">
                <span className="demo-capture__side">
                  {mode === "voice" ? null
                    : chip("image", "Open the gallery", { onPress: () => bump() })}
                </span>
                <K.Pressable className="demo-capture__shutter" onPress={shutter}
                  aria-label={recording ? "Stop recording" : active.action}
                  aria-pressed={mode === "photo" ? undefined : (recording ? "true" : "false")}>
                  <span className="demo-capture__shutter-core" />
                </K.Pressable>
                <span className="demo-capture__side" />
              </div>
              <Choice K={K} press label="Capture mode" options={MODES} value={mode}
                onChange={setMode} onNudge={() => bump()}
                groupClassName="demo-capture__rail" itemClassName="demo-capture__mode" />
            </div>
          </div>

          {/* z3, and deliberately outside the group above: the recording indicator is subject
              truth, not convenience, so it does not recede. It earns its legibility from a glass
              chip rather than from the ceiling fade, which leaves with the rest of the chrome. */}
          {recording ? (
            <div className="demo-capture__truth" data-layer="z3">
              <span className="mk-glass demo-capture__truth-chip">
                <span className="demo-capture__dot" aria-hidden="true" />
                Recording
              </span>
            </div>
          ) : null}

          {/* z4 — present and empty, which is the point: this surface opens no overlay, and one
              that did would pin the chrome rather than recede beneath it. */}
          <div className={layerClass("z4")} data-layer="z4" aria-hidden="true" />

          {/* z5 — the only layer that may appear without user intent. Its arrival does not return
              the chrome: system messages do not reopen the cockpit. */}
          <div className={layerClass("z5")} data-layer="z5" role="status">
            {banner ? <span className="mk-glass mk-t-in demo-capture__banner">{banner}</span> : null}
          </div>
        </div>

        <p className="demo-capture__status" role="status">{status}</p>
        <p className="demo-capture__caption">
          Stop touching it and the chrome leaves. Tap the subject, or focus it and press any key —
          the key returns the chrome instead of firing a control you cannot see.
        </p>
      </div>

      <div className="demo-capture__panel">
        <p className="demo-capture__head">Layers on this surface</p>
        <ul className="demo-capture__legend">
          {LAYERS.map((l) => (
            <li key={l.id}>
              <button type="button" className="demo-capture__row"
                aria-pressed={lit === l.id ? "true" : "false"}
                onClick={() => setLit(lit === l.id ? null : l.id)}>
                <span className="demo-capture__tag">{l.id}</span>
                <span><b>{l.name}</b> — {l.note}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="demo-capture__head">Chrome policy</p>
        <Choice label="Chrome policy" options={POLICIES} value={policy} onChange={setPolicy}
          groupClassName="demo-capture__policies" itemClassName="demo-capture__policy" />
        <p className="demo-capture__note">{policyNote}</p>

        <button type="button" className="demo-capture__action"
          onClick={() => setBanner("Back online")}>Raise a system banner</button>
        <p className="demo-capture__note">
          Send one while the chrome is away. It paints at z5, above everything, and the chrome
          stays gone.
        </p>
      </div>
    </div>
  );
}
