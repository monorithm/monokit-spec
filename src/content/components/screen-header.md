# ScreenHeader

Chrome that recedes during consumption and returns on intent. A header states where the user is and
offers the way back; it is never louder than the content beneath it.

```monokit-example header-basic
```

## Recede and return

In an immersive context the header hides while the user consumes, and returns on intent — a tap, a
scroll up, or a focus move into it. **Auto-hide pauses while assistive navigation is active**, because
controls must never vanish out from under a screen-reader cursor.

Over media it renders on glass; everywhere else on a solid surface. Glass carries controls, not
paragraphs.

## Anatomy

```monokit-anatomy screen-header
```

The header pads to the **page inset**, so its content begins where body text begins rather than at a
chrome-specific gutter. A leading title therefore lines up with the first line of text beneath it; a
back affordance occupies that column and the title follows it.

## Clauses

```monokit-clauses screenheader
```

## Accessibility

Back is reachable by pointer and keyboard, not by edge gesture alone — monokit never claims the edge
swipe, and a gesture is never the only path.

A header carries at most one action slot. More than that and it is a toolbar wearing a header's
clothes, which puts several targets in the hardest-to-reach corner of a touch screen.

## Do and don't

```monokit-do
Let the surface step do the separating. A header sits one mist step behind content, which is enough.
```

```monokit-dont
Draw a hairline beneath it, duplicate the screen's primary action in it, or put a destructive action
in a top corner.
```

## Tokens

```monokit-tokens --header-height --page-inset --glass-fill --glass-border
```

## React

Illustrative.

```jsx
<ScreenHeader title="Settings" onBack={pop}
  action={<Button variant="ghost" icon="more" label="More options" />} />
```

## Flutter

Illustrative.

```dart
MonoScreenHeader(
  title: 'Settings',
  onBack: pop,
  behavior: MonoHeaderBehavior.immersive,
)
```
