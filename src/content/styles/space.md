# Space and layout

Space is how monofocus is enforced. The system separates surfaces with borders and light rather
than shadows, which means space and hairlines carry almost the whole burden of visual structure.

Three commitments follow.

**One rhythm.** Everything sits on the 4pt grid: one spacing scale, one radius scale, one column
grid. A screen that mixes rhythms is a screen with two subjects.

**Space declares hierarchy.** The gap between two elements states their relationship. When
whitespace enforces hierarchy, chrome can recede — boxes, dividers and backgrounds stop being
load-bearing.

**Reach is a layout constraint, not a styling preference.** On touch, the thumb arc decides where
primary actions live. Layout tokens exist so "put it in reach" is a rule the system can check
rather than folklore.

Media is the exception that proves every rule below: media bleeds to the physical edges of the
screen; everything else respects the page inset.

## Spacing

```monokit-scale space.spacing
```

| Step | Where it is used |
|---|---|
| s4 | icon-to-label gap in chips, media-grid gutter, hairline breathing room |
| s8 | gaps inside one control cluster, chip padding, minimum gap between touch targets |
| s12 | control internal padding, list-row vertical padding, leading-to-content gap |
| s16 | page inset at compact, card padding, card- and layout-grid gutter |
| s20 | large-control padding, dialog content padding |
| s24 | section gaps, page inset at medium, sheet padding, layout gutter at expanded and up |
| s32 | page inset at expanded and up, block separation, empty-state breathing room |
| s40 | hero spacing, first-run and onboarding rhythm |
| s48 | page-level vertical rhythm on expanded and up |

Off-scale values are never used for gaps or padding. One-pixel values are reserved for hairline
borders, which are strokes, not space. An optical correction may deviate by a pixel — **commented as
such, never silently**.

Vertical rhythm inside scrolling content uses steps of s16 or more between blocks. Anything tighter
reads as one block.

## Radius

Every step is a multiplier of the base, so a product can retune corner character with one number.

| Token | Multiplier | Roles |
|---|---|---|
| xs | 0.4× | checkbox, inline code background, tiny chips |
| sm | 0.6× | badge, key cap, menu-item highlight, tooltip |
| md | 0.8× | button, input, select, tabs, segmented controls |
| lg | 1.0× | card, popover, menu panel, attachment tile |
| xl | 1.4× | dialog, chat bubble, toast, large card |
| xxl | 1.8× | bottom sheet, media tile at expanded and up, gallery chrome |
| xxxl | 2.2× | large modal sheets on desktop, immersive overlay panels |
| huge | 2.6× | full-screen sheet corners, device-concentric surfaces |
| full | — | pill buttons, avatars, sliders, switches, action rail, capture shutter |

```monokit-scale space.radius
```

**Radius scales with surface size, not importance.** A primary button and a ghost button share the
same step; a sheet is larger because it is big, not because it matters more.

**Concentric nesting.** A rounded child inside a rounded parent takes the parent's radius minus the
inset, clamped to no less than `xs`. Corners that share a centre read as one object. A media
thumbnail inset by s4 inside an `xl` card therefore uses `lg`.

**`full` means circle or capsule**, never "very round rectangle". Capsule controls opt in
deliberately; everything else stays on the proportional scale.

Radius never animates independently of size. A surface that grows — a sheet expanding to full
screen — interpolates its radius toward `huge` or zero as part of the same transition.

Media rendered full-bleed has radius zero by definition. Media in a grid or card takes the tile's
radius by clip, and the clip is the concentric value rather than a fixed step.

## Width classes

Width class resolves from the **available width of the layout scope**, not from the physical screen.
A pinned sidebar consumes width before the content region resolves its class.

| Class | Width | Columns | Page inset | Layout gutter |
|---|---|---|---|---|
| compact | under `token:space.breakpoints.compact` | 4 | s16 | s16 |
| medium | up to `token:space.breakpoints.medium` | 8 | s24 | s16 |
| expanded | up to `token:space.breakpoints.expanded` | 12 | s32 | s24 |
| wide | beyond that | 12 | s32 | s24 |

