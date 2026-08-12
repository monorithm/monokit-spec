# Accessibility audit

What the 15 built components get right and wrong against `40-systems/13-accessibility.md`,
read in full on 2026-08-10. Nothing here is fixed yet.

The doc's own bar: **every component ships with (1) a verified contrast pair, (2) semantics
through the shared primitives, (3) reduced-motion behaviour, (4) a keyboard path, and (5) a hit
target meeting the density minimum. A component missing any of the five is incomplete, not
"shippable with known issues."**

Against that bar, **no component in this project is currently complete** — every one fails (1) or
(4), most commonly both.

---

## Blockers

> **A1 and A2 are closed.** `components/overlays/Modal.jsx` now owns the focus trap, the background
> exclusion, the restore-to-trigger and the labelled barrier; `Sheet` composes it. Verified by
> behaviour rather than by attribute: the trigger cannot take focus while the sheet is open, Tab
> cycles both directions without escaping the layer, and Escape returns focus to the trigger.
> A3 and everything below remains open.

### A1 · The sheet is a roach motel
`components/overlays/Sheet.jsx`

Spec §6.2 requires modal overlays at e3 to trap focus for their lifetime; §6.3 requires focus to
return to the trigger on dismiss, and requires the barrier to be **a labelled semantic dismiss
control**. The sheet does none of the three: Tab escapes into the screen behind it, focus is never
captured or restored, and `.mk-sheet-scrim` is a bare `<div>` with a pointer handler — invisible to
assistive technology.

The doc names this exact failure: *"every modal is a roach motel for TalkBack/VoiceOver users
unless the app adds its own close button."*

The country picker is the only overlay in the reference surface, so this is the flagship path.

### A2 · No focus trap means the background stays traversable
Same file. Spec §6.2: the background must be excluded from traversal **and semantics** while a
modal is open. Nothing applies the `ExcludeFocus` + `IgnorePointer` + `ExcludeSemantics` triad
(web equivalent: `inert` on the screen behind).

### A3 · Icon-only buttons are unlabelled at the call site, with no assert
`components/actions/Button.jsx`, `Pressable.jsx`

`Button` accepts `label` and applies it as `aria-label` when icon-only — correct. But §7 requires a
**debug assert when an icon-only child has no label**, and §13.1 lists it as an API requirement.
`Pressable` asserts target size (added last pass) but not labelling, so an unlabelled icon button
ships silently. `ScreenHeader`'s back button passes a label; nothing enforces that the next one will.

### A4 · Physical direction properties break RTL
`parts/lists.css`, `parts/display.css`, `parts/forms.css`

Spec §8: *"All new and migrated layout MUST use directional types."* Four places use physical
properties and will mirror wrongly:

| Rule | Property | Effect in RTL |
|---|---|---|
| `.mk-row[data-separator]::after` | `left` / `right` | separator inset lands on the wrong edge |
| `.mk-row-hit` (interactive trailing) | `right:auto` | press target carves out the wrong side |
| `.mk-avatar-edit` | `right:0` | camera affordance jumps to the leading corner |
| `.mk-switch-knob` | `left:2px` + `translateX(20px)` | knob travels the wrong way |

Web equivalents are `inset-inline-start` / `inset-inline-end`. The Icon component already mirrors
its seven directional roles correctly, so the glyph layer is done and the layout layer is not.

---

## Contract violations

> **A4 and B1 are closed.** The four physical-direction rules are logical, proven by
> `guidelines/native-rtl.card.html` — identical markup in `dir=ltr` and `dir=rtl`, with the avatar,
> its edit affordance, the separator inset, the chevron, the press-target carve-out and the switch
> knob all mirroring. The four unverified colour pairs were measured: two passed and are recorded,
> two failed and were fixed by completing the brand and neutral axes with `primaryText` and
> `mutedText`. A3 is closed too — `Pressable` now asserts on a missing accessible name.

### B1 · Unverified colour pairs
Spec §3: *"Components MUST consume tokens in pairs. Mixing pairs is out of contract — contrast is
unverified there."* Four component styles mix:

| Where | Pair used | Status |
|---|---|---|
| `.mk-input`, `.mk-picker`, `.mk-otp-cell` | `foreground` on `muted` | not in the verified table; `muted` pairs with `mutedForeground` |
| `.mk-input::placeholder` | `mutedForeground` on `muted` | not verified (the table verifies it on `background`) |
| `.mk-btn-soft` | `primary` on `primarySoft` | not verified; the table verifies `primaryForeground` on `primary` |
| `.mk-brand-ink` | `primary` on `background` | not verified |

