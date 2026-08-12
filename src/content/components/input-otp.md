# InputOtp

The single-decision screen made literal, and the reference the rest of the forms family is measured
against. One subject, one input, nothing else competing for it.

```monokit-example otp-basic
```

## Behaviour

Focus advances as digits are entered and retreats as they are deleted, so the user never manages it.
A paste of the whole code fills every box, and platform autofill works — which is the reason this
realization uses one hidden input rather than six.

That is a **deviation**, recorded in [Status](#/about/status): the specification asks for "digit n of
six" per box, and a single input cannot announce per-digit position. Paste and autofill were judged
the larger win.

## The code is content

Digits take the content voice with tabular figures, not the monospace register. Mono is for strings
the user reads; a code the user types is content.

## Clauses

```monokit-clauses inputotp
```

## Accessibility

This is one of the few screens where **autofocus is right** — its single subject is an input. Feeds
and readers never steal focus.

The resend timer announces at start, halfway and zero. A live region that updates every second is
unusable, and the countdown is also plain text so it can be read at any time.

Error adopts `destructive` and fires the error haptic at the same moment, so the failure lands in two
channels.

## Do and don't

```monokit-do
Let a paste fill every box. Someone reading a code from another app is the common case, not the edge
case.
```

```monokit-dont
Clear the whole code on one wrong digit, or set the digits in the mono register because they look
like data.
```

## Tokens

```monokit-tokens --muted --destructive --space-12 --min-target
```

## React

Illustrative.

```jsx
<Field label="Verification code" error={error}>
  <InputOtp length={6} value={code} onChange={setCode} autoFocus />
</Field>
```

## Flutter

Illustrative.

```dart
MonoInputOtp(length: 6, controller: code, autofocus: true)
```
