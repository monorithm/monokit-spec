Switch is the trailing control of a settings row, and it applies the moment it moves.

```jsx
<ListRow title="Notifications" subtitle="Order updates and replies"
  trailing={<Switch checked={on} onChange={setOn} label="Notifications" />} />
```

52x32 track, 28 knob, spring on the travel. The Switch owns the interaction: do **not** also give
that row an `onPress` that toggles the same state — one tap would run both handlers, and the row's
press target deliberately stops short of the trailing column so the switch keeps its own tap and
its own tab stop.
