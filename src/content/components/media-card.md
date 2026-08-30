# MediaCard

The tile realization of a media item. Same content contract as the immersive realization,
recomposed for a grid — never redesigned for it.

> **Not in the web realization yet.** Ships in the Flutter package (`MonoMediaCard`, 3.1.0);
> contracted afterwards. See `record/AMENDMENTS.md`.

## Two realizations, one item

An item that appears full-bleed in a feed and as a tile in a grid is the same item, carrying the
same information in the same reading order. What changes is composition and density. What does not
change is which fields exist: a tile that invents a field the immersive form lacks has become a
second design of the same thing, and the two will drift.

The grid holds **one aspect ratio**, so it scans as rows. Mixed ratios turn a grid into a mosaic,
and a mosaic has no reading order.

## Legible before decode

Text renders before its media does. On a metered connection the gap between the two is the whole
first impression, and a tile that is a grey rectangle until the image lands has nothing to say
during the part of the wait the reader actually notices.

## Clauses

```monokit-clauses mediacard
```

## Do and don't

```monokit-do
State the count when an item carries more than one medium, before anyone interacts.
```

```monokit-dont
Letterbox the media inside the tile. The tile crops to its ratio; it does not pad to it.
```

## Tokens

```monokit-tokens --radius-lg --media-canvas --gutter-media
```

## Flutter

Illustrative.

```dart
MonoMediaCard(media: first, title: 'Kente slippers', caption: '2h ago · 400m')
```
