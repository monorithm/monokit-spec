import React from "react";
import { Button } from "../actions/Button.jsx";

/* ScreenHeader — app chrome, not page furniture: no hairline underneath, no shadow,
   nothing that reads as a document header. Back is an icon at the leading edge; a flow's
   progress is hairline segments, never a percentage. */
export function ScreenHeader({
  title, onBack, backLabel = "Back", action, steps, transparent = false, onMedia = false,
}) {
  return (
    <header className="mk-appbar" data-transparent={transparent ? "true" : "false"}
      data-on-media={onMedia ? "true" : "false"}>
      <span className="mk-appbar-slot">
        {onBack ? <Button variant="ghost" icon="chevronLeft" label={backLabel} onPress={onBack} /> : null}
      </span>
      {steps
        ? <span className="mk-appbar-mid mk-steps" role="img" aria-label={"Step " + steps.done + " of " + steps.total}>
            {Array.from({ length: steps.total }).map((_, i) => (
              <span key={i} className="mk-step" data-done={i < steps.done ? "true" : "false"} />
            ))}
          </span>
        : <span className="mk-appbar-mid mk-appbar-title">{title}</span>}
      <span className="mk-appbar-slot">{action}</span>
    </header>
  );
}
