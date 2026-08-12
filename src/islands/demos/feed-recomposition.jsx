/* Feed recomposition - one design, recomposed across the four width classes.
 *
 * The subject of `foundations/adaptive-design.md` is a claim about composition: the same screen,
 * recomposed rather than redesigned, and Monofocus surviving every width. This specimen makes the
 * claim watchable. Drag the width slider and the SAME feed item recomposes:
 *
 *   compact    full-bleed media, actions over the media, navigation in a bottom bar
 *   medium     media letterboxed on the canvas, navigation on a rail beside it
 *   expanded   media in a centred column, navigation pinned and labelled, actions external
 *   wide       as expanded, plus a trailing context pane
 *
 * ONE ITEM AT EVERY WIDTH. The feed never becomes a grid - a grid of autoplaying videos is many
 * subjects, which is the Monofocus violation the page names.
 *
 * WHAT IS ONE ELEMENT, ON PURPOSE
 *
 * The navigation is a single `<nav>` and the action rail a single column. Neither is duplicated per
 * class and swapped by `display`. If the specimen's whole assertion is "recomposed, never redrawn",
 * then a second copy of the navigation for the bottom bar would be the specimen quietly redrawing
 * while the prose says otherwise. The bar, the icon rail and the labelled rail are the same five
 * destinations in the same DOM order, moved by CSS.
 *
 * HONESTY
 *
 * This realization does not resolve width classes. No component below reads a width-class scope,
 * and none of the recomposition here is automatic - the specimen composes it with its own layout,
 * which is why the visible note says so. A specimen is never the authority for a value or a
 * behaviour; the page is.
 *
 * NO NUMBER IS TYPED
 *
 * The three class boundaries, and therefore the slider's range and every band midpoint, are read
 * from `--breakpoint-compact` / `--breakpoint-medium` / `--breakpoint-expanded` at mount. The
 * numbers a reader sees on the track are the contract's, not this file's. If they cannot be
 * resolved the specimen says so rather than inventing a scale.
 */
import React from "react";

const CLASSES = ["compact", "medium", "expanded", "wide"];

const COMPOSITION = {
  compact: "media full-bleed, actions over the media, navigation in a bottom bar",
  medium: "media letterboxed on the canvas, navigation on a rail beside it",
  expanded: "media in a centred column, navigation pinned and labelled, actions in their own column",
  wide: "as expanded, plus a trailing context pane - still one item, never a grid",
};

const DESTINATIONS = [
  { id: "home", icon: "home", label: "Home" },
  { id: "search", icon: "search", label: "Search" },
  { id: "create", icon: "add", label: "Create" },
  { id: "activity", icon: "like", label: "Activity" },
  { id: "profile", icon: "user", label: "Profile" },
];

const CONTEXT = [
  "Same feed, more context.",
  "The column keeps its measure.",
  "Media never shrinks to make room for the pane.",
];

const LIKES = 2413;
const COMMENTS = 108;

/* The scale, read from the contract's own breakpoints.
 *
 * The slider needs headroom on both sides of the outer boundaries, and that headroom is not a
 * canonical number - so it is derived rather than chosen: one boundary step either side. Nothing
 * here is a value the specification owns, and nothing here is typed. */
function readBands() {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") return null;
  const styles = getComputedStyle(document.documentElement);
  const read = (name) => parseFloat(styles.getPropertyValue(name));
  const compact = read("--breakpoint-compact");
  const medium = read("--breakpoint-medium");
  const expanded = read("--breakpoint-expanded");
  if (!(compact > 0 && medium > compact && expanded > medium)) return null;
  const headroom = medium - compact;
  return { edges: [compact, medium, expanded], min: compact - headroom, max: expanded + headroom };
}

/* Which class a simulated width resolves to. The boundaries are exclusive upper bounds, the way
   the page states them: a width AT a boundary belongs to the class above. */
