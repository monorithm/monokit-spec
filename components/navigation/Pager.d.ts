import * as React from "react";

/**
 * Horizontally swipeable panes with a finger-following track, rubber-band end stops,
 * and velocity-aware settling. The intro sequence and any paged content use it.
 */
export interface PagerProps {
  index?: number;
  /** Called when a swipe or fling commits to a new pane. Keep index in your own state. */
  onIndexChange?: (index: number) => void;
  /** One element per pane. */
  children?: React.ReactNode;
}

export function Pager(props: PagerProps): JSX.Element;
