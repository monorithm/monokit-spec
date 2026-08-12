# Iconography

One stroke voice, permanently.

Icons are chrome, and chrome recedes. A stroke icon labels an affordance without filling visual mass,
so full-bleed media and content stay primary. A filled icon competes with photography; a 1.5-stroke
line sits over it like a caption.

**No solid or duotone tier ever ships.**

## Grid and stroke

| Spec | Value |
|---|---|
| Design grid | 24 × 24 |
| Stroke, resting | 1.5 |
| Stroke, active or selected | 2.0 |
| Caps and joins | round |
| Fill | none, permanently |

## Sizes

```monokit-scale space.icons
```

Chrome resolves its default from density: `icon.xs` at pointer, `icon.sm` at touch. The smallest size
carries the system's one sanctioned stroke deviation — an optical floor of
`token:space.icons.strokeXs`, applied by the stylesheet and never per component.

**Nothing renders below 16** — use nothing. **Nothing renders above 32** — that is an illustration
and has left the system.

## Icons are roles, not pictures

Callers ask for `like`, never for a vendor's heart glyph. The role-to-glyph mapping is the system's
private concern, which is what lets a vendor change in one place and guarantees one metaphor per
action product-wide.

One glyph per meaning. Multiple roles may share a glyph — `follow` and `addParticipant` converge —
but never the reverse.

```monokit-do
`<Icon name="back" />` — a role. It mirrors itself in RTL because the catalog says it should.
```

```monokit-dont
`<Icon name="nav-arrow-left" />` — a vendor glyph id. It bypasses the indirection the catalog exists to provide.
```

## Stroke states

| State | Stroke | Colour |
|---|---|---|
| Resting | 1.5 | the inherited text token |
| Hover or focus | 1.5 | the component's hover foreground — no weight change |
| Active or selected | 2.0 | `primary` in chrome, `onMedia` over media |
| Disabled | 1.5 | the same token the component's disabled label uses |

This holds for every role, reactions included. A liked heart is an outlined heart at stroke 2.0 in
the live colour — never a filled glyph.

## Colour and alignment

Icons inherit the colour of the text they accompany. Never a hardcoded colour, never an
opacity-modulated brand colour.

An icon centres optically against the cap height of its label, with a spacing token between them.
Icon before label in LTR, mirrored in RTL.

## Mirroring

These roles mirror in RTL: `back`, `forward`, `chevronLeft`, `chevronRight`, `reply`,
`forwardMessage`, `send`.

Playback transport and checkmarks never mirror — a play triangle's direction is a learned convention,
not a reading-order artifact.

## Vendors

HugeIcons stroke-rounded is primary; Iconoir regular is the geometrically compatible secondary, and
supplies the expressive face family for reaction pickers. Both are MIT. Versions are pinned exactly:
a vendor redrawing a glyph in a patch release is a silent brand change.

This realization ships Iconoir, because HugeIcons' free set distributes no SVG assets. Ten roles have
no glyph and are **absent rather than approximated** — see [Status](#/about/status).
