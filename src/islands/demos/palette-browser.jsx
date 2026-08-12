/* palette-browser: the colour tokens read out of the running document.
 *
 * The page already carries three `monokit-swatches` lists, generated from the contract at build
 * time. Those are the values, and they are authoritative. This specimen deliberately does not
 * repeat them; it adds the two things a static list cannot do.
 *
 *   1. It RESOLVES. Every chip is painted with `var(--token)` and every value under a chip is read
 *      back out of the cascade with getComputedStyle, at the place the swatch actually sits. Flip
 *      the site theme and the board re-reads rather than re-labels, so a reader can watch which
 *      values move and which do not. There is no table of colours in this file, which is why it
 *      cannot drift from the contract: it has nothing of its own to drift with.
 *   2. It HANDS THE VALUE OVER. A swatch is a Pressable; pressing one copies what that token
 *      resolves to right now, confirmed on the swatch and announced on a live region rather than
 *      only shown.
 *
 * A specimen is never authority. If this board and the contract ever disagree, the contract is
 * right and this is broken.
 */
import React from "react";

/* Every entry is [token, the role it plays]. No entry carries a value: the value is whatever the
   token resolves to in the reader's theme, and typing one here would be the exact failure this
   specimen exists to make visible. */
const STATUS_ROLES = [
  ["", "solid \u2014 badges, icons, large text"],
  ["-foreground", "the ink on that solid"],
  ["-soft", "the soft fill body messaging uses"],
  ["-text", "the ink verified on that soft"],
];

function statusSet(axis, note) {
  return {
    title: axis,
    note: note,
    items: STATUS_ROLES.map(([suffix, role]) => ["--" + axis + suffix, role]),
  };
}

const SETS = [
  {
    title: "Surfaces and ink",
    note: "The mist neutrals. One material under different light, not a collage of greys.",
    items: [
      ["--background", "the page canvas"],
      ["--card", "cards, popovers and sheets"],
      ["--muted", "the de-emphasis well"],
      ["--foreground", "primary text"],
      ["--muted-foreground", "secondary text, de-emphasised by colour and never by size"],
      ["--border", "the hairline; in light mode it is the card"],
    ],
  },
  {
    title: "Brand",
    note: "The one rationed accent, and the four roles it carries.",
    items: [
      ["--primary", "brand surface, where the user acts"],
      ["--primary-foreground", "the ink on that solid"],
      ["--primary-soft", "the soft brand fill"],
      ["--primary-text", "the brand ink verified on that soft"],
    ],
  },
  statusSet("success", "Confirmed. Not the brand accent under another name."),
  statusSet("warning", "Caution."),
  statusSet("info", "A neutral note."),
  statusSet("destructive", "Irreversible, and never an emphasis colour."),
  {
    title: "On media",
    context: "media",
    note: "Mode-invariant, and shown here on the canvas they are used over. Toggle the theme: " +
      "every set above moves and these four stay exactly where they are.",
    items: [
      ["--media-canvas", "the canvas, so letterboxing disappears"],
      ["--on-media", "ink over media"],
      ["--on-media-muted", "secondary ink over media"],
      ["--live", "broadcast, at badge scale only"],
    ],
  },
];

/* What a token resolves to HERE, read off the swatch rather than off the document element, so a
   specimen sitting in a scope that redefines a token reports that scope's answer and not a
   second opinion from the root. */
function resolveToken(el, token) {
  const raw = getComputedStyle(el).getPropertyValue(token).trim();
  return raw.charAt(0) === "#" ? raw.toUpperCase() : raw;
}

/* A duration out of the cascade, in milliseconds. The contract owns the number; nothing in this
   file may restate it, so the confirmation's dwell is read rather than chosen. */
function durationMs(el, token) {
  const raw = getComputedStyle(el).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 0;
  return /ms$/i.test(raw) ? n : n * 1000;
}

