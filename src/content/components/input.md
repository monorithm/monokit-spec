# Input

A well rather than a bordered box. The field recedes and the value the user typed is what reads.

```monokit-example input-basic
```

## States

```monokit-states input
```

Invalid colours the border with `destructive` — **and is always worded as well as coloured**, because
colour is never the sole carrier of meaning.

## Clauses

```monokit-clauses input
```

## Accessibility

The placeholder ink is the colour verified against the well the field sits on, not the one verified
against the page. Those are different measurements, and one of them failed: `mutedForeground` on
`muted` is 4.14:1.

Every input pairs with a [Field](#/components/field) for its label. A placeholder is not a label — it
disappears at the moment it is needed.

Height comes from density and the control grows rather than clips as text scales.

## Do and don't

```monokit-do
Let the well carry the field. A hairline plus a muted fill is enough separation on a flat surface.
```

```monokit-dont
Use the placeholder as the label, or signal invalid with a red border and nothing else.
```

## Tokens

```monokit-tokens --muted --muted-text --input --destructive --row-1 --focus-ring-width
```

## React

Illustrative.

```jsx
<Field label="Phone number" hint="We'll send a code to this number.">
  <Input value={phone} onChange={setPhone} inputMode="tel" />
</Field>
```

## Flutter

Illustrative.

```dart
MonoField(
  label: 'Phone number',
  help: "We'll send a code to this number.",
  child: MonoInput(controller: phone, keyboardType: TextInputType.phone),
)
```
