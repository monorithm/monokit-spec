# Typography

> **Provisional.** The values on this page are generated from the contract and are authoritative.
> The guidance is paraphrased from a secondary summary rather than from the document that owns this
> subject, which has not been read. See [Status](#/about/status).


IBM Plex, one superfamily, three registers.

- **Sans** — chrome and content
- **Serif** — the reading register: the document reader and long-form body, nowhere else
- **Mono** — machine-shaped strings the user reads rather than types

Weights 400, 500, 600, 700 only. Never below 400. **The floor is `token:typography.floor.text` and
nothing renders below it.**

## Quiet chrome, loud content

The four display and headline roles scale fluidly with viewport width. Everything else is fixed at
every width, because if a design wants bigger chrome on desktop, the answer is density and spacing,
not font size.

**Hierarchy spans one step.** Adjacent slots differ by at most one ramp step and one weight step.
De-emphasis is carried by colour, never by a smaller size or a lighter weight.

## Content voice — fluid

Interpolates between the top of compact and the bottom of wide.

```monokit-type typography.fluid
```

## Chrome voice — fixed

```monokit-type typography.fixed
```

## Numerals

Prices, counts, timers, and codes use tabular figures so they do not jitter as they change. Currency
symbols take the same role and weight as the amount, and decimals are never smaller than the integer
part.

A verification code the user types is **content**, not data: it takes the content voice with tabular
figures, not the mono register.

## Scaling

Body, label, button, and on-media caption roles scale unclamped to 200%. Display and headline roles
may clamp — they are identity, not information. A commerce hero price is content and is never
clamped: it scales fully and the layout accommodates the growth.
