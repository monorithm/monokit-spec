# Working in this repository

This repo is the **monokit design specification**. It is normative: where it disagrees with any
realization — the Flutter package included — this repo wins. Read `STANDARD.md` first; it is the
governing document.

## The rule that matters most

**No canonical number is ever typed into a page.** `contract/*.json` owns every value.
`tokens/*.css` and `dart/*.dart` are generated from it, and prose quotes it through a directive or
the inline `` `token:path` `` form. `yarn check` fails the build when a contract value appears as a
literal in a sentence, and names the directive to use instead.

To change a value, change `contract/<family>.json` and run `yarn generate`. Never hand-edit a
generated file.

## Checks

```
yarn check            all four, in the order CI runs them
yarn check:tokens     generated CSS and Dart still match the contract
yarn check:prose      no contract value typed into a sentence
yarn check:nav        src/nav.json and src/content agree, both directions
yarn check:specimens  every specimen key has a builder, and every K.member exists
```

`yarn build` runs `astro build`. CI runs `yarn check` before it, so a hand-edited token file or a
number typed into prose fails the deploy rather than shipping.

## Layout

| Path | What it is |
|---|---|
| `src/content/**.md` | The specification. Plain markdown, no frontmatter. |
| `src/nav.json` | The information architecture: sections, order, home. |
| `src/plugins/remark-monokit.mjs` | The specimen directives that resolve at build time. |
| `src/islands/` | The live specimens, as React islands. |
| `contract/*.json` | Platform-neutral source of every value, with rationale attached. |
| `components/**/*.jsx` | Canonical component sources. The site imports these directly. |
| `build/` | `emit.js` (pure emitters), `generate.mjs` (CLI, `--check`), the two other checks. |
| `record/` | Why the system is the way it is: settled decisions, corrections, the accessibility audit. |

## Conventions

- Markdown carries **no frontmatter**; the first `# H1` is the title. Pages read correctly on
  GitHub and on the site.
- Specimens are fenced blocks with a `monokit-` language tag, so a page degrades to readable
  source in any plain markdown viewer. Keep it that way — it is a settled decision in
  `record/SITE-BRIEF.md`.
- Prose is one sentence per line where practical.
- Use `.vscode/` over `.claude/`, `.agents/skills/` over `.claude/skills/`, and `AGENTS.md` over
  `CLAUDE.md`.

## Development

```
yarn dev
```
