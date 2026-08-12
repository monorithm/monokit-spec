# Content and voice

## Voice

Prescriptive present tense, no hedging: "Buttons confirm; they never surprise." Product copy inherits
that directness — it states what is true right now and what the user can do about it.

## Casing

Sentence case everywhere: headings, buttons, labels, tabs, badges. **No all-caps, no title case, and
uppercase labels are never letterspaced.** monokit does not use all-caps text anywhere.

## Person

Copy addresses the user as *you* and never speaks as "we". The system reports its own state
impersonally rather than apologising for it.

```monokit-do
"You're offline." · "Waiting to send." · "Couldn't send — tap to retry."
```

```monokit-dont
"We couldn't process your request at this time." · "Oops! Something went wrong."
```

## Honest status

A small fixed vocabulary. Apps supply the strings; the system supplies the slot.

- **Pending** — "Sending…", "Waiting to send", "Publishing…", "Processing…"
- **Measurable progress** — "Uploading 43%", with tabular numerals and a real percentage
- **Failure** — "Couldn't send — tap to retry", "Not sent"
- **Expiry** — "Code expired — resend", "This feed session ended — refresh"
- **Degraded** — "Some content may be out of date", "You're offline"
- **Empty and first run** — "You're caught up", "Record your first note"

**Name the failure class when the client can distinguish it.** "You're offline" beats "Something
went wrong". A terminal failure always carries an action. Copy never claims a state the system is
not in: no "Saved" before the save lands, no "Delivered" without a delivery event.

Contractions are used — the register is plain and spoken. Ellipses mark work in flight. Em dashes
join a failure to its recovery.

## Length

Chrome labels are one or two words. A status line is one sentence. Body and prose stay within 65–70
characters per line. Data the user must act on — prices, error messages, verification codes — is
never truncated.

## Numbers are load-bearing

Prices, counts, timers, and IDs are pre-formatted by the app. The system guarantees only that they
do not jitter (tabular figures) and are not truncated. Currency symbols take the same role and weight
as the amount, and decimals are never smaller than the integer part.

## Emoji

Emoji are not interface elements. They defer to the platform emoji font in user content; reaction and
mood pickers use a stroke icon family. Unicode glyphs as icons are deprecated.

## Accessible names are content

Every icon-only control has a label. Composite states read as one node — "Ama, 14:02, delivered" —
rather than three stops. A struck-through price announces as "was X, now Y". Timers read as text.
