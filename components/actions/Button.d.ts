import * as React from "react";

/**
 * The screen's committed action. One primary per screen: if two buttons compete for
 * primary, one of them is not primary.
 *
 * @startingPoint section="Actions" subtitle="Primary, secondary, soft, ghost, bar action, icon" viewport="700x260"
 */
export interface ButtonProps {
  /** primary = the one committed action · secondary/soft = alternatives · ghost = low-emphasis
   *  · plain = an app-bar verb, brand ink and no fill · destructive = needs distance or a confirm step.
   *  @default "primary" */
  variant?: "primary" | "secondary" | "soft" | "ghost" | "plain" | "destructive";
  /** md = 44 (the touch target) · cta = 48, the block action that owns the bottom of a screen. @default "md" */
  size?: "md" | "cta";
  /** Full width. Every CTA at the bottom of a native screen is block. @default false */
  block?: boolean;
  /** Icon role name (never a vendor glyph). Leading in LTR, mirrored in RTL. */
  icon?: string;
  iconEnd?: string;
  /** Non-interactive and communicating progress: swaps the icon for a spinner. */
  pending?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Accessible name. Required when the button is icon-only. */
  label?: string;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
