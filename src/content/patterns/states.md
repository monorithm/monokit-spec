# System states

The interface never lies. Pending is visible, optimistic is reconciled, failure is actionable, expiry
is deterministic.

The client is event-driven: the app expresses intent as a command, the server validates and emits
facts. This makes that architecture **visible without making it noisy**.

> **Success is announced only when the server says so.** "Accepted" means the server has your intent.
> It is not success, and it never triggers success colour, success haptics, or the celebration spring.

## Five visible phases

The command lifecycle has eight machine states. Eight is too many for a person, so they collapse into
five phases — and a component accepts the phase, never the transport type.

| Phase | Machine states | What the user sees |
|---|---|---|
| `pending` | created, queued, sent | Intent in flight. A quiet badge |
| `reconciling` | accepted | The server has it; the read model is catching up. One shimmer sweep |
| `succeeded` | completed | The affordance removes; the entity settles |
| `rejected` | rejected | The domain said no. Reason and actions, in place |
| `stalled` | exhausted | Transport gave up. The user decides |

`abandoned` maps to no phase at all: the affordance removes silently, with no residue.

**Sub-states within pending must not cause visual churn.** Created to queued to sent happens in
milliseconds when online, and a badge that flickers through three labels reads as instability. One
label, one dot.

## The pending badge

The smallest honest-state unit: a quiet dot and label attached to the affected entity — a bubble tail,
a card corner, a button interior, an order row.

It sits on the muted well with muted ink and a hairline. **Pending is neutral, never alarming** — it
is the system working as designed. The dot pulses on the calm scheme, opacity only, and is static
under reduced motion.

Labels come from a small fixed vocabulary: "Sending…", "Waiting to send", "Publishing…",
"Processing…". Apps supply the strings; the system supplies the slot. At small sizes the dot alone is
the minimum.

**In a button**, pending swaps the label for a spinner while *preserving its width* — no layout jump —
and disables input while staying visually alive. A pending button never simply greys out with no
indicator.

```monokit-example states-pending
```

## The reconciling shimmer

When a command is accepted and local state is being replaced by server truth, the entity plays
**one** shimmer sweep.

The purpose is to mark the instant a local guess becomes server fact, so a value changing under the
user — a recalculated price, a re-rendered caption — reads as confirmation rather than glitch.

**One sweep only.** A looping shimmer means loading; a single sweep means settled. Blurring the two
meanings costs you both. Under reduced motion the entity cross-fades instead, and the sweep is skipped
entirely when server truth is identical to the optimistic render — reconciliation without change is
invisible.

A table cannot show time, and every phase above is a duration. Run a command here and watch one go
the whole way: the press lands at once, the badge holds while the intent is in flight, a single
sweep marks the moment server truth arrives, and the check appears only once the server reports
completion. Force a failure to send the same run to `stalled` instead, where the retry is the
affordance.

```monokit-example honest-state-timeline
```


## Rejected and stalled are different

They look different because they are different, and the difference tells the user what to do.

**Rejected** is a domain fact: the server understood and said no. It renders in place on the entity,
with the reason and the actions, in destructive ink on the destructive soft surface. Its badge reads
"Failed".

**Stalled** is a transport fact: nobody said no, the attempt simply gave up. Warning ink on the
warning soft surface, "Couldn't send — tap to retry", badge "Not sent". The retry is the point.

```monokit-example states-terminal
```

Naming the failure class is the whole job. "You're offline" beats "Something went wrong", because one
of them tells the user whether to wait or to act.

## A dropped connection is not a failure

A settled state must be reachable even if the realtime channel drops. "The channel disconnected while
a command was in flight" is a first-class case, not an edge case: the entity **stays in reconciling**
and settles from the next query refresh.

**Never convert a transport disconnect into a shown failure.** The user did nothing wrong and nothing
has failed; claiming otherwise teaches them to distrust every state you show.

## Expiry is deterministic

Server-issued expiry timestamps are contracts the interface acts on at the exact moment they expire,
not whenever something next happens to re-render.

Expiry is **announced, not sprung**: a banner appears while the content is still valid, so the user
can finish. A timer reads as text and announces at start, halfway and zero — never every second.

## The loading hierarchy

Skeleton before spinner. A skeleton shows the shape of what is coming, which makes the wait
legible; a spinner is for a space-constrained slot or a wait shorter than a moderate duration.

Neither is a substitute for the honest phase vocabulary above. A spinner says "something is
happening"; a pending badge says *what*.

## Copy

| Situation | Say |
|---|---|
| In flight | "Sending…", "Publishing…", "Processing…" |
| In flight, offline | "Waiting to send" |
| Measurable | "Uploading 43%", in tabular figures |
| Transport gave up | "Couldn't send — tap to retry", "Not sent" |
| Expired | "Code expired — resend", "This feed session ended — refresh" |
| Degraded | "Some content may be out of date", "You're offline" |
| Empty | "You're caught up", "Record your first note" |

Copy never claims a state the system is not in. No "Saved" before the save lands, no "Delivered"
without a delivery event.

## Accessibility

Assistive-technology users get the same truth at the same time, not a silent spinner. A phase change
that matters announces; a phase change that does not is silent rather than chatty.

**Never put a live region on anything that re-renders more than once a second.** A countdown that
announces every tick is unusable, and it is also unnecessary — the timer is text, readable at any
moment.

A toast never carries the only copy of essential information.

## What this realization ships

The vocabulary is documented and largely unimplemented here. `Button` has a `pending` state that
holds its width and shows a spinner; `Field` has a pending affordance slot. The badge, the shimmer
sweep, the rejected and stalled affordances, and the banner are specified above and not yet built —
and the live regions that would announce them are open work in [Status](#/about/status).

The specification leads; that gap is visible rather than hidden.
