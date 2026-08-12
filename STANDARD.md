# The monokit standard

One adaptive system. Not a web kit and a native kit that happen to share colours — one set of
decisions, resolved differently by context, with a machine-readable contract underneath so a
second platform can implement it without reading CSS.

## Where authority sits

```
specification (monorithm/monokit-design)   ← authoritative, implementation-agnostic
        │
        ├── contract/*.json                ← this realization's build source
        │        │
        │        ├── tokens/*.css          ← generated
        │        └── dart/*.dart           ← generated
        │
        └── other realizations             ← conform independently
```

The specification owns every canonical number. `contract/` is a machine-readable **mirror** of
those numbers plus this realization's own resolution choices — it is the source of truth for the
generated outputs, and nothing more. Each contract file names its owning spec doc in a `spec`
field. **Where the two disagree, the specification wins and the contract is what changes.**

This division is the specification's own: governance retires D21 and makes the token build
pipeline each realization's concern, while keeping the numbers themselves single-sourced upstream.

## The three axes

Adaptation resolves three orthogonal inputs. Conflating them is the classic cross-platform
mistake — a touch-screen laptop is pointer-dense but touch-capable.

| axis | values | resolved from | changes at runtime |
|---|---|---|---|
| Width class | compact · medium · expanded · wide | layout constraints, per scope | yes, continuously |
| Density | touch · pointer | primary input device, once | no — session-stable |
| Input capability | hover, precisePointer, hardwareKeyboard, touch (a set) | live device events | yes, per interaction |

On the web, density resolves through `@media (pointer: coarse)` with `[data-density]` as the
explicit developer override. On Flutter it resolves through a provider. **The contract specifies
the outcome, not the mechanism**; each platform uses its own materials.

Density is never a user-facing setting, and never flips mid-session.

## What does not adapt

Invariants. Any of these varying by platform is a bug, not a feature: token semantics, hierarchy,
type roles, honest-state vocabulary, motion schemes, icon language, the media canvas, and brand.

What does adapt: composition, density, affordance, and idiom.

## Containment: two siblings, not two systems

`ListGroup` and `Card` are different components, and the designer picks. The distinction is
content, not platform:

- **ListGroup** — full-bleed rows, header in the margin, hairlines inset to the text column. The
  default for anything list-shaped, at every density.
- **Card** — a bounded object with its own identity: a product, an order, a media item. Hairline
  edge, radius by surface size, no shadow at rest.

Neither is the "mobile" or "desktop" answer. A settings list is a ListGroup on a desktop too, and
a product is a Card on a phone.

## Reading the contract

```json
{
  "family": "space",
  "spec": "10-tokens/04-space-and-layout.md",
  "axes": ["density", "widthClass"],
  "groups": { "density": { "touch": { "minTarget": { "value": "44px", "description": "…" } } } }
}
```

Every token carries its value and, where the rationale is load-bearing, a `description`. The
generator emits those descriptions as comments into **both** outputs — a Flutter engineer reading
generated Dart needs "borders and light, not shadows" more than a web developer does, not less.

## The build

```
node build/generate.mjs           # write tokens/*.css and dart/*.dart
node build/generate.mjs --check   # re-emit and diff; exits 1 and names what drifted
```

`build/emit.js` holds the emitters as plain functions with no imports, so the same code runs under
Node or in a browser sandbox. `build/generate.mjs` is only I/O and reporting.

**`tokens/*.css` and `dart/*.dart` are generated.** Editing them by hand is what `--check` exists
to catch: it reports the specific properties that no longer match, because a hash manifest fails
at exactly the moment it cannot tell you why.

Not generated, and hand-owned: `tokens/fonts.css` (@font-face, binary paths), `tokens/native.css`
(platform geometry that aliases generated tokens), `base/`, `parts/`.

### CSS variable names are load-bearing

The generator emits the names both realizations already depend on — `--primary`, `--space-16`,
`--row-touch-1`. The neutral source carries richer structure internally; renaming the outputs
would break everything and buy nothing.

## Adding a token

1. Add it to `contract/<family>.json` with a `value` and, if the reason is not obvious, a
   `description`.
2. If its CSS name is irregular, add it to `CSS_NAME` in `build/emit.js`.
3. Regenerate. Check the diff is only what you intended.

If the token is a **new canonical number**, it does not belong here first — it belongs in its
owning spec doc, and the contract mirrors it afterwards.

## Adding a component contract

`contract/<component>.json`, with `clauses` as MUST / SHOULD / NEVER in the specification's own
voice. `Pressable` and `Icon` are the reference pair: primitives first, because everything else
composes from them.

A clause states an **outcome** a platform can be held to, not a mechanism:

- Good: "Render the pressed state within one frame of contact."
- Bad: "Use a CSS transition on transform."

## Conformance

An implementation conforms when it realizes the specification. Checked by review, not by lint —
mechanical enforcement was declined deliberately. What review checks:

- **Tokens** — styles resolve from semantic tokens only; no literal colours, durations, radii or sizes in component bodies.
- **States** — every honest state the data can occupy renders: pending, reconciling, failed-with-retry.
- **Motion** — every animation binds to a named role; reduced motion collapses it.
- **Layer** — the component declares its z-layer; anything above content justifies its scrim or glass.
- **Adaptivity** — behaviour specified per width class and modality; every gesture ships its pointer and keyboard alternative in the same change.
- **Accessibility** — semantics, focus order, contrast, target sizes, text scaling.

## Precedence

1. The four locked decisions — no separate language name, emerald on mist, calm chrome with expressive moments, widgets-first.
2. The specification, within each doc's declared ownership.
3. Any realization, including this one.

Deviations are written up in `record/AMENDMENTS.md` before they ship, never applied quietly.
