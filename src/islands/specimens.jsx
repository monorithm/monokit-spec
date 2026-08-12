/* The live specimens — every interactive example, anatomy diagram and states matrix on the site.
 *
 * Lifted from the single-file workbench this site replaced. Every builder is unchanged; the one
 * edit is in `Anatomy`, which had a latent measurement bug — see the note there.
 *
 * The builders take the component set as a prop (`{ K }`) rather than importing it, which is what
 * let them move without edits: `mount.jsx` assembles K from real ESM imports and hands it over,
 * where the workbench assembled it by fetching and transpiling the same .jsx files in the browser.
 *
 * Keep that shape. A builder that imports a component directly stops being movable, and these
 * have already survived one relocation intact.
 */
import React from "react";

/* Numbered callouts positioned over a real rendered component. The pins are placed against
   the live element's own box, so the diagram cannot drift from the code.
 *
 * Measuring once on mount is not enough, and the failure is silent. IBM Plex is served with
 * `font-display: swap`, so first layout uses fallback metrics: every pin was measured against a
 * button of the wrong width, and when the real font landed the component moved out from under
 * them — pin 1 sat 210px to the left of the target it was labelling. A diagram whose whole claim
 * is that it cannot drift from the code must not drift from the code.
 *
 * So: measure after the fonts settle, and again whenever the stage changes size. The observer
 * covers font swap, window resize, and the density and direction toggles the specimens carry. */
function Anatomy({ children, parts, surface = false }) {
  const ref = React.useRef(null);
  const [pins, setPins] = React.useState([]);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const measure = () => {
      const box = host.getBoundingClientRect();
      setPins(parts.map((p, i) => {
        const el = host.querySelector(p.selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        /* offset pushes the pin clear of the element edge so several pins on a small target
           do not sit on top of each other or obscure the thing they annotate */
        const [ox, oy] = p.offset ?? [0, 0];
        return { n: i + 1, label: p.label,
          x: r.left - box.left + r.width * (p.at?.[0] ?? 0.5) + ox,
          y: r.top - box.top + r.height * (p.at?.[1] ?? 0.5) + oy };
      }).filter(Boolean));
    };

    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(host);
    for (const part of parts) {
      const el = host.querySelector(part.selector);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [parts]);
  return (
    <div className="anatomy-wrap">
      <div className="anatomy-stage" data-surface={surface ? "true" : undefined} ref={ref}>
        {children}
        {pins.map((p) => (
          <span key={p.n} className="pin" style={{ left: p.x, top: p.y }} aria-hidden="true">{p.n}</span>
        ))}
      </div>
      <ol className="anatomy-key">
        {parts.map((p, i) => <li key={i}><span className="pin static">{i + 1}</span> {p.label}</li>)}
      </ol>
    </div>
  );
}

const EXAMPLES = {
  "pressable-basic": function PressableBasic({ K }) {
    const [log, setLog] = React.useState("no interaction yet");
    return (
      <div className="demo">
        <K.Pressable as="div" scale
          onPress={() => setLog("press")}
          onLongPress={() => setLog("long press, recognised at 500ms")}
          className="demo-target">Press, or press and hold</K.Pressable>
        <p className="demo-log">{log}</p>
      </div>
    );
  },
  "modal-bare": function ModalBare({ K }) {
    return <ModalDemo K={K} label="Open a bare modal" render={(close) => (
      <K.Modal onClose={close} label="A bare modal" barrierLabel="Close the bare modal">
        <div role="dialog" aria-modal="true" aria-label="A bare modal" tabIndex={-1}
          className="spec-modal">
          <h3 className="spec-modal-title">Nothing but the trap</h3>
          <p className="spec-modal-body">Tab from here. Focus moves through these two controls, then
          to the barrier, then wraps. It never reaches the page behind.</p>
          <div className="spec-modal-actions">
            <K.Button variant="ghost" onPress={close}>Cancel</K.Button>
            <K.Button onPress={close}>Done</K.Button>
          </div>
        </div>
      </K.Modal>
    )} />;
  },

  "modal-observable": function ModalObservable({ K }) {
    const [cycle, setCycle] = React.useState([]);
    const surface = React.useRef(null);
    return <ModalDemo K={K} label="Open and watch it" render={(close) => (
      <K.Modal onClose={close} label="What the trap is doing"
        barrierLabel="Close the observed modal">
        <div role="dialog" aria-modal="true" aria-label="What the trap is doing" tabIndex={-1}
          className="spec-modal spec-modal-wide" ref={surface}>
          <CyclePins K={K} layerRef={surface} />
          <CycleList K={K} surfaceRef={surface} onRead={setCycle} />
          <h3 className="spec-modal-title">Tab, and watch all three</h3>
          <div className="spec-watch">
            <section>
              <h4>Cycle order</h4>
              <ol className="spec-cycle">
                {cycle.map((c, i) => (
                  <li key={i}><span className="pin static">{i + 1}</span>{c}</li>
                ))}
              </ol>
            </section>
            <section>
              <h4>Background</h4>
              <BackgroundProbe />
              <p className="spec-modal-body">Tab through the numbered stops and watch the ring:
              after the last one it returns to 1 rather than leaving.</p>
            </section>
          </div>
          <div className="spec-modal-actions">
            <K.Button variant="ghost" onPress={close}>Cancel</K.Button>
            <K.Button onPress={close}>Done</K.Button>
          </div>
        </div>
      </K.Modal>
    )} />;
  },

  "modal-sheet": function ModalSheet({ K }) {
    return <ModalDemo K={K} label="Open a sheet" render={(close) => (
      <K.Sheet open onClose={close} title="Select country"
        footer={<div style={{ padding: "0 var(--page-inset) var(--space-16)" }}>
          <K.Button onPress={close}>Done</K.Button></div>}>
        {["Ghana", "Nigeria", "Kenya", "South Africa"].map((c) => (
          <K.ListRow key={c} title={c} chevron onPress={close} />
        ))}
      </K.Sheet>
    )} />;
  },

  "pressable-density": function PressableDensity({ K }) {
    return (
    <div className="demo demo-split">
      {["touch", "pointer"].map((d) => (
        <div key={d} data-density={d} className="demo-scope">
          <p className="demo-scope-label">{d}</p>
          <K.Button onPress={() => {}}>Continue</K.Button>
          <K.Button variant="ghost" icon="back" label="Back" />
        </div>
      ))}
    </div>
    );
  },
};

/* Modal specimens. Every one of these opens a real trap over the whole page, because that is what
   a modal does — a contained demonstration would be demonstrating something else. Everything a
   reader needs while it is open therefore lives INSIDE it. */
function ModalDemo({ K, render, label = "Open" }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <div className="demo">
      <K.Button onPress={() => setOpen(true)}>{label}</K.Button>
      <p className="demo-log">{open ? "open — Tab cycles, Escape closes" : "closed"}</p>
      {open ? render(close) : null}
    </div>
  );
}

