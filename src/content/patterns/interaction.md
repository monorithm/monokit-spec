# Interaction

Fool-proof and forgiving. Ease of use beats density, cleverness, and convention.

1. **Predictable** — the same input means the same thing on every screen.
2. **Redundant** — every gesture has a visible alternative. Gestures are accelerators, never the only
   path.
3. **Forgiving** — a drag can be returned, a long-press slid off, an overlay dismissed, a destructive
   action undone. Forgiveness beats friction wherever the action is reversible.
4. **Honest** — feedback is immediate even when the effect is asynchronous.
5. **Reachable** — frequent actions where thumbs rest; dangerous actions where they do not.

> An interaction that saves one tap but occasionally deletes a message is not delight.

## States

Thirteen states, resolved from a set rather than from booleans scattered through components.

`hovered` · `focused` · `focusVisible` · `pressed` · `disabled` · `invalid` · `checked` ·
`selected` · `expanded` · `open` · `active` · `dragged` · `pending`

**Precedence on the interaction axis**, first match wins:

```monokit-tokens --min-target --control-height
```

disabled → pending → dragged → pressed → hovered → focusVisible → rest

The mode axis — checked, selected, expanded, open, active, invalid — composes orthogonally. A
selected item can still be hovered.

**`pending` is not `disabled`.** A pending control is non-interactive *and* communicates progress; a
disabled one communicates unavailability.

## Recognition thresholds

These gate behaviour. Any animation they trigger uses a motion role.

```monokit-scale interaction.timings
```

```monokit-figure hold-gesture-physics
The hold gesture over time: press, the recognition threshold, and the settle that follows.
```

## Gestures

| Gesture | Meaning | Visible alternative |
|---|---|---|
| Tap | Activate the primary action | the baseline |
| Double-tap | Affection, media surfaces only | the action rail's like button |
| Long-press | Open the context menu | a visible overflow affordance |
| Press-and-hold | Sustain a continuous action | tap-to-toggle |
| Vertical swipe | Advance content, one item per viewport | wheel, arrow keys, on-screen next |
| Horizontal swipe on a row | Reveal quick actions | the context menu carries the same actions |
| Pull-to-refresh | Refresh, only at scroll top | a refresh affordance |
| Drag-dismiss | Dismiss in the entry axis | close button, Escape, barrier tap |
| Pinch | Zoom | zoom controls |

**One gesture axis per scrollable region.** Ambiguity is resolved at design time, not by recognizer
arbitration at runtime.

**Edge swipes belong to the system.** monokit never claims them.

Long-press has exactly two meanings, split by target class and never co-present: content opens a
context menu, a capture control sustains an action. Nothing else may claim it.

### Drag-dismiss thresholds

```monokit-scale interaction.gestures
```

A cancelled gesture leaves no trace: swipe actions retract, drags spring back on the spatial spring,
a long-press released before recognition does nothing.

## Focus

A ring in the neutral ring colour — `token:interaction.focusRing.width` wide at
`token:interaction.focusRing.offset` offset — painted **outside** the control's bounds so it never
shifts layout, bound to focus-visible only. A pointer click focuses without drawing a ring; Tab
draws it. The ring is neutral by design — **focus is not intent**.

One ring on screen at a time. Overlays trap focus so rings never appear behind a scrim.

The one exception is a list row, which is edge-to-edge and so has nowhere outside itself to paint:
its ring insets by 2 inside the row bounds. See [Space and layout](#/styles/space).

## Destructive protection

Protection scales with irreversibility, and the tier mandates the mechanism. A tier never borrows a
weaker one to feel faster.

| Tier | Examples | Required protection |
|---|---|---|
| Reversible | archive, mute, unfollow | Act immediately, offer undo for the undo window |
| Destructive, local | delete message, discard draft | Hold-to-confirm while a ring fills |
| Irreversible, global | delete account, end a live stream | Typed confirmation |

Destructive actions never sit where thumbs rest, never take the default focus in a dialog, and come
last and separated in a menu. Undo is a real reversal, not a delayed commit the UI hides — if
reversal is impossible, climb the ladder instead.

## Haptics

Semantic tokens with a fixed trigger map: components never call the engine. A haptic must accompany a
visible state change, fires on **commit** rather than on request, and never fires for passive events.
They no-op automatically where there is no actuator, so call sites never branch on platform.

Reduced motion does not disable haptics — when motion collapses, haptics carry the confirmation.

## Sound

Strictly opt-in in every context, off by default, tokens reserved. Sound is never the only feedback
channel, and there are no chrome sounds — no tap clicks, no navigation whooshes.
