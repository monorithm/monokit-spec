# ListGroup

Containment without card edges. A group is declared by its header sitting in the page margin and by
hairlines that start where the text starts — so the list reads as one continuous surface and the eye
follows the words rather than a rectangle.

```monokit-example list-group
```

## ListGroup or Card

They are siblings, and the distinction is content rather than platform.

| | ListGroup | Card |
|---|---|---|
| For | anything list-shaped | a bounded object with its own identity |
| Examples | settings, search results, a thread list | a product, an order, a media item |
| Edges | none — rows bleed to the scope | hairline, radius by surface size |
| At every width | the same | the same |

Neither is the "mobile" or the "desktop" answer. A settings list is a ListGroup on a desktop too,
and a product is a Card on a phone.

## Anatomy

```monokit-anatomy list-group
```

The header aligns to the content column, not the screen edge. The footer is where consequences go —
what changes, and where to undo it.

## Clauses

```monokit-clauses listgroup
```

## Do and don't

```monokit-do
Let the rows bleed and let the header sit in the margin. The hairlines starting at the text column
are what declare the group.
```

```monokit-dont
Wrap it in a card to look contained. Two containment models on one screen means neither reads as
structure.
```

## Tokens

```monokit-tokens --page-inset --border-width
```

## React

Illustrative.

```jsx
<ListGroup header="Permissions" footer="You can change these later in Settings.">
  <ListRow icon="camera" title="Camera" trailing={<Switch …/>} />
</ListGroup>
```

## Flutter

Illustrative.

```dart
MonoListGroup(
  header: 'Permissions',
  footer: 'You can change these later in Settings.',
  children: [ MonoListRow(icon: MonoIcons.camera, title: 'Camera') ],
)
```
