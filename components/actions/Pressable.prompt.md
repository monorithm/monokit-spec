Pressable is the gesture primitive: use it for any pressable region that is not a Button — a list row, a media tile, an avatar.

```jsx
<Pressable as="div" scale onPress={open} onLongPress={showMenu} aria-label="Open photo">
  <div className="mk-media-ph" style={{ aspectRatio: "3 / 4" }} />
</Pressable>
```

It sets `data-pressed` for one-frame press feedback, recognises long-press at the specified `interaction.longPress` threshold and swallows the press that would have followed, and cancels when the finger slides off. `scale` opts into the 0.97 press scale. `pending` is not `disabled`: pending stays non-interactive while still communicating progress.
