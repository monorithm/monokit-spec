# Pager

A real swipe, not a carousel. The track follows the finger, resists past the end stops, and settles on
the spatial spring.

```monokit-example pager-basic
```

## Thresholds

```monokit-scale interaction.gestures
```

Travel past the commit fraction of the width advances; a release above the commit velocity advances
regardless of distance. Anything shorter snaps back.

**The decision reads the travel it measured, not a value captured in an earlier render.** A flick
whose move and release land in the same tick would otherwise be judged on stale travel and silently
refuse to commit.

## One axis

A pager claims the horizontal axis only, so vertical scrolling still works inside it. One gesture axis
per scrollable region is resolved at design time, never by recognizer arbitration at runtime.

## Clauses

```monokit-clauses pager
```

## Every gesture has an alternative

Chevrons at pointer density and arrow keys from the keyboard, shipped **in the same change as the
gesture**. This is a MUST, and this realization currently fails it — see
[Status](#/about/status).

## Accessibility

Advancing is always a user action. A pager never auto-advances on a timer, which removes both the
motion problem and the "it moved while I was reading" problem at once.

Pair it with [PageDots](#/components/page-dots) so position is legible without performing a gesture.

## Tokens

```monokit-tokens --gesture-dismiss-fraction --gesture-rubber-band --spring-spatial-default
```

## React

Illustrative.

```jsx
<Pager index={i} onIndexChange={setI}>
  <Intro /><Discover /><Buy />
</Pager>
```

## Flutter

Illustrative.

```dart
MonoPager(index: i, onIndexChanged: setI, children: const [Intro(), Discover(), Buy()])
```
