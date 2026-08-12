# Status

What exists, what does not, and where this specification's own realization falls short. Published
rather than hidden: a specification that conceals its conformance debt teaches teams to do the same.

## Pages

Generated from the navigation, so it cannot fall behind the site the way a typed count does.

```monokit-pages
```

Every page in the navigation is written. The three primitives come first because everything else
composes from them.

**Written is not the same as implemented.** Four Styles pages carry a provisional notice: their values
are generated from the contract and authoritative, but their guidance was written from a secondary
summary rather than from the document that owns the subject. [Immersion](#/patterns/immersion) and
parts of [System states](#/patterns/states) document patterns this realization has not built. Each
page says so where it applies.

## The realization's gaps

Measured against the five-part contract in [Accessibility](#/foundations/accessibility). What is
closed and what remains open are both listed below, and neither count is restated here — a number in
a sentence is the first thing to go stale.

### Closed

All three blockers, and two of the violations.

A `Modal` primitive owns the focus trap, the exclusion of the background from focus, pointer and
semantics, the restore to the trigger on dismiss, and a barrier that is a labelled button rather
than a bare gesture target. `Sheet` composes it; `Dialog` and `Drawer` will inherit it.

`Pressable` asserts in development when an icon-only target has no accessible name — there is no
visible text to fall back on, and the omission is invisible in review.

The four physical-direction rules are logical, and a mirrored-layout specimen proves it from
identical markup in both directions.

The four unverified colour pairs were measured. Two passed. Two failed — `primary` on `primarySoft`
at **1.76:1 in dark**, and `mutedForeground` on `muted` at 4.14:1 — and both were the same gap: the
brand and neutral axes had no ink verified against their own soft surface. They now do.

### Open

The header alignment claim was a component defect rather than a documentation one, and is fixed: a
leading title now starts on the content column, measured against body text in the same scope.

1. **No live regions** — a pending action is silent, and the resend timer announces nothing.
2. **Verification-code semantics diverge** — a single hidden input rather than per-digit position.
   Deliberate, for paste and platform autofill, and recorded as a deviation.
3. **Text scaling is untested.** Controls use minimum heights so they grow rather than clip, but
   nothing has been checked at 1.3 or 2.0, and the code row cannot wrap.
4. **High contrast is not consulted.**

## Source coverage

**Read in full, and reflected here:** governance, iconography, interaction, adaptivity,
accessibility. [Foundations](#/foundations/overview), [Patterns](#/patterns/interaction) and the
[Pressable](#/components/pressable) page rest on those reads.

**Read in full:** governance, iconography, space and layout, interaction, immersion, system states,
core components, adaptivity, accessibility.

**Not read, and the prose is provisional:** colour and surface, typography, motion — the owning
sources for [Color](#/styles/color), [Typography](#/styles/typography),
[Elevation](#/styles/elevation) and [Motion](#/styles/motion). Media and commerce components are
unread on purpose: those surfaces are not built, and their required caption, transcript and alt
parameters are breaking to retrofit, so the document gets read when the work starts.

[Space and layout](#/styles/space) was corrected against its owning document and is no longer
provisional. That read added the edge-to-edge rules, the list and grid anatomies, swipe-action
geometry, the thumb-zone map, and the concentric-radius clamp — none of which the paraphrase
contained.

Their **values** are sound — every specimen resolves from `contract/*.json`, which is a verified
lift of the canonical numbers, and the build refuses a number typed into a sentence. What is
unverified is the **prose**: rules like "radius nests concentrically", "hierarchy spans one step",
and the gesture-bridge crossover were paraphrased from this project's own earlier summary rather
than from the documents that own them. A paraphrase of a paraphrase is exactly the drift this
specification exists to prevent.

Until those four are read, treat the Styles pages' guidance as provisional and their numbers as
authoritative. Correcting them is the next task.

**Not read, and not yet needed:** immersion, system states, the two component documents,
philosophy. The feed, capture, gallery and call surfaces depend on them — media components carry
required caption, transcript and alt parameters, which are breaking to retrofit.

## Known deviations

- **Icon vendor substitution.** Iconoir stands in for HugeIcons on identical geometry. Ten roles have
  no glyph and are absent rather than approximated: `live`, `record`, `waveform`, `filePdf`,
  `sticker`, `gif`, `captions`, `cameraFlip`, `receipt`, `unfold`.
- **No photography, illustration, or logo.** None exists in the source. Media slots render a declared
  placeholder; the brand renders as type.
- **Springs are approximations** of the specified physics on the web.
- **Haptics are documented, not fired** — the web has no actuator.
