import * as React from "react";

/**
 * Wraps one control with its label and its single line of status.
 */
export interface FieldProps {
  label?: string;
  /** Quiet guidance, shown while there is no error. */
  hint?: string;
  /** Names the failure and carries the recovery: "That code didn't match — check it or resend". */
  error?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

export function Field(props: FieldProps): JSX.Element;
