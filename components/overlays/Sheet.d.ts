import * as React from "react";

/**
 * A bottom sheet: one decision, entering from the edge it belongs to, dismissed by
 * dragging it away past 30% of its height or above 700 px/s. The native replacement
 * for a centred dialog on a phone.
 *
 * @startingPoint section="Overlays" subtitle="Drag-to-dismiss bottom sheet" viewport="720x520"
 */
export interface SheetProps {
  open: boolean;
  /** Called by the grabber drag, the scrim press, and Escape. */
  onClose?: () => void;
  /** Also the dialog's accessible name. */
  title?: string;
  children?: React.ReactNode;
  /** Pinned below the scrolling body — a confirm action, if the sheet needs one. */
  footer?: React.ReactNode;
}

export function Sheet(props: SheetProps): JSX.Element | null;