Breakpoints change **composition** — columns, insets, which regions exist — never meaning or
hierarchy. A component does not change behaviour at a breakpoint unless the adaptivity rules say so.

Layouts tolerate any width. **Breakpoints are thresholds, not targets**: desktop windows and folding
devices land between them.

Height matters once. On compact heights — roughly 480 logical pixels, a phone in landscape — fixed
headers and footers collapse to their floating or immersive behaviours.

## Density

Density resolves from the primary input device, orthogonal to width. A touch laptop is expanded and
touch at the same time.

```monokit-table space.density
```

The minimums are enforcement values, asserted in debug builds. A visual element may be smaller than
its target; the hit area pads to the minimum invisibly.

Destructive targets sit at least s24 from the nearest primary target, or behind a confirm step.
Distance is the first line of forgiveness.

Components read density from the theme. They never inspect the platform to guess it — density is a
resolved token, not a platform switch.

## Containers

```monokit-scale space.containers
```

| Token | Role |
|---|---|
| feed | the immersive feed column at expanded and up; full-bleed below medium |
| content | maximum reading and form width — prose, settings, auth flows |
| sheet | maximum bottom-sheet width once the layout is medium or wider, where sheets centre and detach from the edges |
| page | maximum content width on wide; beyond it content centres with equal margins |
| dialogSm · dialogMd · dialogLg | confirms and alerts · forms and pickers · media pickers and multi-pane dialogs |
| sidebar · rail | pinned or push-inset sidebar · collapsed rail |

The dialog ladder is **frozen** at those three widths.

## Page inset and gutters

The page inset is the horizontal padding between the screen edge and non-media content. It is
responsive, and it resolves **per layout scope rather than once per screen** — an embedded pane can
carry a compact inset inside an expanded window.

```monokit-scale space.pageInset
```

Layout and card grids use s16 at compact and medium, s24 at expanded and up.

**Media grids use s4 at every width.** A larger gutter card-ifies tiles into competing objects; s4
keeps the grid reading as one continuous media surface interrupted by hairlines of background —
borders and light, applied to a grid — and buys a few percent more media area per row, which is the
product.

Gutters and page insets never mix roles. The outermost gap of a grid is the page inset, or zero for
a bleeding media grid, and never a gutter.

## Page anatomy

- **Header** — `token:space.chrome.headerHeight` at compact and medium,
  `token:space.chrome.headerHeightExpanded` at expanded and up; page inset for horizontal padding.
  The title aligns to the content column, not the screen edge.
- **Content** — the one region that scrolls. It applies the page inset to text; media and lists
  manage their own edges.
- **Footer** — the composer, cart bar, or tab bar. Its height is at least the control height plus
  s12 of vertical padding plus the bottom safe area. **Never two stacked footers: one region, one
  subject.**
- **Sidebar** — full width when pinned or push-inset, rail width when collapsed. It appears as a
  rail from medium and pinned from expanded. On compact it is an overlay, spatially identical to a
  sheet.
- **Floating layer** — anchored s16 from the content region's edges and s16 above the footer.

Vertical rhythm: the first content block starts s16 below the header, or s24 at expanded and up;
sections separate by s32; scroll end-padding is s48 plus the footer height, so the last element is
never pinned against chrome.

## Edge-to-edge

The screen edge is a semantic boundary.

| Content | Edge behaviour |
|---|---|
| Media | Bleeds to the physical edges, including under translucent chrome and into safe areas |
| List rows | Background and press highlight bleed; row **content** aligns to the page inset |
| Horizontal carousels | The viewport bleeds; first and last items align to the page inset so the next item peeks by the gutter |
| Separators | Inset to the text column inside a list; full-bleed only between sections |
| Text, cards, forms, controls | Never touch the edge — the page inset always applies |
| Header and footer backgrounds | Bleed; their content aligns to the page inset |

Bleeding content may extend under system bars and cutouts. **Interactive controls may not**: they
keep safe-area padding plus s8 of clearance from system-gesture edges. A full-bleed surface with
controls therefore has two rectangles — the media rect, which is the physical screen, and the
control rect, which is the safe area minus clearance.

## Lists

One anatomy serves chat, feeds, settings, and search results.

