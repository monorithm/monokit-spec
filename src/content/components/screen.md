# Screen

The delivery vehicle for monofocus: one subject, three regions, and the layer discipline everything
above content depends on.

```monokit-example screen-basic
```

## Three regions

**Header** takes the page inset for its horizontal padding, with its title aligned to the content
column rather than the screen edge. **Content** is the one region that scrolls; it applies the page
inset to text and lets media and lists manage their own edges. **Footer** carries the composer, the
cart bar or the tab bar — one region, one subject, never two stacked.

A sidebar appears as a rail from medium and pinned from expanded. On compact it is an overlay,
spatially identical to a sheet.

## Two rectangles

A full-bleed surface has two: the **media rect**, which is the physical screen, and the **control
rect**, which is the safe area minus gesture clearance. Media bleeds under system bars and cutouts.
Interactive controls do not.

```monokit-anatomy screen
```

## Clauses

```monokit-clauses screen
```

## Layer order

Screen owns it, so call sites cannot stack surfaces ad hoc: content, then chrome, then overlays, then
system. One overlay host means toasts, sheets and menus share a single z-discipline rather than
competing for a stacking context.

## Accessibility

Traversal follows visual reading order: header, content, footer, then an open sidebar. Concealed
chrome is excluded from focus, pointer **and** semantics together — an offscreen control that is
still tabbable is still a bug.

Scroll ends with enough padding that the last element is never pinned against chrome.

## Tokens

```monokit-tokens --page-inset --header-height --space-48
```

## React

Illustrative.

```jsx
<Screen header={<ScreenHeader title="Settings" onBack={pop} />}
        footer={<CartBar total="₵240" />}>
  <ListGroup header="Account">…</ListGroup>
</Screen>
```

## Flutter

Illustrative.

```dart
MonoScreen(
  header: MonoScreenHeader(title: 'Settings', onBack: pop),
  footer: const MonoCartBar(total: '₵240'),
  child: const SettingsList(),
)
```
