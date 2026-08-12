# Motion

> **Provisional.** The values on this page are generated from the contract and are authoritative.
> The guidance is paraphrased from a secondary summary rather than from the document that owns this
> subject, which has not been read. See [Status](#/about/status).


Two schemes and only two.

**Calm** carries all utility motion: duration-and-curve driven, fast, decelerated. The user should
notice only its absence.

**Expressive** springs are a budget, not a style — spent on exactly three moments: a reaction
landing, a purchase succeeding, and going live.

## Durations

```monokit-scale motion.durations
```

## Easing

```monokit-scale motion.easings
```

`monoOut` is the signature: near-instant launch, long soft settle.

## Roles

Components bind to a **role**, never to a raw duration. Per-component overrides are deprecated.

```monokit-scale motion.roles
```

Enters decelerate. Exits accelerate and run one step shorter than their enter. Durations are never
composed by arithmetic.

## Springs

Springs animate position and scale; durations and curves animate colour and opacity. The one
sanctioned crossover is the **gesture bridge**, where a drag release settles on a critically damped
effect spring seeded with the release velocity.

```monokit-scale motion.springs
```

## Loops and delays

```monokit-scale motion.loops
```

```monokit-scale motion.delays
```

## Choreography

One moving subject at a time. Two things animating for two different reasons means one of them is
wrong. **Chrome never staggers.**

## Reduced motion

Everything collapses to an opacity fade of at most the `fast` duration; loops stop; haptics remain.
The collapse happens inside the motion system, so components ask for a role and receive one that is
already reduced.
