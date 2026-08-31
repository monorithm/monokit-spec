# Amendments

The specification wins. Anything this realization adds, changes, or gets wrong is recorded here
before it ships — never applied quietly.

## Withdrawn — corrections made after reading the specification directly

These three were written from a summary of the specification. Reading `07-interaction.md` and
`12-adaptivity.md` showed each to be wrong.

| Was | Now | Why |
|---|---|---|
| `--gesture-edge-width: 20px` | **Removed** | Spec 07 section 4: edge swipes are system and OS navigation, and monokit "never claims" them. There was no token to add. |
| `--gesture-dismiss-fraction: 0.35` | **0.30** | Spec 07 section 4 names 30% of the surface's height. The 0.35 was a platform convention, invented where a canonical number already existed. |
| Fling threshold 500 px/s | **700 px/s**, as `--gesture-dismiss-velocity` | Same clause names 700 px/s along the dismiss axis. It was previously hardcoded in two components rather than tokenized. |
| Density pinned to touch in `base/native.css` | **Resolved from the primary input device** | Spec 12 section 2.2: density resolves from the device (coarse to touch, fine to pointer), with developer overrides — not forced by a stylesheet. `[data-density]` is the sanctioned subtree override. |
| `Icon` took vendor glyph ids (`nav-arrow-left`) | **Semantic roles** (`chevronLeft`) | Spec 06: "Icons are roles, not pictures." Callers never name a vendor glyph. Vendor ids still render, with a one-time console warning, so the web realization's call sites keep working. |

## Standing additions

### 1. `--gesture-rubber-band: 0.55`

Displacement damping past an end stop. The specification names the dismiss thresholds but not the
resistance curve before them. **Nothing existing changes**; it gates recognition only, and the
motion tokens still do the animating. If a spec doc names a different figure, that wins.

### 2. Native chrome geometry (`tokens/native.css`)

`--appbar-height` · `--tabbar-height` · `--field-height-lg` · `--sheet-radius` ·
`--sheet-grabber` · `--safe-*` · `--keyboard-inset`

Geometry the platform imposes, which the web realization had no reason to name. Every one either
aliases a generated token or lands on the 4pt grid.

Control and row heights are deliberately **not** here. A `var()` alias resolves at the element that
declares it, so aliasing a density-varying token on `:root` freezes it to whatever `:root` resolved
and no `[data-density]` scope below can change it — which is exactly the bug that shipped 40px CTAs
on a touch surface. The density-resolved tokens are referenced at the point of use in `parts/*.css`
instead, and the separator inset is a `calc()` there for the same reason.

### 3. Resolved density aliases (generated)

`--min-target` · `--control-height` · `--gap-density` · `--row-1` · `--row-2` · `--row-3` ·
`--icon-chrome` · `--icon-stroke-chrome`

The spec names the touch and pointer columns as data; components need one name that resolves. These
are that resolution, emitted in four places from one definition in `build/emit.js` — `:root`
(pointer), `@media (pointer: coarse)` (touch), and both `[data-density]` scopes. No new values.

`--icon-chrome` and `--icon-stroke-chrome` implement spec 06's rule that chrome icons resolve their
default size from density: 20 with a 1.5 stroke at touch, 16 with the 1.75 optical floor at pointer.
An icon that declares no size takes them, in the cascade rather than in JavaScript — which is what
lets a density scope change icon size live.

### 4. `--reach-side` (D25)

A first-class token that flips every thumb-arc placement together for left/right-handed reach and
RTL. Specified in `04-space-and-layout.md` and owned by `12-adaptivity.md`; it was simply missing
here. Values: `start` | `end`.

### 5. `--icon-stroke-xs: 1.75`

The sanctioned optical stroke floor at 16px — the system's one stroke deviation. Applied by
`base/surfaces.css` on `[data-size="xs"]`, never per component, per spec 06.

## Recorded, not amendments

**The contract is not the language's source of truth.** `contract/*.json` is this realization's
build source. Governance's single-source rule puts every canonical number in its owning spec doc,
and D21's retirement makes the pipeline a realization concern. Each contract file names its spec
doc; where they disagree, the doc wins.

**Dark-mode brand ink.** `.mk-brand-ink` resolves brand ink to `--sidebar-primary` in dark, because
`--primary` #006045 is specified as a dimmer brand **surface**. The web realization already does
this for links and bar actions; this only names the rule.

