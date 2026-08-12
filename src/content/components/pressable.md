# Pressable

The activation primitive. Every pressable affordance routes through it, so press, long-press, hover,
focus, and haptics behave identically everywhere.

Use it directly for anything pressable that is not a button — a list row, a media tile, an avatar. A
bare click handler on a div has no states, no keyboard path, and no target guarantee.

```monokit-example pressable-basic
```

## Anatomy

```monokit-anatomy pressable
```

The visual and the target are separate things. The glyph keeps its size token; the hit area pads out
to the density minimum around it.

## Behaviour

Press paints within one frame — the target acknowledges the finger before anything asynchronous
begins. Native press is a **scale**, not a translate, and there is no colour flash and no ripple.

Long-press is recognised at the specified threshold, fires a light impact at recognition, and
suppresses the press that would otherwise have followed. Sliding off the target before recognition
aborts cleanly and clears the pressed state.

```monokit-scale interaction.timings
```

A gesture hosted here ships its pointer and keyboard equivalent in the same change. Right-click
mirrors long-press; `Menu` and `Shift+F10` reach the same menu from the keyboard.

## States

```monokit-states pressable
```

Precedence on the interaction axis, first match wins: disabled → pending → dragged → pressed →
hovered → focusVisible → rest. Resolvers read the state set, never raw pointer events.

**`pending` is not `disabled`.** Pending is non-interactive *and* communicates progress. Use it for
an action in flight; use disabled for one that is unavailable.

## Density

The same call site, resolved at both densities. Nothing branches.

```monokit-example pressable-density
```

```monokit-table space.density
```

## Clauses

```monokit-clauses pressable
```

## Accessibility

The target meets the density minimum in both axes, and hit area extends by slop rather than by
scaling the visual. Debug builds warn when a target renders below the minimum, so an undersized
control fails during development instead of shipping.

Activation works from Enter and Space, and the element exposes itself as a button. Focus binds to
focus-visible only, painted outside the bounds at `token:interaction.focusRing.width` width and
`token:interaction.focusRing.offset` offset so focus movement never shifts layout.

An icon-only target carries an accessible name; there is no visual label to fall back on. A
full-width row activates anywhere along the row, not only on its label.

Hover renders whenever a mouse produces it, at any density — it is an enhancement, never the only
route to a capability.

## Do and don't

```monokit-do
Give a row `onPress`, or give it an interactive trailing control. The press target stops before that
column so the control keeps its own tap and its own tab stop.
```

```monokit-dont
Point both at the same state. One tap runs both handlers, and whether they cancel each other out
depends on how the writes are ordered.
```

```monokit-do
Use `pending` while a request is in flight, and keep the label honest — "Sending…" rather than
"Send".
```

```monokit-dont
Use `disabled` for in-flight work. It says unavailable, and it says nothing about progress.
```

## Tokens

```monokit-tokens --min-target --control-height --motion-press --interaction-long-press --focus-ring-width --focus-ring-offset
```

## React

Illustrative. This snippet shows intended API; it is not a published package.

```jsx
<Pressable as="div" scale onPress={open} onLongPress={showMenu} aria-label="Open photo">
  <MediaTile item={item} />
</Pressable>
```

| Prop | Type | Notes |
|---|---|---|
| `as` | `"button" \| "div" \| "li" \| "a"` | Use `button` for anything actionable |
| `onPress` | `() => void` | Fires on release, not on down |
| `onLongPress` | `() => void` | Recognised at the long-press threshold; suppresses the press |
| `pending` | `boolean` | Non-interactive and communicating progress |
| `disabled` | `boolean` | Non-interactive and unavailable |
| `scale` | `boolean` | Apply the press scale to the whole target |

## Flutter

Illustrative. The Dart constants are generated from the same contract as the CSS.

```dart
MonoPressable(
  onPress: () => open(item),
  onLongPress: () => showContextMenu(item),
  semanticLabel: 'Open photo',
  child: MediaTile(item: item),
)
```

Density resolves through the app-level scope rather than a widget-local check, and the haptic fires
from the primitive rather than the call site:

```dart
final density = MonokitScope.of(context).density;
final target  = MonokitSpace.resolve(density).minTarget;
```
