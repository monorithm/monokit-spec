import * as React from "react";

/**
 * The native screen frame: chrome, one scrolling content region, one committed action.
 * Never nest a Screen inside a Screen — a screen is the whole viewport.
 *
 * @startingPoint section="Navigation" subtitle="Screen regions, app bar, page dots" viewport="720x520"
 */
export interface ScreenProps {
  /** App chrome — a ScreenHeader, or nothing at all on a full-bleed screen. */
  header?: React.ReactNode;
  /** The committed action region. Lifts by the keyboard inset when the keyboard is up. */
  footer?: React.ReactNode;
  /** Screen sits on the media canvas: true black, on-media inks, transparent chrome. */
  onMedia?: boolean;
  /** Momentum scrolling on the content region. Turn off for a pager or a camera surface. @default true */
  scroll?: boolean;
  safeTop?: boolean;
  safeBottom?: boolean;
  /** Apply the page inset to the content region. Off for full-bleed lists and media. @default true */
  padded?: boolean;
  children?: React.ReactNode;
}

export function Screen(props: ScreenProps): JSX.Element;
