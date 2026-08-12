import * as React from "react";

/**
 * A group of full-bleed rows. Containment comes from the header in the margin and the
 * inset hairlines — never from a card edge, which this system does not have.
 *
 * @startingPoint section="Lists" subtitle="Grouped full-bleed rows, inset separators" viewport="720x420"
 */
export interface ListGroupProps {
  /** Sits in the page margin, muted, sentence case. */
  header?: string;
  /** Explanatory line under the group — the place for consequences and caveats. */
  footer?: string;
  /** ListRow children. The group assigns each row's separator; the last one gets none. */
  children?: React.ReactNode;
}

export function ListGroup(props: ListGroupProps): JSX.Element;