/* Numbered pins on named parts of the open layer, with the key rendered inside the surface —
   anything outside is excluded while the trap holds, so a key placed there would be unreadable
   exactly when it is needed. */
function PartPins({ surfaceRef, parts }) {
  const [pins, setPins] = React.useState([]);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const layer = surfaceRef.current && surfaceRef.current.closest(".mk-modal-layer");
      if (!layer) return;
      const box = layer.getBoundingClientRect();
      setPins(parts.map((p, i) => {
        const el = p.selector === ":layer" ? layer : layer.querySelector(p.selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { n: i + 1,
          x: r.left - box.left + r.width * (p.at ? p.at[0] : 0.5) + (p.offset ? p.offset[0] : 0),
          y: r.top - box.top + r.height * (p.at ? p.at[1] : 0.5) + (p.offset ? p.offset[1] : 0) };
      }).filter(Boolean));
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {pins.map((p) => (
        <span key={p.n} className="pin" style={{ position: "fixed", left: p.x, top: p.y }}
          aria-hidden="true">{p.n}</span>
      ))}
    </>
  );
}

/* The cycle, read from the trap's own focusable query so the list and the behaviour cannot
   disagree. Deferred a tick: child effects run before the parent's, so the layer is not armed yet
   at mount time. */
function CycleList({ K, surfaceRef, onRead }) {
  React.useEffect(() => {
    const t = setTimeout(() => {
      const layer = surfaceRef.current && surfaceRef.current.closest(".mk-modal-layer");
      if (!layer) return;
      onRead(K.modalFocusables(layer).map((el) =>
        el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24) || el.tagName));
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return null;
}

/* Numbered pins in tab-cycle order, drawn from the trap's own focusable query. */
function CyclePins({ K, layerRef }) {
  const [pins, setPins] = React.useState([]);
  React.useEffect(() => {
    const layer = layerRef.current && layerRef.current.closest(".mk-modal-layer");
    if (!layer) return;
    /* Placed after layout settles, for the same reason the probe is deferred. */
    const box = layer.getBoundingClientRect();
    setPins(K.modalFocusables(layer).map((el, i) => {
      const r = el.getBoundingClientRect();
      return { n: i + 1, x: r.left - box.left + r.width / 2, y: r.top - box.top,
        name: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 18) || el.tagName };
    }));
  }, []);
  return (
    <>
      {pins.map((p) => (
        <span key={p.n} className="pin" style={{ position: "absolute", left: p.x, top: p.y }}
          aria-hidden="true">{p.n}</span>
      ))}
    </>
  );
}

const STATES = {
  pressable: function PressableStates({ K }) {
    const rows = [
      ["rest", {}], ["pending", { pending: true }], ["disabled", { disabled: true }],
    ];
    return (
      <div className="demo state-grid">
        {rows.map(([name, props]) => (
          <div key={name} className="state-cell">
            <K.Button {...props} onPress={() => {}}>Continue</K.Button>
            <span className="sw-name">{name}</span>
          </div>
        ))}
        <div className="state-cell">
          <K.Button onPress={() => {}}>Press me</K.Button>
          <span className="sw-name">pressed — hold to see it</span>
        </div>
      </div>
    );
  },
};

function BackgroundProbe() {
  const [result, setResult] = React.useState(null);
  /* Deferred by a tick on purpose. React runs child effects BEFORE parent effects, so measuring
     here directly would measure the page before Modal has excluded anything — and report a trap
     that works as a trap that does not. */
  React.useEffect(() => {
    const t = setTimeout(() => {
      const layer = document.querySelector(".mk-modal-layer");
      const outside = Array.prototype.filter.call(
        document.querySelectorAll("a[href],button,input"), (el) => !layer || !layer.contains(el));
      const before = document.activeElement;
      const reachable = outside.filter((el) => { el.focus(); return document.activeElement === el; });
      if (before && before.focus) before.focus({ preventScroll: true });
      setResult({ total: outside.length, reachable: reachable.length });
    }, 0);
    return () => clearTimeout(t);
  }, []);
  if (!result) return <p className="spec-focus">measuring…</p>;
  return (
    <p className="spec-focus" data-ok={result.reachable === 0 ? "true" : "false"}>
      {result.reachable} of {result.total} controls behind this modal can take focus
    </p>
  );
}

const MODAL_PARTS = [
  { selector: ":layer", label: "The layer — fixed to the viewport, at the modal elevation tier",
    at: [0.12, 0.12] },
  { selector: ".mk-modal-barrier", label: "The barrier — a labelled button, not a scrim with a handler",
    at: [0.82, 0.22] },
  { selector: '[role="dialog"]', label: "The surface — named, focused on open, and where the cycle lives",
    at: [0.5, 0], offset: [0, -14] },
  { selector: ".spec-modal-actions", label: "The dismiss control — last stop in the cycle before it wraps",
    at: [1, 0.5], offset: [16, 0] }
];

const ICON_SHOWCASE = [
  ["back", "navigate"], ["search", "find"], ["like", "react"], ["send", "act"],
  ["camera", "capture"], ["cart", "commerce"], ["notification", "system"], ["settings", "chrome"]
];

const ICON_EXAMPLES = {
  "icon-roles": function IconRoles({ K }) {
    const [active, setActive] = React.useState("like");
    return (
      <div className="demo icon-grid">
        {ICON_SHOWCASE.map(([role, group]) => (
          <button key={role} type="button" className="icon-cell"
            data-on={active === role ? "true" : "false"} onClick={() => setActive(role)}>
            <K.Icon name={role} size="md" active={active === role} decorative />
            <span className="sw-name">{role}</span>
            <span className="sw-val">{group}</span>
          </button>
        ))}
      </div>
    );
  },

  "icon-density": function IconDensity({ K }) {
    return (
      <div className="demo demo-split">
        {["touch", "pointer"].map((d) => (
          <div key={d} data-density={d} className="demo-scope">
            <p className="demo-scope-label">{d}</p>
            <span className="icon-row"><K.Icon name="search" decorative /> Search</span>
            <span className="icon-row"><K.Icon name="settings" decorative /> Settings</span>
            <span className="spec-meta" data-spec-token="--icon-chrome" data-spec-scope={"[data-density='" + d + "']"}
              data-spec-prefix="resolved "></span>
          </div>
        ))}
      </div>
    );
  },

  "icon-states": function IconStates({ K }) {
    const rows = [["rest", {}], ["active", { active: true }]];
    return (
      <div className="demo state-grid">
        {rows.map(([label, props]) => (
          <div key={label} className="state-cell">
            <span className="icon-row"><K.Icon name="like" size="lg" decorative {...props} /></span>
            <span className="sw-name">{label}</span>
          </div>
        ))}
        <div className="state-cell" style={{ opacity: 0.5 }}>
          <span className="icon-row"><K.Icon name="like" size="lg" decorative /></span>
          <span className="sw-name">disabled</span>
        </div>
        <div className="state-cell">
          <span className="icon-row" style={{ color: "var(--live)" }}>
            <K.Icon name="like" size="lg" active decorative /></span>
          <span className="sw-name">liked — outlined, never filled</span>
        </div>
      </div>
    );
  },

  "icon-absent": function IconAbsent({ K }) {
    const absent = (window.MonokitIconAbsent || []);
    return (
      <div className="demo icon-grid">
        {absent.map((role) => (
          <div key={role} className="icon-cell" data-absent="true">
            <K.Icon name={role} size="md" decorative />
            <span className="sw-name">{role}</span>
            <span className="sw-val">no glyph</span>
          </div>
        ))}
      </div>
    );
  }
};

Object.assign(EXAMPLES, ICON_EXAMPLES);

const LIST_EXAMPLES = {
  "list-group": function ListGroupDemo({ K }) {
    const [on, setOn] = React.useState(true);
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 360 }}>
        <K.ListGroup header="Permissions" footer="You can change these later in Settings.">
          <K.ListRow icon="camera" title="Camera" subtitle="Take photos and go live"
            trailing={<K.Switch checked={on} onChange={setOn} label="Camera" />} />
          <K.ListRow icon="notification" title="Notifications" subtitle="Order updates and replies"
            trailing={<K.Switch checked={false} onChange={() => {}} label="Notifications" />} />
        </K.ListGroup>
      </div>
    );
  },

  "list-row": function ListRowDemo({ K }) {
    const [log, setLog] = React.useState("no interaction yet");
    const host = React.useRef(null);
    /* Reads the pressed row rather than restating what it should measure. The typed version stated
       a separator inset for the last row in the group, which has none, and the other number was
       width-dependent — page-inset moves with the width class. */
    const report = (index, kind) => {
      const rows = host.current ? host.current.querySelectorAll(".mk-row") : [];
      const row = rows[index];
      if (!row) return setLog(kind + " row pressed");
      const inset = getComputedStyle(row, "::after").insetInlineStart;
      setLog(kind + " row pressed \u2014 " +
        (row.dataset.separator === "true" && inset !== "auto"
          ? "separator from " + inset
          : "last in the group, so no separator"));
    };
    return (
      <div className="demo demo-surface" data-density="touch" ref={host} style={{ maxWidth: 360 }}>
        <K.ListGroup header="Recent">
          <K.ListRow leading={<K.Avatar size={40} />} title="Ama Boateng"
            subtitle="Sent you a voice note" value="14:02" chevron
            onPress={() => report(0, "Avatar")} />
          <K.ListRow icon="settings" title="Account settings" chevron
            onPress={() => report(1, "Icon")} />
        </K.ListGroup>
        <p className="demo-log" style={{ padding: "var(--space-12) var(--page-inset)" }}>{log}</p>
      </div>
    );
  },

  "list-row-density": function ListRowDensity({ K }) {
    return (
      <div className="demo demo-split">
        {["touch", "pointer"].map((d) => (
          <div key={d} data-density={d} className="demo-scope" style={{ display: "block", padding: 0 }}>
            <p className="demo-scope-label" style={{ padding: "var(--space-8) var(--page-inset) 0" }}>{d}</p>
            <K.ListRow icon="settings" title="Account settings" subtitle="Two-line row" chevron
              onPress={() => {}} />
            <span className="spec-meta" style={{ padding: "0 var(--page-inset)", display: "block" }}
              data-spec-token="--row-2" data-spec-scope={"[data-density='" + d + "']"}
              data-spec-prefix="two-line row "></span>
          </div>
        ))}
      </div>
    );
  }
};

