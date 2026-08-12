# monokit spec site — build brief

Decisions taken with the system owner across four rounds, 2026-08-10. This file is the record;
everything below is settled unless a later amendment says otherwise.

## Goal

A full design specification site in the shape of m3.material.io, with **React and Flutter as
implementation targets**. This project's markdown becomes the specification; `monorithm/monokit-design`
forks and continues serving the Flutter team.

## Settled

| Decision | Choice |
|---|---|
| Information architecture | Mirror M3 — a page per component, search across everything |
| Section split | **Three-way**: Foundations (principles) · Styles (tokens) · Patterns (interaction, immersion, states) · then Components |
| Content generation | Generated specimens, authored prose — values, swatches, measurement tables and code emit from `contract/*.json`; guidance is written per page |
| Specimen syntax | Fenced code blocks with a language tag — ` ```monokit-swatches colors.light ` — so a page degrades to visible source in any plain markdown viewer |
| Delivery | Markdown plus a renderer; content stays in `.md` and the site is a thin shell over it |
| Authority | **Site content becomes the specification.** The `00–13` numbering retires with a redirect map; the site's structure becomes the ownership model |
| Normativity | Stays implementation-agnostic. React and Flutter appear in clearly-marked tabs that carry **no normative weight** |
| React tab | Illustrative — snippets showing intended API. The `.jsx` here remains a design-work recreation, not a published package |
| Mandate | Sanctioned by the system owner (required, since this amends governance) |
| Single-source-of-numbers rule | Dropped for tokens; **replaced by a build check** that scans markdown for numerals matching a contract value and fails, naming the directive to use instead |
| Repo handover | **Fork and diverge** — the repo keeps serving the Flutter team, the site serves everyone else |
| Precedence | **The site wins.** Stated on every page and in the fork's README, so the Flutter team knows where authority moved |
| First cut | Foundations complete, plus one exemplar component page, before repeating the pattern |

## Every component page carries

Live interactive example · anatomy diagram with numbered parts · states matrix (rest, hover, press,
focus, disabled, pending) · do-and-don't pairs · MUST/SHOULD/NEVER clauses · accessibility notes ·
React usage · Flutter usage · token reference · behaviour and gestures.

Anatomy is **labelled callouts positioned over a live component** — numbered pins on the real
rendered thing, so the diagram cannot drift from the code. No illustration is generated; none can be.

## Risks raised and resolved

**Prose numbers.** Dropping the single-source rule left numerals typed into sentences unguarded —
the generator only governs the files it emits. Resolved: the build now scans markdown for numerals
matching a contract value and fails, naming the directive to use instead. Bare numerals survive only
where they match nothing in the contract.

**Two specifications.** Fork-and-diverge means the repo and the site both describe the language.
Resolved by stating precedence rather than preventing the fork: **the site wins**, declared on every
page and in the fork's README. The Flutter team keeps its repo, and knows it is downstream.

## Built

`site/` — open `site/index.html`.

| Piece | What it is |
|---|---|
| `site/index.html` | The shell: three-way navigation, hash routing, client-side search, on-page contents, theme toggle, and the React mounts for live specimens |
| `site/render.js` | Markdown renderer plus the specimen directives. ~3kB, no dependency |
| `site/site.css` | Site chrome, built entirely from the system's own tokens so the site cannot drift from what it documents |
| `site/nav.json` | The information architecture, including which pages are stubs |
| `site/content/**.md` | The specification itself |
| `build/check-prose.mjs` | Fails the build when a contract value is typed into a sentence |

### Directives

Fenced blocks with a `monokit-` language tag, so any page degrades to readable source in a plain
markdown viewer:

`monokit-swatches` · `monokit-scale` · `monokit-table` · `monokit-type` · `monokit-clauses` ·
`monokit-tokens` · `monokit-example` · `monokit-anatomy` · `monokit-states` · `monokit-do` ·
`monokit-dont`

Plus an inline form for prose: `\`token:interaction.focusRing.width\`` resolves to the contract value
with its path as the title, so a sentence can quote a number without owning a copy of it.

### Pages written

Foundations (4) · Styles (6) · Patterns (1 of 3) · Components (1 of 15, the Pressable exemplar) ·
About (2). Fourteen component pages are stubs, marked as such in the navigation.
