import * as React from "react";

/**
 * The gesture primitive behind every native touch affordance: press-in within one
 * frame, long-press at 500ms, clean cancel when the finger leaves.
 *
 * Use it directly for anything pressable that is not a Button — a row, a card region,
 * a media tile. Never attach a bare onClick to a div; a native press has states.
 */
export interface PressableProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered element. Use "button" for anything actionable. @default "button" */
  as?: "button" | "div" | "li" | "a";
  onPress?: () => void;
  /** Recognised at longPressDelay; suppresses the press that would have followed. */
  onLongPress?: () => void;
  /** @default 500 — the specified long-press threshold. */
  longPressDelay?: number;
  disabled?: boolean;
  /** Non-interactive AND communicating progress. Not the same as disabled. */
  pending?: boolean;
  /** Apply the native press scale (0.97) to the whole target. @default false */
  scale?: boolean;
  children?: React.ReactNode;
}

export function Pressable(props: PressableProps): JSX.Element;
