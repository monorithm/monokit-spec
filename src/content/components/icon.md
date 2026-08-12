# Icon

Stroke-only, permanently. Icons are chrome, and chrome recedes — a 1.5-stroke line sits over media
like a caption, where a filled glyph would compete with it.

There is no solid tier and there never will be. That includes the states people reach for a fill to
express: a liked heart is an outlined heart at stroke 2.0 in the live colour.

## Roles, not pictures

Ask for what the user means. The role-to-glyph mapping is the system's private concern, which is
what lets a vendor change in one place and guarantees one metaphor per action across a product.

```monokit-example icon-roles
```

```monokit-do
`<Icon name="back" />` — a role. It mirrors itself in RTL because the catalog says it should, and it
carries an accessible name without being told one.
```

```monokit-dont
`<Icon name="nav-arrow-left" />` — a vendor glyph id. It still renders, and it warns once, because
bypassing the indirection is how a product ends up with two glyphs for one meaning.
```

## Sizes

```monokit-scale space.icons
```

Chrome resolves its default from density rather than being told: the same call site is 16 at pointer
and 20 at touch.

```monokit-example icon-density
```

Nothing renders below the smallest size — use nothing instead. Nothing renders above the largest:
that is an illustration, and it has left the system.

## Stroke states

```monokit-example icon-states
```

| State | Stroke | Colour |
|---|---|---|
| Resting | 1.5 | the inherited text token |
| Hover or focus | 1.5 | the component's hover foreground — no weight change |
| Active or selected | 2.0 | `primary` in chrome, `onMedia` over media |
| Disabled | 1.5 | the same token the component's disabled label uses |

The smallest size carries the system's one sanctioned deviation: an optical stroke floor, applied by
the stylesheet at that size and never per component.

## Anatomy

```monokit-anatomy icon
```

## Clauses

```monokit-clauses icon
```

## Accessibility

An icon carries a semantic label unless it is explicitly decorative, and the catalog supplies a
default so the common case is right without effort. An icon-only action also gets a tooltip at
pointer density.

Seven roles mirror in RTL: `back`, `forward`, `chevronLeft`, `chevronRight`, `reply`,
`forwardMessage`, `send`. Playback transport and checkmarks never mirror — a play triangle's
direction is a learned convention, not a reading-order artifact.

A destructive action never stands on an icon alone.

## Tokens

```monokit-tokens --icon-chrome --icon-stroke --icon-stroke-active --icon-stroke-xs
```

## What this realization ships

The specification adopts a primary and a secondary vendor on identical geometry. This project ships
the secondary, because the primary distributes no SVG assets — and **ten roles have no glyph in it**.

They are absent rather than approximated. A look-alike from a neighbouring metaphor is worse than a
gap: it teaches the wrong association and it is invisible in review. `live` is drawn as the specified
pulsing dot chip instead.

```monokit-example icon-absent
```

## React

Illustrative. This snippet shows intended API; it is not a published package.

```jsx
<Icon name="back" />                    {/* size resolves from density */}
<Icon name="like" active decorative />  {/* stroke 2.0 plus colour, no fill */}
<Icon name="cartAdd" size="lg" />       {/* explicit only when size is part of the design */}
```

| Prop | Type | Notes |
|---|---|---|
| `name` | role | From the catalog. A vendor id renders but warns |
| `size` | `xs \| sm \| md \| lg \| xl \| number` | Omit to resolve from density |
| `active` | `boolean` | Stroke 2.0 plus colour. There is no filled state |
| `color` | `string` | Only for a status hue; icons otherwise inherit |
| `label` | `string` | Overrides the role's default accessible name |
| `decorative` | `boolean` | Excludes it from semantics when an adjacent label already names it |

## Flutter

Illustrative.

```dart
MonoIcon(MonoIcons.back)                       // size from the density scope
MonoIcon(MonoIcons.like, active: true)         // stroke 2.0 plus colour
MonoIcon(MonoIcons.cartAdd, size: MonoIconSize.lg)
```

The role enum is the API surface on both platforms. A Flutter implementation resolves it against its
own glyph source; the contract fixes the roles, the geometry and the stroke states, not the asset.
