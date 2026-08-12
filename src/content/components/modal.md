# Modal

The overlay primitive. Any surface that covers content and takes the user's whole attention routes
through it — so the four things a modal owes are implemented once rather than per overlay.

A modal that traps focus without an announced way out is worse than no modal. The specification
names this failure directly: a barrier that is only a gesture target is invisible to assistive
technology, and every overlay built on one is a room with no door.

## The bare primitive

Nothing but the trap. Tab through it — focus cycles and never reaches the page behind.

```monokit-example modal-bare
```

## What the trap is doing

A focus trap is invisible, so the claim is worth nothing unless you can watch it. Two views of the
same open modal — the cycle it will follow, and what it has made unreachable:

```monokit-example modal-observable
```

Both are drawn from the trap's own focusable query. A diagram that computed its own order could
disagree with the behaviour it documents, which would make it worse than no diagram — and the
background count is measured by trying to focus every control behind the modal, not by reading an
attribute.

## Composed

`Sheet` is the only overlay that uses it today. Same trap, same barrier, same restore — Sheet adds
position, gesture and chrome, and nothing else.

```monokit-example modal-sheet
```

## Anatomy

```monokit-anatomy modal
```

## Behaviour

**On open** it captures the trigger, excludes the background, and moves focus into the surface. The
order matters: exclusion blurs whatever had focus, so a trigger read afterwards reads nothing.

**While open** Tab and Shift+Tab cycle within the layer. The barrier sits so that the surface's own
content is traversed first and the dismiss control is the last stop before the cycle wraps — the
exit should be reachable, not in the way.

**On dismiss** it releases the background exactly as it found it and returns focus to the trigger,
if the trigger is still in the document.

Modal does not manage its own presence. A surface that animates out has to outlive its own open
state, so the consumer decides when Modal is mounted; Modal arms on mount and restores on unmount.

## Clauses

```monokit-clauses modal
```

## Accessibility

Exclusion covers focus, pointer **and** semantics together. Excluding one and not the others leaves
the overlay reachable by whichever modality was missed — a background that is hidden from a screen
reader but still tabbable is still a bug.

The barrier is a labelled button. It is the dismiss control, and naming it is what makes the
overlay escapable for someone who cannot see the scrim.

> **Verify a trap by behaviour, not by attribute.** An inert ancestor leaves its descendants
> reporting that they are not inert while they are genuinely unreachable. An attribute check reads
> that as a false negative and will send you looking for a bug that is not there.

## Tokens

```monokit-tokens --overlay-scrim --elevation-e3 --focus-ring-width --focus-ring-offset
```

## Do and don't

```monokit-do
Give the barrier a name that says what dismissing does — "Close Select country", not "Close". The
label is the only description a screen-reader user gets of what they are leaving.
```

```monokit-dont
Use a scrim div with a pointer handler. It works for a mouse, announces nothing, and cannot be
reached by Tab or by a switch device.
```

```monokit-do
Let the composing surface own its position and motion. Sheet drives one transform for entry, drag,
return and exit, so no two drivers can fight over where the surface is.
```

```monokit-dont
Nest a modal inside a modal. One primary subject at a time is the rule the whole language rests on,
and two stacked traps have no coherent exit.
```

## React

Illustrative. This snippet shows intended API; it is not a published package.

```jsx
<Modal onClose={close} label="Select country" barrierLabel="Close Select country">
  <div role="dialog" aria-modal="true" aria-label="Select country" tabIndex={-1}>
    {children}
  </div>
</Modal>
```

| Prop | Type | Notes |
|---|---|---|
| `onClose` | `() => void` | Fired by Escape and by the barrier |
| `label` | `string` | The surface's accessible name |
| `barrierLabel` | `string` | The dismiss control's name; defaults to "Close" |
| `barrierStyle` | `object` | So a gesture can drive the barrier's opacity with the drag |
| `placement` | `"end" \| "center"` | Edge-anchored, or centred |
| `onFocusChange` | `(el, cycle) => void` | Reports the focused element and the current cycle — for specimens, not for product code |

## Flutter

Illustrative.

```dart
MonoModal(
  onClose: () => Navigator.of(context).pop(),
  semanticLabel: 'Select country',
  barrierLabel: 'Close Select country',
  child: CountryList(),
)
```

Flutter's own primitives cover the exclusion triad — `ExcludeFocus`, `IgnorePointer` and
`ExcludeSemantics` applied together — and `FocusScope` provides the trap. The contract specifies the
outcome; each platform reaches it with its own materials.
