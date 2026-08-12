# Color

> **Provisional.** The values on this page are generated from the contract and are authoritative.
> The guidance is paraphrased from a secondary summary rather than from the document that owns this
> subject, which has not been read. See [Status](#/about/status).


Emerald on mist. A near-monochrome field of cool mist slate neutrals with one rationed accent.

Every neutral shares the mist hue family, so surfaces read as one material under different light
rather than a collage of greys. **Colour is information, never decoration**: emerald appears only
where the user acts or the brand speaks, and status hues only when the system reports state.

> If a screen is colourful, something is wrong.

The design source is OKLCH; a realization may store sRGB hex. These are the verified hex.

## Surfaces and brand

```monokit-swatches colors.light
```

## Dark

Dark mode lowers chrome energy: `primary` becomes the dimmer `token:colors.dark.primary` so media
and status own the brightness. **That value is a brand *surface*, not an ink** — brand as ink in dark uses
`sidebarPrimary`.

```monokit-swatches colors.dark
```

## On media

Mode-invariant. The media canvas is always dark, in both themes, so letterboxing disappears.

```monokit-swatches colors.invariant
```

## Every axis is four roles

Status, brand and neutral each carry solid, on-solid, soft, and an ink verified against that soft
surface — never a single colour, and never an ink borrowed from a neighbouring role.

Brand's soft ink is `primaryText`; the neutral well's is `mutedText`. Both exist because a
three-role axis has no verified ink for its own soft surface, and both of this realization's measured
contrast failures were exactly that gap. See [Accessibility](#/foundations/accessibility) for the
ratios.

Solid fills are for badges, icons, and large text. **Body-level messaging uses the soft surface with
its `*Text` ink.** In dark mode status fills are bright with *dark* foregrounds; white on a
dark-mode status fill is a contrast bug.

`success` is not `primary`, and `destructive` is never an emphasis colour.

## Elevation and depth

Borders and light, not shadows. Resting surfaces are flat and hairline-separated; shadows exist only
at overlay tiers. In light mode `card` and `background` are the same white, so **the hairline is the
card**.

In dark mode the border is translucent white, so it composites over any surface — and two stacked
hairlines double their alpha and read as a seam. Collapse shared edges.

## Glass

Exactly three parts: fill, border, and a `token:colors.invariant.glassBlur` backdrop blur. Over media it always uses the
dark-context recipe regardless of app theme. Glass carries **controls, not paragraphs**; body text on
glass over moving video is forbidden. Glass never stacks on glass, and where blur is unavailable it
degrades deterministically to the strong scrim plus a border.

## Backgrounds

No images, no gradients, no patterns, no textures behind content. The one sanctioned gradient in the
system is the **scrim** — a neutral black fade that buys legibility over media. Scrims are never
tinted to brand the media.
