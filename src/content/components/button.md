# Button

The one obvious next step. Under monofocus a view has at most one primary action, so a button's
emphasis is a claim about the screen rather than a decoration on the control.

```monokit-example button-variants
```

## Emphasis is a ladder

Seven variants, and the choice states how much of the screen's attention this action deserves.

| Variant | Use |
|---|---|
| `primary` | The one obvious next step. At most once per view |
| `soft` | Brand colour without a second primary — the calm call to action |
| `secondary` | A real alternative to the primary |
| `outline` | A peer among several equal choices |
| `ghost` | Chrome. A toolbar action, an icon-only control |
| `destructive` | Danger. Never a status colour on primary |
| `link` | Navigation dressed as text |

**Two primary actions in one view means the second is answering a question the screen has not
asked.** That is a review rule, not a lint.

## Three axes, never mixed

Variant is tone and emphasis. Size is geometry. State is resolved from the state set. There is no
`primaryDisabled` and no `smallGhost` — mixing the axes multiplies the vocabulary and settles
nothing.

```monokit-states button
```

Hover and press shifts stay **derived** — a lerp of the resting fill toward background or foreground
— so they survive a palette change. State shifts are relationships, not colours.

## Anatomy

```monokit-anatomy button
```

## Density

```monokit-example button-density
```

Minimum height comes from density, and visual size decouples from hit target: a small icon button
stays visually small and its target does not.

## Clauses

```monokit-clauses button
```

## Accessibility

An icon-only button carries a label — there is no visible text to fall back on, and `Pressable`
asserts in development when one is missing. Focus routes through the shared ring, painted outside the
bounds so it never shifts layout.

`pending` is not `disabled`. A pending button is non-interactive **and** communicating progress, and
its label says so: "Sending…", not "Send".

## Do and don't

```monokit-do
Use `soft` when a screen needs brand colour and already has its one primary. Keep the label a verb
that names the outcome.
```

```monokit-dont
Reach for `primary` twice, or express danger as a warning colour on `primary`. Danger is
`destructive`.
```

## Tokens

```monokit-tokens --row-1 --min-target --motion-press --primary --primary-soft --primary-text --destructive --destructive-foreground
```

## React

Illustrative.

```jsx
<Button onPress={submit}>Continue</Button>
<Button variant="soft" onPress={share}>Share</Button>
<Button variant="ghost" icon="back" label="Back" />
<Button variant="destructive" onPress={remove}>Delete account</Button>
<Button pending>Sending…</Button>
```

## Flutter

Illustrative. Variants resolve through a public resolver, so a custom control can speak the same
language:

```dart
MonoButton(onPressed: submit, child: const Text('Continue'))
MonoButton(variant: MonoButtonVariant.soft, onPressed: share, child: const Text('Share'))

final resolved = MonoButtonStyleResolver(theme).resolve(
  variant: MonoButtonVariant.primary,
  states: {MonoState.hovered},
);
```
