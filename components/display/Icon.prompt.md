Icon renders a **semantic role**, not a vendor glyph.

```jsx
<Icon name="back" />                      {/* 16 at pointer, 20 at touch */}
<Icon name="like" active decorative />    {/* stroke 2.0 + colour */}
<Icon name="cartAdd" size="lg" />         {/* explicit only when size is part of the design */}
```

Ask for what the user means. `nav-arrow-left` is a vendor id and will warn; `back` is the role, and it mirrors itself in RTL. The catalog is `contract/icon.json` — 89 roles, each with a default accessible label.

Ten roles (`live`, `record`, `waveform`, `filePdf`, `sticker`, `gif`, `captions`, `cameraFlip`, `receipt`, `unfold`) have no glyph in the shipped vendor set. They render as empty space of the right size rather than borrowing another metaphor's picture. `live` is drawn as the specified pulsing dot chip instead.

Stroke is 1.5, 2.0 with `active`, and 1.75 at 16px — the system's one sanctioned deviation, applied by the stylesheet, never per component.