function classIndexFor(px, bands) {
  let i = 0;
  while (i < bands.edges.length && px >= bands.edges[i]) i += 1;
  return i;
}

/* The middle of a band, so a jump lands somewhere representative rather than on an edge. */
function midpoint(index, bands) {
  const low = index === 0 ? bands.min : bands.edges[index - 1];
  const high = index === bands.edges.length ? bands.max : bands.edges[index];
  return Math.round((low + high) / 2);
}

function narrate(index) {
  return CLASSES[index] + " - " + COMPOSITION[CLASSES[index]];
}

export function FeedRecomposition({ K }) {
  const [bands] = React.useState(readBands);
  const [width, setWidth] = React.useState(() => (bands ? midpoint(0, bands) : 0));
  const [log, setLog] = React.useState(() => (bands ? narrate(0) : ""));
  const [liked, setLiked] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [where, setWhere] = React.useState(DESTINATIONS[0].id);
  const sliderId = React.useId();

  if (!bands) {
    return (
      <div className="demo demo-feed">
        <p className="demo-log">
          The width-class boundaries did not resolve from the token stylesheet, so there is no
          scale to compose against. Nothing is drawn rather than something invented.
        </p>
      </div>
    );
  }

  const index = classIndexFor(width, bands);
  const cls = CLASSES[index];
  const labelled = index >= CLASSES.indexOf("expanded");
  const progress = (width - bands.min) / (bands.max - bands.min);
  const likes = liked ? LIKES + 1 : LIKES;

  /* The class is announced only when it CHANGES. Narrating every step of a drag would make the
     live region unusable for exactly the reader who depends on it. */
  const apply = (px) => {
    const next = classIndexFor(px, bands);
    if (next !== index) setLog(narrate(next));
    setWidth(px);
  };

  const offset = (edge) => ((edge - bands.min) / (bands.max - bands.min)) * 100 + "%";

  return (
    <div className="demo demo-feed">
      <div className="demo-feed__hud">
        <span className="demo-feed__class">{cls}</span>
        <span className="demo-feed__px"><b>{width}</b> px</span>
        <span className="demo-feed__invariant">one item per viewport - never a grid</span>
      </div>

      {/* The simulated viewport. Its rendered width tracks the slider so growth is felt, and the
          composition inside it is keyed off the resolved class, never off the rendered width. */}
      <div className="demo-feed__holder">
        <div className="demo-feed__frame" data-class={cls}
          style={{ "--feed-progress": progress.toFixed(4) }}>

          {/* One navigation. Bottom bar, icon rail, labelled rail - same destinations, same order. */}
          <nav className="demo-feed__nav" data-labelled={labelled ? "true" : "false"}
            aria-label="Feed destinations">
            {DESTINATIONS.map((d) => (
              <K.Pressable key={d.id} className="demo-feed__navitem"
                data-on={where === d.id ? "true" : "false"}
                aria-current={where === d.id ? "page" : undefined}
                onPress={() => {
                  setWhere(d.id);
                  setLog(d.label + " - one set of destinations, composed as a bar, a rail, or a " +
                    "labelled rail");
                }}>
                <K.Icon name={d.icon} size="md" active={where === d.id} decorative />
                {/* The label never leaves the accessible name. At rail widths it is only visually
                    withdrawn, so the icon-only composition is still a named destination. */}
                <span className={labelled ? "demo-feed__navtext" : "sr-only"}>{d.label}</span>
              </K.Pressable>
            ))}
          </nav>

          <div className="demo-feed__stage">
            <div className="demo-feed__player">
              <div className="demo-feed__wrap">
                <figure className="demo-feed__media">
                  <span className="demo-feed__index" aria-hidden="true">1 of many</span>
                  <K.Button className="demo-feed__play" variant="ghost"
                    icon={playing ? "pause" : "play"} label={playing ? "Pause" : "Play"}
                    onPress={() => {
                      setPlaying(!playing);
                      setLog(playing ? "Paused" : "Playing - one subject has the sound and the frame");
                    }} />
                  <span className="demo-feed__scrim" aria-hidden="true" />
                  <figcaption className="demo-feed__caption">
                    <b>@nimbus</b>
                    <span>One subject, full attention.</span>
                  </figcaption>
                </figure>

                {/* One action column. Over the media below expanded, beside it above. */}
                <div className="demo-feed__actions">
                  <K.Pressable className="demo-feed__act" aria-pressed={liked}
                    aria-label={"Like, " + likes.toLocaleString() + " likes"}
                    onPress={() => {
                      setLiked(!liked);
                      setLog(liked ? "Like removed"
                        : "Liked - the action column moved, the action did not change");
                    }}>
                    <K.Icon name="like" size="md" active={liked} decorative />
                    <span className="demo-feed__count" aria-hidden="true">
                      {likes.toLocaleString()}
                    </span>
                  </K.Pressable>

                  <K.Pressable className="demo-feed__act" aria-label={"Comments, " + COMMENTS}
                    onPress={() => setLog("Comments - over the media below wide, in the trailing " +
                      "pane at wide")}>
                    <K.Icon name="comment" size="md" decorative />
                    <span className="demo-feed__count" aria-hidden="true">{COMMENTS}</span>
                  </K.Pressable>

                  <K.Pressable className="demo-feed__act" aria-label="Share"
                    onPress={() => setLog("Share - the same sheet at every width")}>
                    <K.Icon name="share" size="md" decorative />
                    <span className="demo-feed__count" aria-hidden="true">Share</span>
                  </K.Pressable>

                  <K.Pressable className="demo-feed__act" aria-label="More options"
                    onPress={() => setLog("More - where long-press goes when there is a pointer " +
                      "and a keyboard")}>
                    <K.Icon name="more" size="md" decorative />
                  </K.Pressable>
                </div>
              </div>
            </div>
          </div>

          {/* Context, not a second subject: the pane arrives at wide and the item does not shrink
              to pay for it. */}
          {cls === "wide" ? (
            <aside className="demo-feed__context" aria-label="Comments on this item">
              <p className="demo-feed__ctx-head">Comments - {COMMENTS}</p>
              {CONTEXT.map((line) => (
                <div key={line} className="demo-feed__ctx-row">
                  <K.Avatar />
                  <p>{line}</p>
                </div>
              ))}
            </aside>
          ) : null}
        </div>
      </div>

      <div className="demo-feed__control">
        <label className="demo-feed__label" htmlFor={sliderId}>Simulated viewport width</label>
        <input id={sliderId} className="demo-feed__range" type="range"
          min={bands.min} max={bands.max} value={width}
          onChange={(e) => apply(parseInt(e.target.value, 10))} />
        {/* Marks, not controls: the buttons below do the jumping, so these carry no tab stop and
            cannot collide with the reader's keyboard path. The numbers are the contract's. */}
        <div className="demo-feed__ticks" aria-hidden="true">
          {bands.edges.map((edge) => (
            <span key={edge} className="demo-feed__tick" style={{ insetInlineStart: offset(edge) }}>
              {edge}
            </span>
          ))}
        </div>
      </div>

      <div className="demo-feed__classes" role="group" aria-label="Jump to a width class">
        {CLASSES.map((name, i) => (
          <K.Button key={name} variant={i === index ? "soft" : "ghost"} aria-pressed={i === index}
            onPress={() => apply(midpoint(i, bands))}>{name}</K.Button>
        ))}
      </div>

      <p className="demo-log" aria-live="polite">{log}</p>

      <p className="demo-feed__note">
        Illustration, not resolution. This specimen composes the four widths with its own layout -
        no component here reads a width-class scope, because this realization does not resolve one.
        Read the composition as specified, not as automatic.
      </p>
    </div>
  );
}
