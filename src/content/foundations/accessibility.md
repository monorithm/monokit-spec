# Accessibility

monokit does not maintain a separate accessibility mode. The language itself is the accommodation:
each pillar has a direct accessibility reading.

| Pillar | Accessibility reading |
|---|---|
| Monofocus | One primary subject per screen is what screen-reader and cognitive accessibility ask for: linear, unambiguous traversal with one obvious action |
| Content is the interface | Full-bleed media with scrim-backed text means legibility is engineered, never incidental |
| Calm chrome, expressive moments | Two motion schemes give reduced-motion a clean collapse target |
| Honest interfaces | Assistive-technology users get the same truth at the same time, not a silent spinner |
| Fool-proof by reach and forgiveness | Thumb-arc placement, minimum targets, and a visible alternative for every gesture are motor accessibility stated as product rules |
| One system, every screen | Keyboard, switch access, and screen readers are input modalities, covered by design rather than patched |

## The contract

Every component ships all five. A component missing any one is **incomplete, not shippable with
known issues**.

1. A token pair whose contrast is verified
2. Semantics wired through the shared primitives
3. Reduced-motion behaviour
4. A keyboard path
5. A hit target meeting density minimums

## Contrast

Verified pairs, not raw colours. Cite these ratios; never recompute per component.

| Pair | Ratio | Verdict |
|---|---|---|
| `primaryForeground` on `primary` | 5.37:1 light · 7.26:1 dark | AA, all text sizes |
| `foreground` on `background` | 19.7:1 | AAA |
| `mutedForeground` on `background` | 4.61:1 light · 8.07:1 dark | AA — the floor for readable text |
| Solid `success`/`warning` with their foregrounds | 3.2:1 | Large text, icons and badges only |
| `*Text` on `*Soft` surfaces | 5.9–7.5:1 | AA — the only sanctioned body-text treatment for status |
| Dark status fills with dark foregrounds | 6.8–11.5:1 | AA |
| `onMediaMuted` over `mediaCanvas` | 10.5:1 | AAA |
| `foreground` on `muted` | 17.71:1 light · 14.24:1 dark | AAA |
| `primaryText` on `primarySoft` | 6.32:1 light · 5.42:1 dark | AA |
| `mutedText` on `muted` | 6.62:1 light · 6.06:1 dark | AA |
| `primary` on `background` | 5.36:1 light; `sidebarPrimary` 7.97:1 dark | AA · AAA |

Components consume tokens **in pairs**. Mixing pairs puts contrast outside the verified set, and
that is not a formality: measuring four previously-unverified pairs in this realization found two
failures, one of them severe.

Each axis carries four roles — solid, on-solid, soft, and an ink verified against that soft surface.
Brand and neutral originally had three, which is precisely where both failures were:

- `primary` on `primarySoft` measures 4.45:1 in light and **1.76:1 in dark**, because `primary` in
  dark is specified as a brand *surface* rather than an ink. Soft brand fills take `primaryText`.
- `mutedForeground` is verified on `background` at 4.61:1, not on `muted`, where it is 4.14:1. Text
  on a muted well — a field placeholder, most commonly — takes `mutedText`.

`mutedForeground` is the minimum text colour on `background`; there is never a lighter hint tint.

**Colour is never the sole carrier of meaning.** Status pairs with an icon or text, the live colour
always accompanies the word "Live", and a single-hue chart ramp must differ by more than hue.

## Text scaling

OS text scale to 200% with no loss of content or function. Beyond 200% is best-effort reflow, never
clipping.

Component minimum heights derive from the **scaled line-height** of their label role plus padding
tokens — never from spacing constants alone. Containers reflow rather than truncate: icon and text
pairs wrap, button labels wrap to two lines before ellipsizing, list items grow vertically.
Truncation is allowed only when the full content is reachable elsewhere.

The policy above is stated; this specimen tests it. Drag the scale and a small surface built from
real components takes the OS text scale through its range. Watch what reflows and what does not —
this is the page's own claim under load, and where something fails it is left visibly failing.

```monokit-example textscale-reflow
```


Chrome that cannot grow — the action rail, tab bars — keeps its geometry but must not contain
scale-dependent text: icons and counts only, with full labels via long-press or tooltip.

## Reduced motion

**The collapse happens inside the motion system, not in per-component checks.** Components ask for a
motion role and the role is already reduced.

All motion — calm and expressive, celebration springs included — collapses to opacity fades no
longer than the `fast` duration. Position, scale, and rotation never animate. Reduced motion must
not remove information: the reaction still lands, the badge still appears; only the physics go.

Shimmer becomes a static tone, pulses become static, autoplay requires a tap. Haptics are
independent of reduced motion — when motion cannot carry the confirmation, haptics do.

## Focus

- Traversal follows visual reading order; regions run header → body → footer → open sidebar.
- Concealed chrome applies exclusion from focus, pointer, **and** semantics. Offscreen controls are
  unreachable by any modality.
- Autofocus is reserved for screens whose single subject is an input — verification codes, command
  palettes, search. Feeds and readers never steal focus.
- Modal overlays trap focus for their lifetime and **restore focus to the trigger on dismiss**.
- The overlay barrier is a labelled semantic dismiss control. A barrier that is a bare gesture target
  is invisible to screen readers, which makes every modal a trap.
- `focused` means the node has focus. `focusVisible` means the ring should paint. Rings bind to
  focus-visible only, painted **outside** the bounds so focus movement never shifts layout.

## Touch targets

Enforcement is structural: the press primitive inflates its hit area to the density minimum when the
visual child is smaller. Visual size and touch size decouple — small icon buttons stay visually
small, and their hit area does not.

Adjacent targets keep clearance so misses do not become mis-hits. Debug builds warn when a target
renders below the minimum.

## Timing and interruption

- Deterministic expiry is announced, not sprung: a banner appears while content is still valid.
- Timers read as text and are announced at start, halfway, and zero — never every second.
- Toasts never carry the only copy of essential information.
- Auto-hiding chrome pauses while assistive navigation is active — controls never vanish out from
  under a screen-reader cursor.
- Nothing interrupts full-screen media except calls and system events. That applies to semantics
  focus too: no toast may move the screen-reader cursor.
- Celebration moments are skippable, block no input, and expose their outcome as text immediately.

> **Do not** use a live region on anything that re-renders more than once per second, and do not
> auto-advance carousels, feeds, or steppers on a timer. Advancing is always a user action.

## Current conformance

This specification's own components do not yet meet the contract above. The gap list is in
[Status](#/about/status), itemised with severity. It is published rather than hidden because a
specification that hides its own conformance debt teaches teams to do the same.