Object.assign(EXAMPLES, LIST_EXAMPLES);

const CORE_EXAMPLES = {
  "button-variants": function ButtonVariants({ K }) {
    const variants = ["primary", "soft", "secondary", "outline", "ghost", "destructive", "link"];
    return (
      <div className="demo" data-density="touch">
        {variants.map((v) => (
          <K.Button key={v} variant={v === "primary" ? undefined : v} onPress={() => {}}>
            {v === "destructive" ? "Delete" : v === "link" ? "Learn more" : "Continue"}
          </K.Button>
        ))}
      </div>
    );
  },
  "button-density": function ButtonDensity({ K }) {
    return (
      <div className="demo demo-split">
        {["touch", "pointer"].map((d) => (
          <div key={d} data-density={d} className="demo-scope">
            <p className="demo-scope-label">{d}</p>
            <K.Button onPress={() => {}}>Continue</K.Button>
            <K.Button variant="ghost" icon="back" label="Back" />
            <span className="spec-meta" data-spec-token="--row-1"
              data-spec-scope={"[data-density='" + d + "']"} data-spec-prefix="height " />
          </div>
        ))}
      </div>
    );
  },
  "input-basic": function InputBasic({ K }) {
    const [v, setV] = React.useState("");
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <div style={{ padding: "var(--space-16) var(--page-inset)" }}>
          <K.Field label="Phone number" hint="We'll send a code to this number.">
            <K.Input value={v} onChange={setV} placeholder="024 000 0000" inputMode="tel" />
          </K.Field>
        </div>
      </div>
    );
  },
  "field-states": function FieldStates({ K }) {
    const [v, setV] = React.useState("024 000");
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <div style={{ padding: "var(--space-16) var(--page-inset)", display: "grid", gap: "var(--space-20)" }}>
          <K.Field label="Phone number" hint="We'll send a code to this number.">
            <K.Input value={v} onChange={setV} />
          </K.Field>
          <K.Field label="Phone number" error="That number is too short — check the digits.">
            <K.Input value={v} onChange={setV} invalid />
          </K.Field>
        </div>
      </div>
    );
  },
  "otp-basic": function OtpBasic({ K }) {
    const [code, setCode] = React.useState("4128");
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <div style={{ padding: "var(--space-16) var(--page-inset)" }}>
          <K.Field label="Verification code" hint="Resend in 0:42">
            <K.InputOtp length={6} value={code} onChange={setCode} />
          </K.Field>
        </div>
      </div>
    );
  },
  "switch-basic": function SwitchBasic({ K }) {
    const [on, setOn] = React.useState(true);
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <K.ListGroup header="Notifications">
          <K.ListRow icon="notification" title="Order updates" subtitle="Applies immediately"
            trailing={<K.Switch checked={on} onChange={setOn} label="Order updates" />} />
          <K.ListRow icon="chat" title="Replies"
            trailing={<K.Switch checked={false} onChange={() => {}} label="Replies" />} />
        </K.ListGroup>
      </div>
    );
  },
  "switch-density": function SwitchDensity({ K }) {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(true);
    const pair = [[a, setA], [b, setB]];
    return (
      <div className="demo demo-split">
        {["touch", "pointer"].map((d, i) => (
          <div key={d} data-density={d} className="demo-scope">
            <p className="demo-scope-label">{d}</p>
            <K.Switch checked={pair[i][0]} onChange={pair[i][1]} label={"Toggle at " + d} />
            <span className="spec-meta" data-spec-token="--min-target"
              data-spec-scope={"[data-density='" + d + "']"} data-spec-prefix="target " />
          </div>
        ))}
      </div>
    );
  },
  "sheet-basic": function SheetBasic({ K }) {
    return <ModalDemo K={K} label="Open the sheet" render={(close) => (
      <K.Sheet open onClose={close} title="Select country"
        footer={<div style={{ padding: "0 var(--page-inset) var(--space-16)" }}>
          <K.Button onPress={close}>Done</K.Button></div>}>
        {["Ghana", "Nigeria", "Kenya"].map((c) => (
          <K.ListRow key={c} title={c} chevron onPress={close} />
        ))}
      </K.Sheet>
    )} />;
  },
  "screen-basic": function ScreenBasic({ K }) {
    return (
      <div className="demo demo-surface">
        <div className="frame frame-sm" data-density="touch"
          style={{ width: 300, height: 380, position: "relative", overflow: "hidden" }}>
          <K.Screen header={<K.ScreenHeader title="Settings" onBack={() => {}} />}
            footer={<K.Button onPress={() => {}}>Save changes</K.Button>}>
            <K.ListGroup header="Account">
              <K.ListRow leading={<K.Avatar size={40} />} title="Ama Boateng" subtitle="Signed in"
                chevron onPress={() => {}} />
              <K.ListRow icon="settings" title="Preferences" chevron onPress={() => {}} />
            </K.ListGroup>
          </K.Screen>
        </div>
      </div>
    );
  },
  "header-basic": function HeaderBasic({ K }) {
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <K.ScreenHeader title="Settings"
          action={<K.Button variant="ghost" icon="more" label="More options" />} />
        <div style={{ padding: "var(--space-12) var(--page-inset) var(--space-20)" }}>
          <p className="mk-row-sub" style={{ margin: 0 }}>
            A leading title starts on this column &mdash; the header pads to the page inset, so chrome
            begins where body text begins.
          </p>
        </div>
        <K.ScreenHeader title="Settings" onBack={() => {}}
          action={<K.Button variant="ghost" icon="more" label="More options" />} />
        <div style={{ padding: "var(--space-12) var(--page-inset)" }}>
          <p className="mk-row-sub" style={{ margin: 0 }}>
            A back affordance occupies that column, and the title follows it.
          </p>
        </div>
      </div>
    );
  },
  "pager-basic": function PagerBasic({ K }) {
    const [i, setI] = React.useState(0);
    return (
      <div className="demo demo-surface" data-density="touch" style={{ maxWidth: 340 }}>
        <K.Pager index={i} onIndexChange={setI}>
          {["Discover", "Watch", "Buy"].map((t) => (
            <div key={t} style={{ display: "grid", placeItems: "center", height: 160,
              fontSize: "var(--text-headline-medium)", fontWeight: "var(--weight-semibold)" }}>{t}</div>
          ))}
        </K.Pager>
        <div style={{ display: "grid", placeItems: "center", paddingBottom: "var(--space-16)" }}>
          <K.PageDots count={3} index={i} />
        </div>
      </div>
    );
  },
  "dots-basic": function DotsBasic({ K }) {
    const [i, setI] = React.useState(1);
    return (
      <div className="demo" data-density="touch">
        <K.PageDots count={4} index={i} />
        <K.Button variant="ghost" onPress={() => setI((n) => (n + 1) % 4)}>Advance</K.Button>
      </div>
    );
  },
  "avatar-sizes": function AvatarSizes({ K }) {
    return (
      <div className="demo" data-density="touch">
        {[24, 32, 40, 56, 72].map((s) => (
          <div key={s} style={{ display: "grid", gap: "var(--space-8)", justifyItems: "center" }}>
            <K.Avatar size={s} />
            <span className="sw-val">{s}</span>
          </div>
        ))}
      </div>
    );
  },
  "avatar-attached": function AvatarAttached({ K }) {
    return (
      <div className="demo" data-density="touch">
        <K.Avatar size={72} edit />
        <p className="demo-log">Trailing-bottom, so it mirrors under right-to-left</p>
      </div>
    );
  }
};

