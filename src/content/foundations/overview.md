# monokit

monokit is a design language, the way Cupertino and Material are languages rather than component
lists. It powers immersive social-commerce surfaces — video feeds, live video, calls, voice notes,
camera capture, chat, document readers, and commerce — across mobile, web, and desktop.

**This site is the specification.** Where it disagrees with any realization, including the Flutter
package, this site wins. See [Governance](#/about/governance) for how that authority works and what
it replaced.

## One thing at a time

"Mono" is the philosophy: at any moment the interface commits to exactly one primary subject, and
everything else recedes. Six pillars carry it.

| Pillar | In one sentence |
|---|---|
| Monofocus | Every screen declares one primary subject; feeds present one item per viewport; flows advance one decision at a time |
| Content is the interface | Media renders full-bleed on a true-black canvas; controls are translucent layers *over* content, never frames *around* it |
| Calm chrome, expressive moments | Calm for all utility motion; expressive springs reserved for social and emotional moments |
| Honest interfaces | Pending is visible, optimistic is reconciled, failure is actionable, expiry is deterministic; the UI never fakes success |
| Fool-proof by reach and forgiveness | Primary actions live in the thumb arc; destructive actions require distance or confirmation; every gesture has a visible alternative |
| One system, every screen | The same language adapts by input modality and width — never by rewriting; density and affordances adapt, meaning and hierarchy do not |

## Four locked decisions

Not re-litigated in any page, review, or pull request. Amending one takes the system owner.

1. **No separate language name.** The design language and every realization of it are all just
   "monokit".
2. **Palette: emerald on mist** — emerald primary, cool mist slate neutrals. Values in
   [Color](#/styles/color).
3. **Motion: calm chrome, expressive moments** — chrome moves fast and quietly; springs are
   reserved for reactions, purchases, and going live.
4. **Architecture: widgets-first** — the screen contract assumes no host-framework dependency in
   its core.

## The surface language

Flat surfaces separated by hairline borders and translucency: **borders and light, not shadows**.
Resting surfaces are flat; shadows exist only at overlay tiers. In light mode `card` and
`background` are the same white, so the hairline *is* the card — never assume a luminance
difference.

## What every component owes

A component is complete when it ships all five. Missing one makes it incomplete, not "shippable
with known issues".

1. A verified contrast pair
2. Semantics through the shared primitives
3. Reduced-motion behaviour
4. A keyboard path
5. A hit target meeting the density minimum

[Accessibility](#/foundations/accessibility) owns all five.
