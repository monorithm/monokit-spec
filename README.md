# monokit — the design specification

**This repository is the specification.** Where it disagrees with any realization of the monokit
design language — the Flutter package included — this repository wins. Every realization is
downstream of it.

Published at **[monokit.monorithm.dev](https://monokit.monorithm.dev)**.

monokit is a design *language*, the way Cupertino and Material are languages rather than component
lists. It powers Monorithm's immersive social-commerce surfaces — video feeds, live video, calls,
voice notes, camera capture, chat, document readers, commerce — across mobile, web and desktop.
Adaptiveness is not optional in it.

Read **[STANDARD.md](STANDARD.md)** first. It is the governing document: where authority sits, the
three adaptation axes, the contract format, and what conformance means.

## How it holds together

`contract/*.json` is the platform-neutral build source — tokens and component contracts as data,
with the rationale attached. Everything else derives from it:

| Derived | From | How |
|---|---|---|
| `tokens/*.css`, `dart/*.dart` | the contract | `yarn generate` |
| Every value on the site | the contract | specimen directives, resolved at build time |
| Numbers quoted in prose | the contract | the inline `` `token:path` `` form |

Nothing quotes a number by typing it. `yarn check:prose` fails the build when a contract value
appears as a literal in a sentence, and names the directive to use instead. That check exists
because the alternative — a page and a contract that disagree — is the specific failure this
specification is built to prevent.

Component contracts carry MUST / SHOULD / NEVER clauses stating **outcomes** an implementation can
be held to, since the mechanism differs per platform but the resolved behaviour must not.

## The site

A page per component, in the shape of a full design specification: live interactive example,
anatomy with numbered pins over the real rendered component, states matrix, do-and-don't pairs,
clauses, accessibility notes, behaviour and gestures, token reference, and React and Flutter usage.

The anatomy diagrams are labelled callouts positioned over a **live** component rather than
illustrations, so a diagram cannot drift from the code. The site chrome is built entirely from the
system's own tokens, so the site cannot drift from what it documents.

React and Flutter appear in clearly-marked tabs and carry **no normative weight**. The `.jsx`
sources under `components/` are the reference realization the specimens run against; they are a
design-work recreation, not a published package.

## Conformance is published, not hidden

The [Status page](https://monokit.monorithm.dev/about/status/) lists where this specification's own
realization falls short — open accessibility gaps, known vendor deviations, and which source
documents each page rests on. A specification that conceals its conformance debt teaches teams to
do the same.

## Working on it

```bash
yarn install
yarn dev
```

See [AGENTS.md](AGENTS.md) for the layout, the checks, and the conventions.

## License

Apache 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