Object.assign(EXAMPLES, CORE_EXAMPLES, {
  "states-pending": function StatesPending({ K }) {
    const [phase, setPhase] = React.useState("rest");
    const send = () => {
      setPhase("pending");
      setTimeout(() => setPhase("succeeded"), 1600);
      setTimeout(() => setPhase("rest"), 3200);
    };
    return (
      <div className="demo" data-density="touch">
        <K.Button pending={phase === "pending"} onPress={send}>
          {phase === "pending" ? "Sending…" : phase === "succeeded" ? "Sent" : "Send"}
        </K.Button>
        <p className="demo-log">
          {phase === "pending" ? "pending — width preserved, input disabled, still visibly alive"
            : phase === "succeeded" ? "succeeded — the affordance removes and the entity settles"
            : "press to watch the phase change"}
        </p>
      </div>
    );
  },
  "states-terminal": function StatesTerminal({ K }) {
    /* Rejected and stalled side by side, because the difference is the whole point. */
    return (
      <div className="demo demo-split">
        <div className="demo-scope" style={{ display: "block" }}>
          <p className="demo-scope-label">rejected — the domain said no</p>
          <div style={{ background: "var(--destructive-soft)", color: "var(--destructive-text)",
            borderRadius: "var(--radius-md)", padding: "var(--space-12)",
            fontSize: "var(--text-body-medium)" }}>
            That number is already registered. Sign in instead, or use another number.
          </div>
        </div>
        <div className="demo-scope" style={{ display: "block" }}>
          <p className="demo-scope-label">stalled — transport gave up</p>
          <div style={{ background: "var(--warning-soft)", color: "var(--warning-text)",
            borderRadius: "var(--radius-md)", padding: "var(--space-12)",
            fontSize: "var(--text-body-medium)" }}>
            Couldn't send — tap to retry.
          </div>
        </div>
      </div>
    );
  }
});