**OTP digits take the content voice, not the mono register.** Mono is for machine-shaped strings the
user reads. A code the user types is content, so it gets Plex Sans with tabular figures.

**The auth flow's landing screen is not a sixth step.** It carries no step bar, so the locked
five-step decision holds.

**Ten icon roles are absent, not approximated.** `live`, `record`, `waveform`, `filePdf`, `sticker`,
`gif`, `captions`, `cameraFlip`, `receipt`, `unfold` have no glyph in the shipped vendor set. They
render as empty space of the correct size. `live` is drawn as the specified pulsing dot chip.

## Fixed after the contract caught them

Writing `contract/pressable.json` made two omissions visible that the components had shipped with:

1. **Keyboard activation was missing.** `Pressable` handled pointer events only, so Enter and Space
   did nothing on every affordance in the system — against its own MUST clause. Now handled by
   discriminating on `event.detail === 0`, which separates a keyboard-synthesised click from a
   pointer one without a reset flag.
2. **The minimum-target assertion was a SHOULD nobody had implemented.** It is now in
   `Pressable`, measured against the resolved `--min-target` and accounting for hit slop, and it
   fires in development. A 32px switch on a touch surface shipped twice before this existed.
3. **A cancelled gesture left a trace.** `Sheet` drove entry with a CSS keyframe and position with
   an inline transform. Releasing a drag re-added the keyframe, which restarts at its first frame,
   so a sheet released under the dismiss threshold dropped fully off screen and slid back up
   instead of settling in place — against spec 07 section 4. Position now has exactly one driver:
   an inline transform whose transition carries entry (emphasis), return (the spatial spring the
   spec names) and exit (one step shorter than the enter). There are no sheet keyframes left.
4. **The sheet had no exit at all** — it unmounted instantly. It now animates out and unmounts
   after, per spec 05.
5. **Gesture commits read render state.** `Sheet` and `Pager` decided commit-versus-return from
   `y`/`drag` in a render closure. A flick whose `pointermove` and `pointerup` land in the same
   tick judged the release on stale travel and silently refused to commit. Both now decide from a
   ref; the state exists only for painting.

## The brand and neutral axes gained a fourth role

Measuring the four previously-unverified colour pairs found two failures, and both were the same
structural gap rather than two unlucky values.

| Pair | Light | Dark | Verdict |
|---|---|---|---|
| `foreground` on `muted` | 17.71 | 14.24 | AAA — recorded |
| `primary` on `background` | 5.36 | 7.97 via `sidebarPrimary` | AA — recorded |
| `mutedForeground` on `muted` | **4.14** | 6.06 | fails AA for body text in light |
| `primary` on `primarySoft` | **4.45** | **1.76** | fails both; near-invisible in dark |

Every status carries four roles — solid, on-solid, soft, and an ink verified against that soft
surface. Brand and neutral carried three. There was no brand ink for `primarySoft` and no neutral
ink for `muted`, so components borrowed from a neighbouring role and landed outside the verified
set. `primary` in dark is specified as a brand *surface*, which is why borrowing it as ink measures
1.76.

