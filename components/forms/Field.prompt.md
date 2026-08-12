Field pairs a control with its label and its one status line.

```jsx
<Field label="Phone number" hint="We'll text you a 6-digit code." htmlFor="phone">
  <Input id="phone" size="lg" inputMode="tel" value={v} onChange={setV} />
</Field>
```

`error` replaces `hint` — they never stack. Write the error as the failure plus its recovery.
