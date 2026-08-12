# Governance

## Authority

**This site is the specification.** It is authoritative and implementation-agnostic: it names its
own constructs because every implementation realizes them, and it never defers to the internals of
any one of them.

Precedence, when sources disagree:

1. **The four locked decisions.** Not re-litigated in any page or review.
2. **This site**, within each page's declared subject.
3. **Any realization** — the React recreation here, the Flutter package, anything downstream.

Where a realization contradicts this site, the realization is what changes.

## The fork

`monorithm/monokit-design` continues to serve the Flutter team as a downstream document. It is not
a peer. When the two disagree, this site wins, and the fork's README says so.

This replaced an earlier arrangement in which numbered documents `00`–`13` each owned a subject and
its canonical numbers. That numbering has retired; the site's structure is the ownership model, and a
redirect map carries the old paths.

## Where the numbers live

Every canonical value lives in `contract/*.json` — a machine-readable mirror that generates the CSS
custom properties and the Dart constants. No page types a token value by hand: specimens resolve
from the contract at render time, which is why a page and the code cannot disagree.

The build fails when markdown contains a numeral matching a contract value, and names the directive
to use instead. Bare numerals survive only where they match nothing in the contract.

## Conformance

An implementation conforms when it realizes this specification. Reviews check:

- **Tokens** — styles resolve from semantic tokens only; no literal colours, durations, radii or
  sizes in component bodies.
- **States** — every honest state the data can occupy renders.
- **Motion** — every animation binds to a named role; reduced motion collapses it.
- **Layer** — the component declares its z-layer; anything above content justifies its treatment.
- **Adaptivity** — behaviour specified per width class and modality; every gesture ships its pointer
  and keyboard alternative in the same change.
- **Accessibility** — the five-part contract in [Accessibility](#/foundations/accessibility).

## Implementation targets

React and Flutter appear in clearly-marked tabs on each component page. **Those tabs carry no
normative weight.** They illustrate intended API; the rule is the prose and the clauses above it.

The React code in this project is a cosmetic-fidelity recreation for design work, not a published
package. Treat its snippets as examples of the rule, not as an installable contract.

## Amendments

A change that would break a locked decision or a canonical number is written up before it ships,
never applied quietly. Amending a locked decision, or governance itself, requires the system owner
rather than a pull request.
