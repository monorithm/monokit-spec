import * as React from "react";

/**
 * The app bar. Chrome is the app's, not the page's: no bottom hairline, no shadow.
 * Pass `steps` for a flow and the bar shows hairline progress instead of a title.
 */
export interface ScreenHeaderProps {
  title?: React.ReactNode;
  /** Renders the leading back affordance. Omit on the first screen of a flow. */
  onBack?: () => void;
  backLabel?: string;
  /** Trailing verb — usually a `plain` Button ("Skip", "Done"). */
  action?: React.ReactNode;
  /** Flow progress as hairline segments. Replaces the title. */
  steps?: { total: number; done: number };
  transparent?: boolean;
  /** Over media: transparent bar, on-media inks. */
  onMedia?: boolean;
}

export function ScreenHeader(props: ScreenHeaderProps): JSX.Element;