- **Leading slot** — an avatar at `token:space.list.leadingAvatar` and radius `full`, or an icon at
  its role size. Vertically centred for one or two lines, top-aligned for three.
- **Content column** — title in a body or label role, subtitle in muted foreground; at most two
  lines each, ellipsized. A list is a menu of subjects, not the subject.
- **Trailing slot** — metadata top-aligned with the title; an affordance such as a chevron, unread
  dot, or selection checkbox centred.
- Vertical padding s12, with minimum row heights from the density table.
- Rows are press surfaces: the pressed tint runs edge to edge while the text column stays aligned.
- **The focus ring insets by 2 inside the row bounds.** This is the system's one exception to
  painting the ring outside a control — a row is edge-to-edge, so an outside ring would have
  nowhere to go. Everything else follows the rule in
  [Interaction](#/patterns/interaction).

A list may take a dense flag that drops one row-height step, for pointer-first tables and pickers.
**There is no spacious tier** — added air comes from section spacing, not taller rows.

## Grids

- **Uniform media grid** — 2 / 3 / 4 / 4 columns across the width classes; wide holds at four with
  larger tiles, because at desk distance a larger tile browses better than a fifth column. Gutter s4.
  Tile aspect is 3:4 for video and 1:1 for photos — **one aspect per grid, never mixed**. Tiles clip
  to the concentric radius of their context, or radius zero where the grid bleeds.
- **Feature-lead grid** — the first tile spans the row, the rest are uniform. Monofocus applied to a
  grid: one lead subject, then the browsing field. At most one lead per grid; a grid of heroes has
  none.
- **Product grid** — 2 / 3 / 3 / 4 columns, gutter s16, because product cards carry text and price
  below the image and need card identity. Image aspect 1:1, text block padding s12.
- **Masonry is rejected.** Uneven tile heights make reach unpredictable and break scanning order for
  screen readers. If content lengths vary, crop to the grid; if cropping is unacceptable, use a list.

### Swipe actions

Action cells are `token:space.list.swipeActionCell` wide each — deliberately wider than the touch
minimum, with room for an icon and a label — and at most two per side. **Leading reveals constructive actions, trailing reveals negative ones** — direction
encodes valence consistently across the system.

Full-swipe commit is allowed only for reversible actions. A truly destructive action stops at reveal
and requires a tap on the revealed cell. Every swipe action also exists in the row's context menu.

## Thumb zones

On a compact touch screen the reachable area divides into three: **easy** is the bottom third,
centre and side edges; **stretch** is the middle third and the far bottom corner; **hard** is the top
third, especially the corners.

- Primary actions live in the bottom two-thirds — the composer at the footer, the shutter
  bottom-centre, the checkout action in the footer bar.
- The action rail sits on the trailing edge, spanning the lower half, inside the natural arc.
- Destructive actions never sit in the easy zone beside primaries. They earn distance or a confirm
  step.
- The top edge carries status and context — title, presence, live badge — plus low-frequency exits.
  Back and close at the top-leading corner are acceptable only because the edge-swipe back gesture
  provides the in-reach alternative.
- Tab bars hold three to five destinations. The centre slot may be a raised capture action, since
  bottom-centre is the cheapest pixel on the screen.
- Floating elements anchor bottom-trailing, never in the top corners.

A first-class `reachSide` token flips **every** thumb-arc placement together for left- and
right-handed reach and for RTL, so the action rail and every other easy-zone placement mirror as one.

These rules relax at pointer and expanded layouts, where proximity to content matters more and edges
and corners become cheap.

## Do and don't

```monokit-do
Bleed media to the physical edge and let chrome float over it. Let list press-highlights run edge to
edge while the text aligns to the page inset. Use s4 gutters so a media grid reads as one surface.
Crop varied content to one tile aspect per grid. Snap every gap to the 4pt scale, and comment the
rare optical single-pixel correction.
```

```monokit-dont
Frame media in a card "for consistency" — frames are for objects, and media is the subject. Duplicate
the primary action top-trailing *and* at the bottom, which is two subjects. Inset the whole row and
shrink the touch target to the visible card. Give media tiles card padding, borders, or shadows.
Reach for masonry when content heights differ. Nudge with literals until it looks right.
```
