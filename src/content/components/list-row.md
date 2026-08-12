# ListRow

One anatomy serves chat, feeds, settings and search results: a leading slot, a content column, a
trailing slot.

A list is a menu of subjects, not the subject. Title and subtitle cap at two lines each, and
de-emphasis is carried by colour rather than by a smaller size.

```monokit-example list-row
```

## Anatomy

```monokit-anatomy list-row
```

The leading slot sizes to what it holds — an avatar at the list leading size, or an icon at its role
size — and **the separator insets from whichever it carries**, so the hairline always starts where
the text starts.

## Density

Row heights resolve from density. The same call site, both ways:

```monokit-example list-row-density
```

```monokit-table space.density
```

A dense flag drops one row-height step for pointer-first tables and pickers. There is no spacious
tier — added air comes from section spacing, not taller rows.

## Press

A pressable row activates anywhere along it, and the tint runs edge to edge while the text column
stays aligned. The tint is the whole feedback: no ripple, no shadow, no border appearing on press.

An interactive trailing control is the exception. It keeps its own tap and its own tab stop, and the
press target stops short of that column — nothing nests inside a button.

The focus ring insets inside the row bounds. This is the system's one exception to painting the ring
outside a control, because an edge-to-edge row has nowhere outside itself to paint.

## Clauses

```monokit-clauses listrow
```

## Swipe actions

Action cells are a comfortable touch target wide, with room for an icon and a label, and at most two
per side. **Leading reveals constructive actions, trailing reveals negative ones** — direction
encodes valence consistently across the system.

Full-swipe commit is allowed only for reversible actions. A truly destructive action stops at reveal
and requires a tap on the revealed cell. Every swipe action also exists in the row's context menu.

## Do and don't

```monokit-do
Give a row `onPress`, or give it an interactive trailing control. Take the chevron when it navigates,
and never when it toggles.
```

```monokit-dont
Point a press action and a trailing control at the same state. One tap runs both, and which wins
depends on the order the writes happen to land in.
```

## Tokens

```monokit-tokens --row-1 --row-2 --page-inset --icon-chrome --leading-avatar --gap-density
```

## React

Illustrative.

```jsx
<ListRow leading={<Avatar size={40} />} title="Ama Boateng" subtitle="Sent you a voice note"
  value="14:02" chevron onPress={open} />
```

| Prop | Type | Notes |
|---|---|---|
| `leading` | node | An avatar. Sets the separator inset |
| `icon` | role | An icon instead, at its role size |
| `title` · `subtitle` | string | Two lines each, ellipsized |
| `value` | string | Trailing metadata, top-aligned with the title |
| `trailing` | node | An affordance or an interactive control |
| `chevron` | boolean | Navigates. Never on a row that toggles |
| `onPress` · `onLongPress` | function | Press spans the row, minus an interactive trailing column |

## Flutter

Illustrative.

```dart
MonoListRow(
  leading: MonoAvatar(size: MonoAvatarSize.list),
  title: 'Ama Boateng',
  subtitle: 'Sent you a voice note',
  value: '14:02',
  chevron: true,
  onPress: () => openThread(),
)
```
