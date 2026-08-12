# Field

One control, one label, one message. Forms advance one decision at a time, and a field is that
decision made addressable.

```monokit-example field-states
```

## The message slot is one slot

Hint text and error text occupy the same place, so the layout does not jump when validation fires.
The error replaces the hint rather than appearing beneath it.

Error ink is `destructive` on the page surface, and `destructiveText` when the message sits on a soft
surface. Those are different tokens because they are verified against different backgrounds.

## Anatomy

```monokit-anatomy field
```

## Clauses

```monokit-clauses field
```

## Accessibility

The label is associated with its control programmatically, so tapping the label reaches the control
and a screen reader announces the two together.

**The error announces through a live region.** A validation failure has to reach assistive technology
without stealing focus, because moving focus to report an error interrupts whatever the user was
doing.

`pending` is its own affordance for asynchronous validation — a field waiting on a server is not a
disabled field.

## Do and don't

```monokit-do
Say what would fix it: "Enter the six digits we sent" rather than "Invalid input". A message the user
can act on is the whole point of the slot.
```

```monokit-dont
Compose two controls in one field. Two decisions are two fields, and a field that asks twice cannot
report one error.
```

## Tokens

```monokit-tokens --destructive --destructive-text --muted-foreground --space-8
```

## React

Illustrative.

```jsx
<Field label="Verification code" error="That code didn't match — check it or resend.">
  <InputOtp value={code} onChange={setCode} />
</Field>
```

## Flutter

Illustrative.

```dart
MonoField(
  label: 'Verification code',
  error: "That code didn't match — check it or resend.",
  child: MonoInputOtp(length: 6, controller: code),
)
```
