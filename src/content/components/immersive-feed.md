# ImmersiveFeed

The scroll primitive for a full-viewport vertical media feed. It owns layout, gesture and resource
policy, and composes the item presentation as its child.

> **Not in the web realization yet.** Ships in the Flutter package (`MonoImmersiveFeed`, 3.1.0);
> contracted afterwards. See `record/AMENDMENTS.md`.

## Why this is not a Pager

[Pager](/components/pager) assumes a discrete, countable set — that is what lets it show
[PageDots](/components/page-dots) and say "3 of 7". An unbounded feed has no count to indicate,
and pretending otherwise produces an indicator that lies.

The deeper reason is resource policy, which a pager does not have and cannot acquire. The current
item decodes and plays, its immediate neighbours prefetch, and distant items release. On a low-end
device that is not an optimisation to get to later — it is the difference between a feed that runs
and one that is killed by the platform.

## It owns exposure

The primitive is the only thing that knows what was actually seen: it is what decides when an item
is the current one. So it emits the exposure event, and every reach figure downstream depends on
that rather than on the application approximating from scroll offsets.

An approximation here is not a rounding error. It is the number a merchant is shown about their own
work.

## One axis

Vertical swipe advances, and it is the only gesture axis in the region. A media set inside an item
pages in the **detail view**, which is its own region — never nested inside the feed, where two
axes would arbitrate against each other at runtime and lose about half the time.

Wheel and arrow keys ship with the gesture, not after it.

## Clauses

```monokit-clauses immersivefeed
```

## Accessibility

Virtualisation must not break traversal: reading order is defined across recycled items, and no
live region sits on anything that re-renders more than once a second — which a feed does
constantly.

Under reduced motion it snaps without animated physics, and removes no information doing so.

## Tokens

```monokit-tokens --media-canvas --on-media --scrim
```

## Flutter

Illustrative.

```dart
MonoImmersiveFeed(itemCount: n, itemBuilder: (context, i) => Post(items[i]))
```