export function PaletteBrowser({ K }) {
  const root = React.useRef(null);
  const timer = React.useRef(0);
  const live = React.useRef(true);
  const [values, setValues] = React.useState({});
  const [dark, setDark] = React.useState(false);
  const [copied, setCopied] = React.useState(null);

  const read = React.useCallback(() => {
    const host = root.current;
    if (!host) return;
    const next = {};
    for (const el of host.querySelectorAll("[data-token]")) {
      const token = el.dataset.token;
      next[token] = resolveToken(el, token);
    }
    setValues(next);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  /* Bound to the theme, so it has to hear the theme change. The site toggles one class on the
     document element and every colour token is redeclared under it; watching that attribute is
     the whole subscription, and it is torn down with the specimen. */
  React.useLayoutEffect(() => {
    live.current = true;
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      live.current = false;
      observer.disconnect();
      clearTimeout(timer.current);
    };
  }, [read]);

  /* The value is re-read at press rather than taken from state: the board a reader is looking at
     and the string that lands on their clipboard must be the same fact, even if a theme flip and
     a press arrive in the same frame. */
  const copy = (token) => {
    const host = root.current;
    const el = host && host.querySelector('[data-token="' + token + '"]');
    if (!el) return;
    const value = resolveToken(el, token);

    const settle = (ok) => {
      if (!live.current) return;
      setCopied({ token: token, value: value, ok: ok });
      clearTimeout(timer.current);
      const dwell = durationMs(host, "--interaction-undo-window");
      /* No dwell means the token did not resolve. The confirmation then stands until the next
         press, which is the honest degradation: a timer of a made-up length is not. */
      if (dwell > 0) {
        timer.current = setTimeout(() => { if (live.current) setCopied(null); }, dwell);
      }
    };

    /* Clipboard access is a permission, not a guarantee. A refusal is reported and the value is
       left on the page to select by hand, because a specimen that silently swallows the failure
       teaches the reader the wrong thing about the value they now think they hold. */
    const clip = typeof navigator !== "undefined" ? navigator.clipboard : null;
    if (clip && clip.writeText) clip.writeText(value).then(() => settle(true), () => settle(false));
    else settle(false);
  };

  const announcement = !copied ? ""
    : copied.ok ? "Copied " + copied.token + ", " + copied.value
    : "The browser refused the clipboard. " + copied.token + " is " + copied.value;

  return (
    <div className="demo demo-palette" ref={root}>
      <p className="demo-palette__mode">
        Resolving against the <b>{dark ? "dark" : "light"}</b> theme. Toggle the theme in the top
        bar and the whole board re-reads. Press a swatch to copy the value it resolves to, under
        the name you would type in a stylesheet.
      </p>

      {SETS.map((set) => (
        <section className="demo-palette__set" key={set.title} data-context={set.context}>
          <h3 className="demo-palette__title">{set.title}</h3>
          <p className="demo-palette__note">{set.note}</p>
          <div className="demo-palette__grid">
            {set.items.map(([token, role]) => {
              const hit = copied && copied.token === token;
              return (
                <K.Pressable key={token} className="demo-palette__swatch" data-token={token}
                  data-copied={hit ? String(copied.ok) : undefined}
                  onPress={() => copy(token)}>
                  <span className="demo-palette__chip" aria-hidden="true"
                    style={{ background: "var(" + token + ")" }}>
                    {hit && copied.ok ? (
                      <span className="demo-palette__mark">
                        <K.Icon name="check" size="xs" decorative />
                      </span>
                    ) : null}
                  </span>
                  {/* The name a press produces, so the control announces what it does rather than
                      leaving a reader to infer it from a colour they may not be able to see. */}
                  <span className="sr-only">Copy </span>
                  <span className="sw-name">{token}</span>
                  <span className="sw-desc">{role}</span>
                  <span className="sw-val">{values[token] || "\u2014"}</span>
                </K.Pressable>
              );
            })}
          </div>
        </section>
      ))}

      {/* Empty until something happens, so the region announces the confirmation and nothing else.
          Standing instructions live in the paragraph above, where they are read once. */}
      <p className="demo-log demo-palette__status" role="status" aria-live="polite"
        data-ok={copied ? String(copied.ok) : undefined}>{announcement}</p>

      <p className="demo-palette__foot">
        A specimen, not authority. The values belong to the contract; this board only reports what
        the running document makes of them.
      </p>
    </div>
  );
}
