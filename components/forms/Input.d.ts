import * as React from "react";

/**
 * A single-line text field. Native fields are wells: muted fill, no border, radius-xl.
 *
 * @startingPoint section="Forms" subtitle="Well fields, phone row, OTP, switch" viewport="720x320"
 */
export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  /** md = 48 · lg = 56 with headline-medium tabular figures, when the screen's subject IS this value. @default "md" */
  size?: "md" | "lg";
  /** Paints the destructive-soft surface. Pair with Field's error line. */
  invalid?: boolean;
  disabled?: boolean;
  inputMode?: "text" | "tel" | "numeric" | "email" | "decimal";
  autoComplete?: string;
  maxLength?: number;
  /** Static leading text inside the well, e.g. a dial code or currency symbol. */
  prefix?: React.ReactNode;
  id?: string;
}

export function Input(props: InputProps): JSX.Element;