Object.assign(STATES, {
  button: function ButtonStates({ K }) {
    const rows = [["rest", {}], ["pending", { pending: true }], ["disabled", { disabled: true }]];
    return (
      <div className="demo state-grid" data-density="touch">
        {rows.map(([name, props]) => (
          <div key={name} className="state-cell">
            <K.Button {...props} onPress={() => {}}>{props.pending ? "Sending…" : "Continue"}</K.Button>
            <span className="sw-name">{name}</span>
          </div>
        ))}
      </div>
    );
  },
  input: function InputStates({ K }) {
    const rows = [["rest", {}], ["invalid", { invalid: true }], ["disabled", { disabled: true }]];
    return (
      <div className="demo state-grid demo-surface" data-density="touch"
        style={{ padding: "var(--space-16)" }}>
        {rows.map(([name, props]) => (
          <div key={name} className="state-cell" style={{ width: "100%" }}>
            <K.Input value="024 000 0000" onChange={() => {}} {...props} />
            <span className="sw-name">{name}</span>
          </div>
        ))}
      </div>
    );
  }
});

const ANATOMY = {
  button: function ButtonAnatomy({ K }) {
    return (
      <Anatomy parts={[
        { selector: ".mk-btn", label: "The target — the density minimum in both axes, whatever the label's width",
          at: [0, 0], offset: [-18, -18] },
        { selector: ".mk-btn .mk-icon", label: "Leading icon, sized from density unless declared",
          at: [0.5, 0], offset: [0, -22] },
        /* Button renders its label as a bare text child, so the specimen supplies a span to pin —
           the same technique the icon anatomy uses. Pinning .mk-btn would double up with pin 1. */
        { selector: ".btn-anat-label", label: "Label — a verb naming the outcome, and the accessible name when icon-only",
          at: [0.5, 1], offset: [0, 22] }
      ]}>
        <K.Button icon="check" onPress={() => {}}>
          <span className="btn-anat-label">Continue</span>
        </K.Button>
      </Anatomy>
    );
  },

  field: function FieldAnatomy({ K }) {
    const [v, setV] = React.useState("024 000");
    return (
      <Anatomy surface parts={[
        { selector: ".mk-field-label", label: "Label — associated with the control, so tapping it reaches the control",
          at: [0.15, 0], offset: [0, -16] },
        { selector: ".mk-input", label: "Exactly one control. Two decisions are two fields",
          at: [1, 0.5], offset: [18, 0] },
        { selector: ".mk-field-error", label: "One message slot — hint or error, never stacked",
          at: [0.15, 1], offset: [0, 16] }
      ]}>
        <div data-density="touch" style={{ width: 300, padding: "0 var(--page-inset)" }}>
          <K.Field label="Phone number" error="That number is too short — check the digits.">
            <K.Input value={v} onChange={setV} invalid />
          </K.Field>
        </div>
      </Anatomy>
    );
  },

  sheet: function SheetAnatomy({ K }) {
    /* The key renders inside the sheet: everything outside is excluded while the trap holds. */
    return <ModalDemo K={K} label="Open the anatomy" render={(close) => (
      <K.Sheet open onClose={close} title="Select country"
        footer={<div style={{ padding: "0 var(--page-inset) var(--space-16)" }}>
          <K.Button onPress={close}>Done</K.Button></div>}>
        <div style={{ padding: "0 var(--page-inset) var(--space-16)" }}>
          <ol className="anatomy-key">
            <li><span className="pin static">1</span>Grabber — visible whenever the sheet is draggable</li>
            <li><span className="pin static">2</span>Title — the one decision this sheet is for</li>
            <li><span className="pin static">3</span>Body — the choices, scrolling if they overflow</li>
            <li><span className="pin static">4</span>Footer — the commit, reachable without the gesture</li>
            <li><span className="pin static">5</span>Barrier — a labelled button, from Modal</li>
          </ol>
        </div>
      </K.Sheet>
    )} />;
  },

  screen: function ScreenAnatomy({ K }) {
    return (
      <Anatomy surface parts={[
        { selector: ".mk-appbar", label: "Header — title on the content column, one action slot at most",
          at: [1, 0.5], offset: [16, 0] },
        { selector: ".mk-scroll", label: "Content — the one region that scrolls",
          at: [1, 0.25], offset: [16, 0] },
        { selector: ".mk-row", label: "Lists manage their own edges; text takes the page inset",
          at: [0, 0.5], offset: [-16, 0] },
        { selector: ".mk-lift", label: "Footer — one region, one subject, never two stacked",
          at: [1, 0.5], offset: [16, 0] }
      ]}>
        <div className="frame frame-sm" data-density="touch"
          style={{ width: 260, height: 330, position: "relative", overflow: "hidden" }}>
          <K.Screen header={<K.ScreenHeader title="Settings" onBack={() => {}} />}
            footer={<K.Button onPress={() => {}}>Save changes</K.Button>}>
            <K.ListGroup header="Account">
              <K.ListRow icon="settings" title="Preferences" chevron onPress={() => {}} />
            </K.ListGroup>
          </K.Screen>
        </div>
      </Anatomy>
    );
  },

  "screen-header": function HeaderAnatomy({ K }) {
    return (
      <Anatomy surface parts={[
        { selector: ".mk-appbar-slot .mk-btn", label: "Back — reachable by pointer and keyboard, not by edge gesture alone",
          at: [0.5, 0], offset: [0, -22] },
        { selector: ".mk-appbar-title", label: "Title — on the content column when it leads, after the back affordance when there is one",
          at: [0.15, 1], offset: [0, 20] },
        { selector: ".mk-appbar-slot:last-child .mk-btn", label: "One action slot. More than one is a toolbar",
          at: [0.5, 0], offset: [0, -22] }
      ]}>
        <div data-density="touch" style={{ width: 320 }}>
          <K.ScreenHeader title="Settings" onBack={() => {}}
            action={<K.Button variant="ghost" icon="more" label="More options" />} />
        </div>
      </Anatomy>
    );
  },

  "list-group": function ListGroupAnatomy({ K }) {
    const [on, setOn] = React.useState(true);
    return (
      <Anatomy surface parts={[
        { selector: ".mk-list-header", label: "Header in the page margin, aligned to the content column",
          at: [0, 0.5], offset: [-14, 0] },
        { selector: ".mk-row", label: "Rows bleed to the edges of the scope — background and press tint too",
          at: [1, 0.5], offset: [14, 0] },
        { selector: '.mk-row[data-separator="true"]', label: "Separator inset to the text column; the last row has none",
          at: [0.5, 1], offset: [0, 10] },
        { selector: ".mk-list-footer", label: "Footer carries consequences — what changes, and where to undo it",
          at: [0, 0.5], offset: [-14, 0] }
      ]}>
        <div data-density="touch" style={{ width: 320 }}>
          <K.ListGroup header="Permissions" footer="You can change these later in Settings.">
            <K.ListRow icon="camera" title="Camera" subtitle="Take photos and go live"
              trailing={<K.Switch checked={on} onChange={setOn} label="Camera" />} />
            <K.ListRow icon="settings" title="Account settings" chevron onPress={() => {}} />
          </K.ListGroup>
        </div>
      </Anatomy>
    );
  },

  "list-row": function ListRowAnatomy({ K }) {
    return (
      <Anatomy surface parts={[
        { selector: ".mk-row-lead", label: "Leading slot — sizes to what it holds, and sets the separator inset",
          at: [0.5, 0], offset: [0, -16] },
        /* Anchored where the glyphs START, not at the element's right edge: title and subtitle fill a
           minmax(0,1fr) column with left-aligned text, so their right edge is empty space abutting
           the trailing column — a pin placed beyond it lands on the value. */
        { selector: ".mk-row-title", label: "Title — body voice, two lines maximum, ellipsized",
          at: [0.15, 0], offset: [0, -14] },
        { selector: ".mk-row-sub", label: "Subtitle — de-emphasised by colour, never by a smaller size",
          at: [0.15, 1], offset: [0, 14] },
        { selector: ".mk-row-value", label: "Trailing metadata — top-aligned with the title",
          at: [1, 0.5], offset: [14, 0] }
      ]}>
        <div data-density="touch" style={{ width: 320 }}>
          <K.ListRow leading={<K.Avatar size={40} />} title="Ama Boateng"
            subtitle="Sent you a voice note" value="14:02" chevron onPress={() => {}} />
        </div>
      </Anatomy>
    );
  },
  icon: function IconAnatomy({ K }) {
    return (
      <Anatomy parts={[
        { selector: ".mk-icon", label: "The 24 grid — every glyph is drawn on it, at one of five sizes",
          at: [0, 0], offset: [-16, -16] },
        { selector: ".mk-icon svg", label: "Stroke 1.5 at rest, round caps and joins, fill none",
          at: [0.5, 1], offset: [0, 18] },
        { selector: ".icon-anat-label", label: "The label it inherits colour from — never a hardcoded hue",
          at: [1, 0.5], offset: [14, 0] }
      ]}>
        <span className="icon-row" style={{ fontSize: "var(--text-body-large)" }}>
          <K.Icon name="bookmark" size="xl" decorative />
          <span className="icon-anat-label">Save</span>
        </span>
      </Anatomy>
    );
  },
  modal: function ModalAnatomy({ K }) {
    const surface = React.useRef(null);
    return <ModalDemo K={K} label="Open the anatomy" render={(close) => (
      <K.Modal onClose={close} label="Modal anatomy" barrierLabel="Close the anatomy">
        <div role="dialog" aria-modal="true" aria-label="Modal anatomy" tabIndex={-1}
          className="spec-modal" ref={surface}>
          <PartPins surfaceRef={surface} parts={MODAL_PARTS} />
          <h3 className="spec-modal-title">Four parts</h3>
          <ol className="anatomy-key">
            {MODAL_PARTS.map((p, i) => (
              <li key={i}><span className="pin static">{i + 1}</span>{p.label}</li>
            ))}
          </ol>
          <div className="spec-modal-actions">
            <K.Button onPress={close}>Done</K.Button>
          </div>
        </div>
      </K.Modal>
    )} />;
  },
  pressable: function PressableAnatomy({ K }) {
    return (
    <Anatomy parts={[
      { selector: ".mk-btn", label: "The target — at least the density minimum in both axes",
        at: [0, 0], offset: [-18, -18] },
      { selector: ".mk-icon", label: "Leading icon, sized from density unless declared",
        at: [0.5, 0], offset: [0, -22] },
      { selector: ".mk-btn", label: "Label — the accessible name when no icon-only label is set",
        at: [0.8, 1], offset: [8, 22] },
    ]}>
      <K.Button icon="check" onPress={() => {}}>Continue</K.Button>
    </Anatomy>
    );
  },
};

export { EXAMPLES, STATES, ANATOMY };
