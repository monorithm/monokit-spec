# Sheet

The native answer to one decision. It enters from the edge it belongs to, it is draggable, and on a
phone it replaces the centred dialog outright.

```monokit-example sheet-basic
```

## It composes Modal

The trap, the background exclusion, the restore to the trigger, Escape and the labelled barrier all
come from [Modal](#/components/modal). Sheet owns position, gesture and chrome, and nothing else —
which is why `Dialog` and `Drawer` inherit the accessibility work rather than reimplementing it.

## Gesture

```monokit-scale interaction.gestures
```

Drag it down past the dismiss fraction of its height and it commits; a release above the dismiss
velocity commits regardless of distance. Under both, it returns to rest on the spatial spring
**leaving no trace** — a cancelled gesture is not a half-applied one.

Upward drag rubber-bands at the specified damping, so the surface resists rather than stopping dead.

## One driver for position

Entry, drag, return and exit are all the same property with a varying transition. This matters more
than it sounds: driving entry from a keyframe animation while a gesture drives position means
releasing a drag re-adds the animation, which restarts it from its first frame and throws the sheet
off screen. Position has one driver, permanently.

## Anatomy

```monokit-anatomy sheet
```

## Clauses

```monokit-clauses sheet
```

## Accessibility

The grabber is visible whenever the sheet is draggable, and the gesture is never the only way out:
Escape closes it, and the barrier is a labelled button.

At medium widths and above the sheet centres and detaches from the edges at the sheet container
width. It takes the largest radius steps, because radius scales with surface size rather than
importance.

## Tokens

```monokit-tokens --sheet-radius --sheet-grabber --overlay-scrim --elevation-e3
```

## React

Illustrative.

```jsx
<Sheet open={open} onClose={close} title="Select country"
  footer={<Button onPress={close}>Done</Button>}>
  {countries.map((c) => <ListRow key={c} title={c} onPress={() => pick(c)} />)}
</Sheet>
```

## Flutter

Illustrative.

```dart
MonoSheet(
  title: 'Select country',
  dismissible: true,
  child: CountryList(onPick: pick),
)
```