None is likely to *fail* — `foreground` on `muted` is near-19:1 by inspection. But the doc's rule is
about verification, not likelihood, and it makes an unverified pair a review blocker. These need
either measuring and adding to the table upstream, or swapping to verified pairs.

### B2 · No live regions anywhere
Spec §7 requires: `Button` while pending announces via live region; `Field` error text live-regions
(this one **passes** — `role="alert"`); progress announces once.

`Button`'s `pending` state swaps to a spinner with no announcement, so an in-flight action is silent.
The OTP resend timer (§11) should announce **at start, halfway, and zero** — currently it renders
updating text with no live region at all, which is the safe failure but not the required one.

### B3 · OTP semantics diverge from the spec
`components/forms/InputOtp.jsx`

Spec §7 (Forms): *"OTP announces 'digit n of 6' per box and the full code on completion."* This
implementation uses one hidden input owning all six digits with a single label, so per-digit position
is never announced. The single-input approach is better for paste and platform autofill, which is why
it was chosen — but it is a deviation and belongs in `AMENDMENTS.md` if kept.

### B4 · Text scaling is untested, not unsupported
Spec §4 sets 200% with no loss of content or function, and requires minimum heights to derive from
**scaled line-height**, not spacing constants.

Partial credit: every control uses `min-height`, not `height`, so containers grow rather than clip —
the single most important property. But the minimums are spacing constants (`--row-1`), and nothing
has been tested at 1.3 or 2.0. `.mk-appbar-title` uses `white-space:nowrap` + ellipsis, which will
truncate rather than reflow. The OTP row (§4: *"boxes grow with scale; the row wraps on compact"*)
cannot wrap — it is a fixed six-column flex row.

### B5 · High contrast is not consulted
Spec §12 requires a derived response: borders strengthen, `mutedForeground` promotes a step, glass
falls back to opaque, `scrim` upgrades to `scrimStrong`, focus ring widens. No `prefers-contrast`
query exists in the project.

---

## Passes worth protecting

- **Reduced motion is structural, not per-component.** `tokens/motion.css` collapses every duration
  at the token layer and stops loops — exactly what §5 demands (*"the collapse happens inside the
  motion system, not per-component `if` checks"*). This is the strongest a11y property here.
- **Focus binds to `focus-visible` only**, painted outside the bounds at width 2 / offset 2, so it
  never shifts layout — §6.4's two hard requirements, both met.
- **Keyboard activation** on every pressable (Enter and Space), added last pass.
- **Hit targets** meet the density minimum in both scopes, with slop that decouples visual from
  target size — §10's structural enforcement, verified by measurement.
- **`Field`** pairs label, control and error, and live-regions the error via `role="alert"`.
- **Autofocus discipline** — only the OTP screen autofocuses, which is exactly §6.1's allowance
  (*"reserved for screens whose single subject is an input"*).
- **Icon RTL mirroring** for the seven directional roles, and `decorative` excluding from semantics.
- **`Avatar`** renders a declared placeholder rather than faking a photo, so nothing announces as an
  image that is not one.

---

## What is not covered

`09-components-media-commerce.md` §9 requirements (required `captions:`, `transcript:`, `alt:`
parameters) apply to components that do not exist here yet. They are worth reading **before** the
feed and gallery are built, not after — the doc's phrasing is that those components are "specced
accessible-first", and retrofitting a required parameter is a breaking change.

`10-components-core.md` was not read this pass. It owns Button, Input, Field, Switch, Sheet, Screen
and ScreenHeader — every core component here — so an audit against it is the obvious next read.

---

## Suggested order

1. **A1 + A2** together — one focus-trap-and-restore mechanism in `Sheet`, plus a labelled barrier.
   Fixing them separately means touching the same file twice.
2. **A4** — mechanical, contained to four CSS rules, and it unblocks any RTL work later.
3. **A3** — a dozen lines in `Pressable`, and it prevents the next unlabelled button rather than
   fixing a current one.
4. **B1** — decide per pair: measure and record upstream, or swap to a verified pair.
5. **B2** — `Button` pending and the resend timer are the two live regions the built surface needs.
6. **B4** — needs a text-scale test pass before it can be scoped honestly.
