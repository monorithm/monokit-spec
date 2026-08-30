# TrustBadge

A tiered credential, stated without flattery or shame. It reports how far a party has been vouched
for, and the lowest tier is a starting position rather than a warning.

> **Not in the web realization yet.** This component exists in the Flutter package
> (`MonoTrustBadge`, 3.1.0) and was contracted afterwards, which is the wrong order — the record
> is in `record/AMENDMENTS.md`. The clauses below are normative regardless of which realization
> gets there first.

## The tier is a count, not a colour

Filled marks against unfilled ones, and the tier's name in text beside them. Either signal alone
fails somebody: colour alone fails a colour-blind reading, marks alone are a puzzle with no key.

That is also why the ladder has no red rung. An unattained tier is **not an error state** — nobody
has done anything wrong by not having climbed yet — so it takes the same neutral treatment as
every other tier. The word "unverified" does not appear anywhere near it.

## Clauses

```monokit-clauses trustbadge
```

## Accessibility

One node, carrying the tier name and its position in the ladder. A row of marks read out
individually says nothing a person can use.

## Do and don't

```monokit-do
Name the tier. "Street" is a place on a ladder; three dots on their own are a riddle.
```

```monokit-dont
Reach for destructive or warning ink on the lowest tier. It is a rung, and shaming somebody for
standing on it is how a ladder stops being climbed.
```

## Tokens

```monokit-tokens --primary --muted-foreground --space-4
```

## Flutter

Illustrative.

```dart
MonoTrustBadge(tier: 2, tierCount: 3, label: 'City')
```
