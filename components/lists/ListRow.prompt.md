ListRow is the row inside a ListGroup — never used loose.

```jsx
{/* the Switch owns the toggle — no onPress on this row */}
<ListRow icon="notification" title="Notifications" subtitle="Order updates and replies"
  trailing={<Switch checked={on} onChange={setOn} label="Notifications" />} />
{/* a navigating row — onPress covers the lead and text columns */}
<ListRow leading={<Avatar size={40} />} title="Ama Boateng" value="₵240" chevron onPress={open} />
```

One line is 48 high, two lines 64. The separator is inset to the text column automatically when the row has a leading element. `chevron` only on rows that navigate; a row with a Switch does not get one.

The row is never itself a button. With `onPress` it renders an overlay press target across the lead and text columns that stops before the trailing column — so an interactive `trailing` control is a sibling of the press target, not a button inside a button. Give a row `onPress` **or** an interactive `trailing`, not both pointed at the same state.
