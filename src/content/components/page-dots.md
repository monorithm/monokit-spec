# PageDots

Position, stated quietly. Dots report where the user is in a short sequence and nothing else.

```monokit-example dots-basic
```

## The active dot widens

It does not only change colour. Widening carries position for a colour-blind reading, and it is the
one shape change chrome is allowed here.

Movement is on the indicator role — a curve. Dots are chrome.

## Clauses

```monokit-clauses pagedots
```

## Accessibility

The sequence exposes itself as **one node reporting position and length**, not as a row of anonymous
dots. Five dots is five stops for a screen reader otherwise, none of which says anything.

Dots stay non-interactive unless each one meets the density minimum. A four-pixel tap target that
navigates is worse than no target.

## Do and don't

```monokit-do
Cap it at a handful. Beyond that, position is a number — "3 of 12" — not a picture.
```

```monokit-dont
Make dots the only way to see progress through a flow. A stepper says which step; dots only say how
many.
```

## Tokens

```monokit-tokens --space-8 --space-20 --primary --muted
```

## React

Illustrative.

```jsx
<PageDots count={3} index={i} />
```

## Flutter

Illustrative.

```dart
MonoPageDots(count: 3, index: i)
```
