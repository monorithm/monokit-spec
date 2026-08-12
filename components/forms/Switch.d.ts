import * as React from "react";

/**
 * An immediate, self-applying state — the trailing control of a settings row.
 * If it needs a Save button, it is not a Switch.
 */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** Accessible name, for when the visible label lives in the row rather than the control. */
  label?: string;
  id?: string;
}

export function Switch(props: SwitchProps): JSX.Element;
