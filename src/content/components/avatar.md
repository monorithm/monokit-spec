# Avatar

A person or a place, at one of a few sizes. It is the anchor other things attach to — a presence dot,
an edit affordance — rather than a decoration.

```monokit-example avatar-sizes
```

## No photography

This system ships none, so an avatar with no image renders a **declared placeholder**: the person role
at muted foreground, honest about being empty. Initials in a grey circle would be pretending
otherwise.

## Attached affordances

An edit control or a presence dot sits on the trailing-bottom corner, which mirrors under
right-to-left. Keep it proportional — a badge that rivals the avatar is a button with an avatar behind
it, which is why the edit affordance belongs on a profile avatar rather than a list one.

```monokit-example avatar-attached
```

## Clauses

```monokit-clauses avatar
```

## In a list

Inside a [ListRow](#/components/list-row) it takes the list leading size, so the separator inset stays
derivable from the leading slot rather than hardcoded per row.

## Accessibility

An avatar announces as a person, not as an image — or is excluded from semantics entirely when a name
sits beside it, so a row does not announce the same person twice.

## Tokens

```monokit-tokens --leading-avatar --radius-full --muted --muted-foreground
```

## React

Illustrative.

```jsx
<Avatar size={40} />
<Avatar size={72} edit onEdit={pickPhoto} />
```

## Flutter

Illustrative.

```dart
MonoAvatar(size: MonoAvatarSize.list)
MonoAvatar(size: MonoAvatarSize.profile, onEdit: pickPhoto)
```
