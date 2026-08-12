ListGroup is how native monokit contains things — there are no cards in this system.

```jsx
<ListGroup header="Permissions" footer="You can change these later in Settings.">
  <ListRow icon="camera" title="Camera" subtitle="Take photos and go live" trailing={...} />
  <ListRow icon="mic" title="Microphone" subtitle="Voice calls and voice notes" trailing={...} />
</ListGroup>
```

Rows go edge to edge; the header sits in the margin and the separators inset to the text column. Do not wrap a group in a bordered or rounded container.
