import * as React from "react";

/**
 * Six cells, one decision. A hidden input owns keystrokes, paste, and one-time-code
 * autofill; the cells are presentation only.
 */
export interface InputOtpProps {
  /** @default 6 */
  length?: number;
  value?: string;
  /** Receives digits only — non-numeric input is dropped, not rejected with an error. */
  onChange?: (value: string) => void;
  /** Fires when the last cell fills. Submit from here; never make the user press Continue. */
  onComplete?: (value: string) => void;
  /** Wrong code: shakes once, paints the cells destructive-soft, keeps the digits visible. */
  invalid?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  /** Accessible name for the hidden input. @default "Verification code" */
  label?: string;
}

export function InputOtp(props: InputOtpProps): JSX.Element;
