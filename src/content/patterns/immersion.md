# Immersion

Immersion is where the language stops being a component set and becomes a stance: media renders
full-bleed on a true-black canvas, controls are translucent layers *over* content rather than frames
*around* it, and the screen commits to exactly one subject.

An immersive surface is not a themed screen. It is a contract about attention, and everything the
system paints on top has to answer one question: does this serve the subject right now?

## Three commitments

**Content owns the pixels.** Media is never letterboxed by chrome, never framed by a card, never
placed on a mode-dependent background. It renders edge to edge on the media canvas, which is
mode-invariant — the media context is always dark, in light mode and dark mode alike.

**Chrome is a guest.** Controls over media are translucent or scrim-backed, positioned by the layer
model, and able to recede entirely. Chrome recedes during consumption and returns on intent, never
the reverse.

**Legibility is engineered, not hoped for.** Text over media earns contrast from a scrim evaluated at
the weakest point of its gradient. No scrim, no text. Ever.

## The layer model

Six layers, bottom-up. The layer a thing lives on is a design decision, not an implementation
accident.

| Layer | Role | Interactive | Insets |
|---|---|---|---|
| z0 canvas | Background fill — the page background on standard screens, the media canvas on immersive ones | no | always full-bleed |
| z1 content | The subject: media, lists, chat scrollers, document pages, forms | yes | per inset policy |
| z2 scrims | Legibility gradients and dimming | **never** | always full-bleed |
| z3 controls | Screen chrome, action rail, composer, capture bar, on-media chips, pinned sidebar | yes | always respects safe areas and the keyboard |
| z4 overlays | User-invoked transient surfaces, each with its own barrier | yes | inset-aware, motion-coordinated |
| z5 system | App-transcending surfaces: toasts, connectivity banners, incoming calls, picture-in-picture | limited | always respects safe areas |

**The layer is resolved by placement, not by class.** A badge in chrome is z3; the same badge inline
in the body is z1.

```monokit-figure layers
The six layers stacked, z0 at the back. Insets and interactivity differ per layer; the ordering
does not.
```

### Rules

- Layers compose bottom-up. Nothing on a lower layer paints above a higher one.
- **Scrims are pointer-transparent.** A scrim is paint, not a surface — it never blocks a gesture
  aimed at the content beneath it.
- Controls stay inside safe areas even when content bleeds under them. A glass chip never collides
  with a notch or a home indicator.
- **Barriers never stack.** When a menu opens over a sheet, exactly one barrier is visible at its
  token opacity. Scrims do not accumulate darkness.
- z5 is the only layer that may appear without user intent.
- Within a layer, paint order is presentation order. Ordering needs *across* layers are solved by
  moving layers, never by a hand-tuned z-index.

### Layers are not elevation

