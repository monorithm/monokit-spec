Button is the screen's committed action — one primary per screen, and at the bottom of a native screen it is `size="cta"` and `block`.

```jsx
<Button size="cta" block onPress={next}>Continue</Button>
<Button variant="plain" onPress={skip}>Skip</Button>
<Button variant="ghost" icon="back" label="Back" onPress={back} />
```

Variants: `primary` (emerald fill), `secondary`, `soft` (emerald-soft fill, emerald ink), `ghost`, `plain` (app-bar verb, no fill), `destructive` (keep it ≥24px from the primary or put a confirm step in front of it). Icon-only requires `label`. `pending` shows the spinner and stays non-interactive — do not use `disabled` for in-flight work.
