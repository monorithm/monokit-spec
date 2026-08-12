# Switch

A state that applies immediately. If it needs a Save button it is a checkbox in a form, not a switch.

```monokit-example switch-basic
```

## The target is not the track

The track keeps its own size at every density. The **hit area** extends to the density minimum
through slop, so the control stays visually small and its target does not.

```monokit-example switch-density
```

Slop is placed rather than padded, because padding would move the thumb's origin and break its
travel. The thumb's size and travel are derived from the track and the inset, so the three cannot
drift apart — and right-to-left mirrors by flipping one sign rather than restating the geometry.

## Clauses

```monokit-clauses switch
```

## Motion

The thumb moves on the indicator role — a curve, not a spring. A switch is chrome, and chrome is
calm. Springs are reserved for the three expressive moments, and a settings toggle is not one of
them.

## Accessibility

It exposes itself as a switch with its current state, and carries a label even when the row beside it
has one — the row's title is not automatically the control's name.

The selection haptic fires on change, and reduced motion does not disable it: when motion cannot
carry the confirmation, haptics do.

## Do and don't

```monokit-do
Apply the change on release. A switch that needs confirming is telling you it should have been a
checkbox.
```

```monokit-dont
Scale the visual up to meet the target, or animate the thumb on a spring because it feels lively.
```

## Tokens

```monokit-tokens --min-target --primary --muted --motion-state
```

## React

Illustrative.

```jsx
<ListRow icon="notification" title="Notifications"
  trailing={<Switch checked={on} onChange={setOn} label="Notifications" />} />
```

## Flutter

Illustrative.

```dart
MonoSwitch(value: on, onChanged: setOn, semanticLabel: 'Notifications')
```
