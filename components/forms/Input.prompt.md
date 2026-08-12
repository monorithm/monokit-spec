Input is the native text well — muted fill, no border. Use `size="lg"` when the value is the screen's whole subject.

```jsx
<Input size="lg" inputMode="tel" placeholder="24 000 0000" value={phone} onChange={setPhone} />
```

Focus draws the neutral ring outside the well, on keyboard focus only. `invalid` swaps the fill to destructive-soft; the sentence goes in the Field's `error`. The app never draws a keyboard — content lifts by `--keyboard-inset`.