Added: `primaryText` (#006045 light, #00BC7D dark) and `mutedText` (#4B585B light, #9CA8AB dark).
**Both values already existed in the palette** — the light brand ink is the dark brand surface, the
dark brand ink is dark `sidebarPrimary` — so no colour was invented, only given the role it was
missing. `.mk-btn-soft` and `.mk-input::placeholder` now use them.

## The overlay layer is fixed, not absolute

`.mk-modal-layer` was `position:absolute`, which made it depend on finding a positioned ancestor.
A phone-shaped specimen frame happens to provide one; an ordinary page does not — so on the
specification site the surface painted at document origin, off screen, **with its trap armed**.
Clicking a trigger appeared to do nothing while focus was locked into an invisible surface.

A modal covers the viewport, so the layer is `position:fixed`, and `.frame`/`.mk-contain` opt back
into containment for specimens that deliberately bound the overlay to a frame. Site chrome dropped
below the overlay tier in its own stylesheet: the consumer's furniture yields to the system's
layers, not the reverse.

**This is what DOM-only verification misses.** The earlier checks read the cycle order and the
background probe through `querySelector` and passed, because both were true — of a surface nobody
could see. Anything positional has to be measured against the viewport, at the scroll position a
reader would actually be at.

## Overlay accessibility moved into a primitive

`components/overlays/Modal.jsx` owns the four things every modal surface owes: a focus trap with
cycling Tab, a background excluded from focus, pointer **and** semantics, focus restored to the
trigger on dismiss, and a barrier that is a labelled `<button>`. `Sheet` composes it; `Dialog` and
`Drawer` inherit rather than reimplement.

Verified by behaviour, not by attribute — which matters, because `inert` on an ancestor leaves
descendants reporting `inert === false` while genuinely unreachable. The trigger cannot take focus
while the sheet is open; Tab wraps in both directions without leaving the layer; Escape closes and
returns focus to the trigger.

`Pressable` gained the second assert its contract requires: an icon-only target with no accessible
name warns in development. Tested by stripping a switch's label and re-rendering — one warning, the
element named, no false positives on the labelled ones.

## The non-button press path was unreachable

`Pressable` branched on `as === "button"` for `disabled` and `type` and nowhere else, so a
`Pressable as="div"` — a supported path, and the one the prompt recommends for media tiles — rendered
with no `role`, no `tabIndex`, and `tabIndex -1`. It announced as a generic div and could not take
focus at all.

Worse, it defeated the keyboard activation added earlier without failing loudly. That path discriminates
on `event.detail === 0`, and browsers synthesise that click for Enter and Space **only on natively
activatable elements**. A non-focusable div never receives one, so the mechanism could not fire and
nothing warned.

Non-native tags now emit `role="button"` and `tabIndex 0` (`-1` while disabled or pending), and carry
their own Enter/Space handler with `preventDefault` so Space does not scroll. `ListRow` uses
`as="button"` and was never affected; the page's flagship example was.

**Both handlers stay live on both paths, and `detail === 0` is the sole discriminator.** The first
attempt gated the click path on native tags, reasoning that the key handler owned the non-native case.
That was wrong: a detail-0 click is precisely how assistive technology activates a `role="button"`
element — browse-mode Enter, VO-Space, switch access and `element.click()` all arrive that way. The
guard produced a control that announced correctly as a button and could not be activated, which is
the ARIA custom-button pattern's exact failure mode; the pattern requires handling `keydown` **and**
`click`. There was never a double-fire to prevent: a non-native element receives no synthesised click
from a keypress, and a pointer tap's click carries detail 1.

**Why the earlier checks missed it:** they confirmed the element existed, was styled, and responded to
pointer events — all true. Keyboard reachability is a different question and needs asking directly:
`focus()` then `document.activeElement`, and a real `keydown`.

## Four rules stopped pointing one way

`.mk-switch-knob`, `.mk-switch::before`, `.mk-avatar-edit` and the `.mk-row-hit` carve-out used
physical `left`/`right`. All four are logical now, and `guidelines/native-rtl.card.html` is the
proof: identical markup in `dir=ltr` and `dir=rtl`, with the avatar, its edit affordance, the
separator inset, the chevron, the press-target carve-out and the knob travel all mirroring.

A transform has no logical equivalent, so the knob mirrors by flipping the sign of one variable.
While there, the knob's size and travel became derived from the track and the inset rather than
three literals that could drift apart.

## The header never aligned to the content column

Four places asserted it — the clause, the page prose, the example's own caption, and an anatomy pin —
and the render disagreed by 28px. `.mk-appbar` padded to a chrome gutter of 4 and its leading slot
reserved a target's width, so the title's start was `4 + 44 + gap` and **nothing in the rule referenced
`--page-inset`**. The title could not land on the content column at any width.

Spec 04 section 6 is explicit: the header takes the page inset for its horizontal padding. So the
component was wrong, not the prose. Three causes, found by measuring rather than by reading:

1. **Padding was a chrome gutter, not the page inset.** Now `padding-inline: var(--page-inset)`.
2. **An empty slot still reserved a target.** A slot exists to guarantee a target for what it holds;
   with nothing in it, it was pushing the title off the column and leaving a void at the trailing
   edge. `:empty` now reserves nothing.
3. **The grid gap applied beside a collapsed track.** A gap is separation between two things; it has
   no business existing next to nothing. It moved off the grid onto the title, conditional on a
   leading slot that actually has content.

Measured after: a leading title starts at 24, body text starts at 24, the back affordance also starts
at 24 when present, the action sits 24 from the trailing edge, and every target is still 44.

**What this cost:** three verdicts, because the first two passes treated a component defect as a
documentation problem and then as a padding value. The measurement that mattered — title left versus
body-paragraph left, in the same scope — takes one probe and settles it immediately.

### Removing the gap broke the variant the site never renders

The replacement sibling rules named `.mk-appbar-title`, but `ScreenHeader` renders `.mk-steps`
**instead of** the title when a flow passes steps. So the step indicator lost its separation on both
sides and its hairline segments abutted two tap targets — invisible under `site/`, because no page
there passes `steps`, and visible immediately in `ui_kits/onboarding`, where every step of the auth
flow does.

The rule was incomplete by construction: it covered one of the two children the middle column can
hold. Both children now carry `.mk-appbar-mid`, so **separation is a property of the position rather
than of one variant's class** — a third variant cannot silently lose it.

Separation is also margin rather than padding on both sides now. Padding put the 4px inside the middle
child, which is invisible for a text title and wrong for the step indicator: the segments are the
visible thing, and their container should not touch a 44px target.

Measured in the onboarding kit at the code step: box gap 4, first segment 4 from the back button, five
segments, target still 44. And back on the site, the title path is unregressed — leading title 24,
body text 24, box gap after the back affordance 4, actions inset 24.

**The lesson:** a shared stylesheet is verified against every consumer, not against the surface that
prompted the edit. Deleting a rule that served three children and replacing it with one that serves
one child is a regression the originating page cannot show.

## A silent no-op shipped five dead sections

Five component pages rendered an empty grey box under an "Anatomy" heading. The wiring script had
targeted the literal text `const ANATOMY = {\n  icon: function IconAnatomy`, but an earlier edit in the
same session had prepended two keys to that object, so the anchor no longer existed. `replaceText`
matched nothing, wrote the file unchanged, and the script logged "anatomies wired".

A second script then corrected selectors *inside* those never-inserted definitions behind
`if (h.includes(from))` guards, so those no-oped too — quietly, for the same reason.

**Two rules follow.** A string-anchored edit must assert its anchor exists and throw when it does not;
a success log after an unverified replacement is worse than no log, because it converts a failure into
a false record. And an `includes` guard that silently skips is only safe for genuinely optional edits —
used on a required one it hides the failure it was meant to tolerate.

A twelfth instance of the same guard survived one more round: the ScreenHeader page's live example kept
passing `trailing` where the component destructures `action`, so the prop was discarded and the header
rendered with an empty trailing column — under prose promising "at most one action slot" and an anatomy
pinning it. The anatomy worked only because it had been written from scratch rather than patched.

**The instrument that finds this class is a DOM probe for empty slots, not a source scan.** A source
scan cannot tell a nested prop from a direct one — `<ListRow checked=` is the `Switch` inside its
trailing slot, and a naive regex reports forty false positives. Probing every component page for slot
elements that render no content found the one real case and nothing else.

One empty slot is legitimate and stays: a header with no action still reserves the trailing column,
because that is what keeps the title's leading edge aligned to the content column rather than drifting
with the title's length.

The five builders now use the classes the components actually render: `.mk-appbar` with
`.mk-appbar-slot` and `.mk-appbar-title` for the header, `.mk-scroll` and `.mk-lift` for the screen's
regions, `.mk-field-label` / `.mk-input` / `.mk-field-error` for the field. `.mk-appbar-back`,
`.mk-appbar-actions`, `.mk-screen-body` and `.mk-screen-foot` — which the dead code referenced — exist
in no stylesheet.

### Nesting breaks a nearest-target check

Verifying correspondence by nearest target reported three of ten pins wrong. They were not: an icon
inside a button, and a row inside a scroller, mean the container's rect covers the exact point its own
child is pinned at, so the ancestor always scores nearer. The instrument has to compare only against
targets that are **neither ancestor nor descendant** of the intended one. With that correction all ten
pins are nearest their own element, 15–25px away, with no non-nested peer closer.

Third instrument for the same diagram, third distinct failure mode — after "count the pins" and
"check for overlaps". Each one was true when the next one caught something.

## The specimen stage was contradicting the pages it hosted

`.demo` and `.anatomy-stage` fill with `--muted` at `--radius-lg`. That is a reasonable neutral stage
for a button or an icon, and wrong for any component whose subject IS the surface: the ListGroup and
ListRow specimens rendered inside a rounded grey card, with their transparent header and footer showing
the muted panel and the row body white — a grey strip, a white band, a grey strip.

The page's opening line is "Containment without card edges", and its own clauses, rendered a few
sections below, say a group MUST "carry no border, no radius and no shadow of its own" and NEVER "wrap
itself in a card to look contained". The flagship specimen under that sentence showed a card edge, on a
de-emphasis well the system never puts a settings list on.

A `demo-surface` variant and `anatomy-stage[data-surface]` render on the real background with no
radius, marked with a dashed hairline so the stage is still legible as a stage. Verified by measuring
the rendered **backdrop** behind the header and footer rather than their own background — both
transparent, both now sitting on `#FFFFFF`, and no ancestor between the group and the page applies a
radius.

**The general shape:** a neutral stage is not neutral for every subject. When a component's subject is
its surface, its edges or its elevation, the frame the specimen sits in becomes part of the claim.

## The site's prose was restyling the components it documents

`site/site.css` scoped its document typography with descendant element selectors — `.doc h2`,
`.doc p`, `.doc li` and the rest. At specificity (0,1,1) those outrank the design system's
single-class component rules at (0,1,0), and specimens are descendants of the document, so every
heading-bearing component rendered in one was restyled by the page shell.

A real `ListGroup` header rendered at 24px with a 48px top margin where its role is 14px with none.
A `Sheet` title rendered as a display-size heading pushed 48px off its grabber. On pages whose entire
purpose is showing the real component, the reader was shown the shell.

Every prose rule now carries `:not(.specimen *)`. Containment rather than three symptom fixes: the
next component page that renders a heading — ScreenHeader, Field, Screen — would have hit the same
rule.

Measured after: specimen header 14px / 0 margin, sheet title 18px / 0 margin with a 4px gap to the
grabber, and prose unchanged at 24px / 48px for an h2 and 16px / 16px for a body paragraph.

**The general shape:** a documentation shell and the system it documents share a DOM, and the shell's
selectors are usually the stronger ones. Anything the shell styles by element name will reach into the
specimens unless it is told not to.

The containment had a second half. `base/reset.css` zeroes `list-style` on `ul, ol`, and the prose
rule restored margin and padding but not the marker — so every list in the documentation rendered
indented and unmarked. The governance page's **precedence** list was the worst case: three items whose
whole content is that item 1 outranks item 3, rendered with no numbers. Prose now restores
`disc`/`decimal` explicitly, scoped so the nav, the on-page contents, the anatomy keys and the cycle
lists keep the suppression they rely on and their own badges.

That also means the ordered-list renderer support added earlier had never been visible. It was verified
by counting `<li>` children — true, while no numeral was painted. Third instance of the same gap, and
the pattern is specific enough to name: **counting elements verifies the tree, not the rendering.** A
marker, a line box and a pin position each need measuring in their own terms.

## Counts are generated, not written

The status page stated "one exemplar page and fourteen stubs" two pages after that stopped being
true, and announced three current blockers in its opening line while saying all three were closed
two paragraphs below. Both are the drift class this project has now fixed six times, but neither is a
token value, so `check-prose` and `kit/spec.js` could not see them.

The structural fix: a `monokit-pages` directive generates the inventory from `nav.json` — section,
written count, page links, remaining stubs — so it cannot fall behind the site. The gaps intro no
longer restates a count that lives in the lists below it.

**The lesson beyond this page:** a number in prose is a claim, whether it is a token value or a
count, and prose that summarises a structure below it will drift from that structure. Generate it or
point at it; do not restate it.

It recurs even in code written the same turn as the lesson. The ListRow example typed its own
separator insets into two log strings; one stated an inset for the last row in its group, which has
none, and the other hardcoded a number that moves with the width class. The log now reads the pressed
row's own computed inset, which also makes the last-row case report honestly instead of confidently.

Generating a value is not the end of it, though: the first version of that table rendered "4 of 4"
as "4 of" then "4", because the auto table algorithm awarded 42% of the width to a thirteen-item stub
list that five of six rows had no use for. The value was correct and unreadable. Column widths are
declared now, and `.specimen .num` carries `white-space:nowrap` so an atomic value cannot break
mid-value.

The same distinction applies to diagrams, and it took three passes to land. First, four anatomy pins
existed and two sat on top of each other — a count of four was true while the diagram was ambiguous at
the point it existed to disambiguate. Separating them then produced pins that no longer collided and
pointed at the wrong elements: title and subtitle were anchored at fraction 1 of elements that fill a
`minmax(0,1fr)` column with left-aligned glyphs, so their right edge is empty space abutting the
trailing column and a pin beyond it landed on the value.

Anchor a pin where the content actually is, not at the element's box edge — a text element's box is
usually wider than its glyphs. And verify by **nearest-target distance**: for each pin, the closest
labelled element must be the one its key entry names. Both "four pins exist" and "no pins overlap"
were true of a diagram that mislabelled three of its four parts.

While fixing this, the markdown renderer turned out never to have supported **ordered lists** —
numbered items fell through to the paragraph branch, which silently flattened every numbered list on
the site into prose. The interaction page's five interaction principles, the accessibility contract's
five parts, and the status page's open-gap list were all affected.

## Card annotations resolve from the page

Specimen cards state numbers beside live components, and three annotations on one card drifted in a
single session: the density figures, the separator inset, and the press boundary. Each was typed
prose sitting inches from the code that contradicted it.

`kit/spec.js` closes it the way the site closed it. An annotation declares where its value comes
from and the value is read at render time:

- `data-spec-token="--row-touch-1"` — a custom property, from the nearest `[data-density]` scope or a
  named one.
- `data-spec-probe=".mk-row[data-lead='icon']" data-spec-pseudo="::after" data-spec-prop="left"` — a
  real rendered element, or one of its pseudo-elements.

An unresolvable value renders as an em dash and marks itself, so a broken annotation looks broken
rather than looking like a number. It is plain DOM, so the same mechanism serves the static
guideline cards and the React component cards.

Two things it caught immediately:

1. **`guidelines/native-gestures` still advertised the withdrawn edge-swipe token** and the
   pre-correction dismiss fraction, and labelled the dismiss threshold a realization addition when it
   is the specification's own. The card contradicted `AMENDMENTS.md` two files away.
2. **`guidelines/native-containment` was visually broken.** It used `data-lead="true"`, which stopped
   matching either separator branch when the inset began following the leading kind — so its
   hairlines had fallen back to the page inset, which is the one thing that card exists to
   demonstrate.

In `native-density` the drawn boxes now take their size from the same tokens the labels quote, so
the picture cannot disagree with the number beside it.

**Note on scheduling.** The resolver deliberately avoids `requestAnimationFrame`. Preview hosts
throttle it hard enough that a frame-gated guard flag may never release — the first version blanked
every annotation for exactly that reason. Re-entrancy is handled by disconnecting the mutation
observer around the write instead.

## A note on verifying motion here

The preview iframe is heavily frame-throttled — 40 animation frames can take over ten seconds — so
a transition's `currentTime` often reads 0 with `playState: "running"`. That is the host, not the
component. Motion is therefore verified at the state level: the inline transform, the transition
string, and the absence of any CSS keyframe animation on the element. Interpolation timing needs a
real device.

## Accessibility

`13-accessibility.md` was read in full on 2026-08-10 and audited against every built component.
The findings live in **[AUDIT.md](AUDIT.md)** — three blockers (the sheet traps nothing and
restores nothing, its barrier is invisible to assistive technology, and four CSS rules use physical
direction properties that break RTL), five contract violations, and eight passes worth protecting.

Against that doc's own completeness bar — verified contrast pair, semantics, reduced motion,
keyboard path, minimum target — **no component here is currently complete.** Nothing has been
fixed yet; the audit is a report, ordered by what to take first.

## Styles prose is provisional

Four of the six Styles pages on the site — colour, typography, elevation, motion — were written from
this project's own earlier summary rather than from the documents that own those subjects.
`02-color-and-surface.md`, `03-typography.md` and `05-motion.md` have not been read.

`04-space-and-layout.md` **has** now been read in full, and `styles/space.md` was rewritten against
it. The paraphrase had been thin rather than wrong: it was missing the edge-to-edge rules, the list
and grid anatomies, swipe geometry, the thumb-zone map, the radius multipliers, and the concentric
clamp to `radii.xs`.

That rewrite first shipped with two canonical numbers paraphrased away — the swipe-action cell width
and the header heights — out of over-caution about the prose-number guard, which does not in fact
object to either. Writing "a comfortable touch target wide" where the specification says a specific
number is worse than an omission: the same page states the touch minimum, so a reader infers the
wrong value. Both are now in `contract/space.json` as `chrome.headerHeight`,
`chrome.headerHeightExpanded` and `list.swipeActionCell`, referenced with `token:` so the page
resolves them rather than restating them. The expanded header height had also been hardcoded in
`build/emit.js`; it now comes from the contract too.

**The rule this establishes for the remaining reads:** when a source states a number, the page states
it — grounded in the contract if the contract owns it, added to the contract if it does not. Hedging
a specification's numbers into adjectives is not caution.

### The same fault, one layer down

The values added while correcting that page reached `tokens/space.css` and never reached
`dart/monokit_space.dart`. `emitSpace` and `emitSpaceDart` each iterated their own hand-written list
of contract groups; one was updated and the other was not, and nothing failed. Nine values were
CSS-only, including `reach.side` — D25, specified as a theme token — which meant the Flutter theme
did not carry it at all.

The Dart emitter now derives its classes from the contract's groups, with a type branch so a keyword
like `end` emits as a String rather than `NaN`. `build/generate.mjs` gained a coverage gate: every
contract group must reach both outputs or the build fails. Neither existing check could have caught
this — `--check` diffs emitted output against disk, and both sides came from the same incomplete
emitter.

The **values** are sound: they come from `contract/*.json`, a verified lift of the canonical
numbers, and the build refuses a number typed into prose. The **rules** are a paraphrase of a
paraphrase, which is the drift this system exists to prevent. Each page carries a provisional
notice and `site/content/about/status.md` lists the four unread sources. Reading them and
correcting those pages is the next task.

## Open — the Flutter realization's colour values (raised 30 August 2026)

`monokit_ui` 3.2.0 adopted every specified token **name**. Nine **values** still differ, and
they are listed here rather than changed, because each looks like a deliberate decision taken
against a real surface rather than a drift. Each needs a ruling: the contract changes, or the
package changes in 4.0.0.

| Token | Contract | monokit_ui | The package's argument |
|---|---|---|---|
| `background` | `#FFFFFF` | `#F1F3F3` (mist) | The ground is mist and `card` is the white step above it. In the contract, light-mode `card` and `background` are the same white and the hairline is the card — the package separates surfaces by luminance instead, so its ladder needs the ground darker. This is the largest of the nine and the one that changes how every screen reads. |
| `mutedText` | `#4B585B` | `#9CA8AB` | Reserved for placeholders and disabled labels rather than secondary body copy, so it sits lighter. |
| `muted` / `accent` | `#F1F3F3` opaque | `0x0D090B0C` alpha | Alpha composites correctly on all three surfaces in the ladder; an opaque fill only works on one. |
| `border` | `#E3E7E8` opaque | `0x14090B0C` alpha | Same reasoning. |
| `onMedia` | `#FFFFFF` | `#F9FBFB` | The mist white, so chrome over media stays in the same neutral family as chrome elsewhere. |
| `onMediaMuted` | `#FFFFFFB8` | `0xB8F9FBFB` | Follows `onMedia`. |
| `glassFill` / `glassBorder` | `#FFFFFF1A` / `#FFFFFF26` | mist-tinted, and named `mistFill` / `mistLine` | The package's note says these were never glass — there is no backdrop blur behind them, only flat translucency — so it tinted them into the mist family and renamed them. The specified names now resolve onto them either way. |
| `scrim` / `scrimStrong` | `#00000066` / `#00000099` | `0x73000000` / `0x9E000000` | Slightly heavier. No stated reason found; this one may simply be drift. |
| status foregrounds | four tokens | one `onStatus` | The four are the same colour, so the package carries one. All four specified names resolve onto it. |

A tenth, resolved rather than open: the specification's `fonts.css` describes Sans as four static
cuts. The Flutter package ships one variable file, verified as carrying a real `wght` axis from
100 to 700, so weights interpolate correctly. The delivery differs; the type does not. The
contract should record the variable delivery. The same file claims the shipped Serif and Mono
cuts carry Greek — they do not.

**Also closed by that release, against the gap list below:** item 3, for Flutter. `MonoPager`
ships arrow keys and pointer-density chevrons in the same change as the gesture, and `MonoModal`
carries Escape plus a labelled dismiss barrier. The web realization's pager still has neither.

## The text field, and what the Atlas draws (monokit_ui 4.1.0)

A conformance pass against the Monorithm Atlas found the Flutter input rendering as the exact
inverse of this contract's own opening line. `contract/input.json` describes *"A well rather than
a bordered box. The field recedes and the value the user typed is what reads"*; the widget shipped
a bordered box with a transparent fill. It has been changed to the well. Four things follow from
that, and each needs a ruling.

### 1. The Input contract contradicts itself

The description asks for a well. The MUST list says *"Colour its border with destructive when the
resolved state is invalid."* A well has no border to colour. The package now signals invalid with
the ring in `destructive`, shown whether or not the field has focus - which satisfies the intent
(and the NEVER on colour-alone, since Field still words the message) while making the MUST
literally unsatisfiable. See also the open clause in section 3: an always-on invalid ring and
*"one ring on screen at a time"* need reconciling.

**Ruling needed:** reword the MUST to name the ring rather than the border, or reinstate the
border and drop the well from the description. They cannot both stand.

### 2. There is no third control height

`contract/space.json` defines one `controlHeight` per density. The Atlas draws three field heights
and never anything between them: 44 for a field sharing its row, 48 for a field among other
fields, and **56 for the field the screen exists for** - the phone number on the number screen,
the handle on the handle screen. 56 appears seven times and never varies.

44 is `controlHeight` and 48 is `row1`, so two of the three already have names. The package adds
`controlHeightLarge` (56 touch / 48 pointer), keeping the ratio the rest of the ladder uses.

**Ruling needed:** adopt `controlHeightLarge` into the density group, or rule that the large step
is a screen-level decision and not a token.

### 3. The focus ring was fully specified and wholly unimplemented

Not a question - a gap, recorded so it is not re-derived. `contract/interaction.json` has carried a
`focusRing` group since it was written:

> `width: 2px`, `offset: 2px` - *"Painted OUTSIDE the control's bounds so it never shifts layout,
> and bound to focus-visible only."*

All three clauses were unmet in Flutter. The width was 3 at 50% alpha, inherited from the shadcn
reference. The offset was applied by nothing. And every control but `MonoTabs` and `MonoPressable`
showed the ring on pointer focus.

The offset could not be applied by either realization, which is the interesting part: both painted
the ring as a shadow spread, and a spread begins at the border box. The clause was unbuildable with
the mechanism in use, so it was quietly skipped rather than reported. `monokit_ui` 4.1.0 paints a
real outline outside the bounds instead, and moves width to 2, alpha to 1, and `focusVisible` to
keyboard focus only. `--ring` does not move.

**Worth checking on the web:** the same shadow-spread mechanism is used there, so the same three
clauses are likely still unmet.

**One clause the contract does not settle:** the Atlas annotation adds *"one ring on screen at a
time"*, which reads as a focus statement - only one thing holds focus - but the package also rings
an **invalid** field whether or not it is focused, so several can show at once. `statePrecedence`
says the mode axis composes orthogonally with the interaction axis, which supports that. Confirm
the reading, or say that invalid needs a treatment that is not a ring.

### 4. Typography has no role for a value the user typed

`contract/typography.json` names display, headline, title, body, label, button, code and prose. A
field's value is none of those. The Atlas sets it at 20/600 in the large field and 14/500 below,
against `bodyMedium`'s 14/400 - the value is content, not chrome, and it currently reads as chrome.

The package resolves `headlineMedium` (20/600) and `labelLarge` (14/500) rather than inventing a
role, which matches the metrics exactly but borrows a headline's -0.01em tracking for a string of
digits.

**Ruling needed:** add an `inputValue` role, or accept the borrowed tokens and record why.

### Not adopted from the Atlas

- **Horizontal padding 14px.** Off the 4pt grid the spacing group is built on. The package uses
  12. A 2px difference against the first ungridded number in the system is not a trade worth
  making; if 14 is deliberate, the grid needs the ruling, not the field.
- **`DeleteAccount` sets its typed value at 14/400** where the other three medium fields use
  14/500. Likely a drawing slip rather than a decision. Not implemented; flagged for the canvas.

## Known gaps against the specification

Read but not yet implemented, and not pretended otherwise:

1. **Width class is not resolved.** `--page-inset` and the fluid type roles respond to viewport width, but no component reads a `widthClass` scope, so the per-family recomposition tables in spec 12 section 3 are unimplemented. This is the largest gap.
2. **Input capability is not modelled** as a set; hover is behind a pointer query, which is the important half.
3. **No pointer or keyboard alternatives** for the pager swipe and sheet drag yet — spec 12 section 4 makes these a MUST, and shipping the gesture without them is a bug. The sheet has Escape and a scrim; the pager has neither chevrons nor arrow keys.
4. **Context menu, selection mode, and the destructive ladder** are unbuilt. Long-press is recognized by `Pressable` but nothing consumes it.
5. **Haptics are documented, not fired** — no actuator on the web.
6. **Spring physics are approximations**; canonical damping ratios live in `05-motion.md`.
7. `08-immersion.md`, `09`, `10`, `11`, `13` are unread. The feed, capture, gallery and call surfaces depend on them.
