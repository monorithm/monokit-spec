# Adaptive design

A monokit screen is the *same screen* everywhere, recomposed rather than redesigned.

Adaptation is systemic, not component-local: width class, density, and input capability are
resolved once and read from a scope. **Components never probe the platform themselves.**

## The three axes

Conflating these is the classic cross-platform mistake — a touch-screen laptop is pointer-dense but
touch-capable, and an iPad with a keyboard is touch-dense but keyboard-navigable.

```monokit-table space.density
```

| Axis | Values | Resolved from | Changes at runtime |
|---|---|---|---|
| Width class | compact · medium · expanded · wide | layout constraints, per scope | yes, continuously |
| Density | touch · pointer | primary input device, once | no — session-stable |
| Input capability | hover, precisePointer, hardwareKeyboard, touch | live device events | yes, per interaction |

Density is **layout-affecting and therefore session-stable**. It must not flip mid-session on a
hybrid device: someone who touches a laptop screen once does not get a reflowed interface. Capability
does respond live.

Density is never a user-facing setting. Subtree overrides exist for embedded contexts — a kiosk pane
inside a desktop app — and are developer configuration.

## What does not adapt

Any of these varying by platform is a bug, not a feature.

| Invariant | Meaning |
|---|---|
| Token semantics | `primary` is the same role on every platform |
| Hierarchy | The primary subject, primary action, and reading order are identical at every width |
| Type roles | A title is a title everywhere; fluid scaling changes size, never role |
| Honest states | Desktop users see the same pending badge as mobile users |
| Motion schemes | Desktop does not get "more" animation |
| Icon language | Same stroke voice, same catalog. No platform-specific glyph swaps |
| Media canvas | Always-dark and full-bleed at every width |
| Brand | monokit does not cosplay as Cupertino on iOS or Material on Android |

What *does* adapt: composition, density, affordance, and idiom.

## Every gesture has an alternative

Shipping a gesture without its pointer and keyboard equivalents is an accessibility and desktop bug.
The alternative ships in the same change as the gesture, not later.

| Touch gesture | Pointer | Keyboard |
|---|---|---|
| Vertical swipe (advance) | wheel with snap; hover chevrons | Arrow keys, `j`/`k` |
| Horizontal swipe (page) | hover chevrons; drag allowed, not required | Arrow keys |
| Long-press (context menu) | right-click | `Menu` key, `Shift+F10` |
| Swipe row actions | hover-revealed inline actions | context-menu items |
| Drag-dismiss | close button, always present | `Escape` |
| Pull-to-refresh | visible refresh affordance | scoped refresh shortcut |

**Hover reveals, but never contains.** A hover-revealed action must also exist in the context menu.

## Monofocus survives every width

More pixels never means more simultaneous subjects. Expanded layouts gain *context* — rails, panes —
around the one subject. They never gain a second subject of equal weight.

The feed never becomes a grid on desktop. A grid of nine autoplaying videos is nine subjects.

Drag the width and watch one item recompose across all four classes: full-bleed with a bottom bar,
letterboxed with a side rail, a centred column with the rail pinned and the actions moved out, then
a trailing context pane. The same destinations in the same order throughout — one design, recomposed.

The recomposition here is drawn by the specimen. No component in this realization reads a width-class
scope yet, which the [Status](#/about/status) page records as the largest gap between this
specification and what implements it.

```monokit-example feed-recomposition
```

