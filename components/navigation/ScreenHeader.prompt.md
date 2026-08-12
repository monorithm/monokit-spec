ScreenHeader is app chrome — deliberately not a page header, so no rule and no shadow under it.

```jsx
<ScreenHeader onBack={back} steps={{ total: 5, done: 2 }}
  action={<Button variant="plain" onPress={skip}>Skip</Button>} />
```

In a flow, `steps` replaces the title: hairline segments, never a percentage or "Step 2 of 5" as text. Over media pass `onMedia` so the bar goes transparent with on-media inks.