Layers are stacking; [elevation](#/styles/elevation) tiers are surface treatment. The mapping is
fixed: z0 and z1 are flat or raised, z2 has no surface at all, z3 is glass over media and raised
elsewhere, z4 is the overlay or modal tier, z5 is the system tier.

## The media canvas

The canvas behind any media is the media canvas, in both brightness modes. Media pixels decide what
the user sees; the canvas exists only for letterbox slivers during an aspect mismatch and during
load.

All text and iconography over media uses the mode-invariant on-media set. **The page foreground and
background are never used over media** — they flip with mode, and media does not.

While media loads, the canvas shows itself with a skeleton treatment. Never a white flash, never a
spinner on white.

An immersive screen does not repaint on theme change. There is nothing to change.

## The scrim system

Scrims are the legibility engine: gradients that buy contrast for on-media text and controls without
boxing them. **Scrims, not boxes.** Text over media never sits on an opaque plate; controls may sit
on a glass chip, but reading text earns its legibility from gradient alone.

| Scrim | Geometry | Used for |
|---|---|---|
| Floor fade | Bottom third of the media rect, full width, fading upward to transparent | caption block, counts, bottom chrome |
| Ceiling fade | Top sliver, the same gradient inverted | status chips, back affordance, top chrome |
| Focus scrim | The full media rect, uniform and stronger | expanded caption, reader control mode, text-dense states |
| Overlay barrier | Full screen behind an overlay | dialogs, sheets, drawers |
| Edge fades | Slivers at the ends of a scrollable | scroll affordance hints |

### Rules

- Text sits **entirely** within a scrim zone, and contrast is evaluated at the weakest point of the
  gradient under that text. On-media muted ink over pure black passes; over a fading scrim, only the
  scrimmed region counts.
- The zone extends beyond the text block on every side not cut by a screen edge. **Text at the fade
  boundary is a defect.**
- **Scrims never accumulate.** When a caption expands, the floor fade is *replaced* by the focus
  scrim rather than layered under it. One scrim state per media rect at a time.
- Scrims are pointer-transparent, excluded from semantics, and animate on the calm scheme only.
  Scrims never spring.
- Scrims bleed to physical edges, including under system insets. A gradient that stops short of the
  notch leaves on-media chrome floating on unprotected pixels.

```monokit-dont
Tint a scrim to brand the media. Scrim colours are neutral — there are no emerald washes.
```

```monokit-dont
Reach for the focus scrim as a default. It dims the subject. Floor and ceiling fades first; the
focus scrim only once the user has explicitly moved their attention to text.
```

## Chrome recede and return

```monokit-figure thumb-zones
Reach on a held phone. Primary and frequent actions sit in the lower two-thirds and along the
edges; the top corners take low-frequency navigation only.
```

Three policies, resolved per screen rather than per component.

| Policy | Behaviour | Used by |
|---|---|---|
| Persistent | Always visible | live viewing, calls in grid mode |
| Resting | Hides after an idle delay, returns on intent | the immersive feed, single video player, gallery, document reader, full-screen call |
| Hidden | Absent until summoned | camera pre-roll, screening and preview states |

**Persistent chrome is absolute.** It never auto-hides, even during a long uninterrupted watch.
Repeated loops without a gesture do not eventually trigger a rest — a surface that wants chrome to
recede chooses the resting policy up front.

### Recede

The idle delay is a token, and the timer resets on any interaction with a control, any scrub, and any
pointer movement over chrome.

On a feed that advances itself, the timer also resets when a new item arrives.
A new subject arrives with its chrome, so the delay never cuts an item short and the rest fires only
when the viewer lingers on one item past it.
A surface whose caption carries a rotating fact depends on this: the rest must not be shorter than
the item, or a fact never comes around.

**Return is faster than recede: leaving is polite, returning is obedient.** Recede accelerates with a
small translation toward the owning edge; return decelerates on the signature curve. The scrubber
collapses to a hairline progress line rather than disappearing, so temporal position survives.

### Peek

A peek is the momentary form: chrome clears while a control or the media itself is held, and returns
on release.
It is a sustain rather than a toggle, which is why it does not claim a third meaning for long-press.

**A peek is opacity only. Nothing translates.** Where recede is timed and unattended, a peek happens
with the finger still on the glass, so every control keeps its coordinates and simply stops being
drawn — the action rail above all, which never changes position. On release the thumb finds each
control exactly where it left it. The translation toward the owning edge belongs to recede alone.

A peek is an accelerator, never the only path to a clear screen. The same clearing is reachable
without it: at pointer the chrome rests on its own and returns on movement, and from the keyboard the
control that toggles it is a focusable button like any other.

Some chrome never recedes, because it is subject truth rather than convenience: captions, the
recording indicator, an active call timer, and the live badge while watching live.

### Return

Chrome returns on tap-to-toggle, pause, scrub start, keyboard focus entering the screen, focus
traversal reaching an on-media control, back intent, and rotation. **While chrome is hidden the first
key event returns it and is consumed** — it never activates a control the user cannot see.

Chrome must not auto-hide while any of these hold:

- assistive technology is active — chrome is then persistent, full stop
- playback is paused or buffering, because an honest state must stay visible
- any overlay is open
- a text field inside chrome has focus
- a pointer is hovering a control

The arrival of a toast or banner does **not** return chrome. System messages do not reopen the
cockpit.

### Tap to toggle

Where tap has no primary meaning — a gallery, a reader, a player without tap-seek — a single tap on
the content toggles chrome. The target is the whole media rect; there is no invisible dead zone.

On a feed, tap already means pause and resume, so the feed takes the persistent policy instead.
Chrome that plays hide-and-seek while browsing is a monofocus violation, not an enhancement.

A tap that dismisses something consumes that tap. **One tap, one effect.**

Every commitment above, on one surface. The media holds the canvas edge to edge, the chrome sits
over it as translucent layers rather than framing it, and it recedes on idle and returns on intent.
There is no photography in this project, so the canvas is a declared placeholder — the layering is
the subject, not the picture.

```monokit-example immersive-capture
```


## What this realization ships

The native realization has no immersive surface yet: no feed, no player, no gallery, no capture. The
media placeholder and the on-media token set exist, and the layer model is what `Screen` already
enforces, but the patterns above are documented ahead of their implementation.

That is deliberate — this document is the specification, and the specification leads. See
[Status](#/about/status) for what is built.
