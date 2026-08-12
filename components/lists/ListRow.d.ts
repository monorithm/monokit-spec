import * as React from "react";

/**
 * One row of a grouped list: 48 high for one line, 64 for two. Give it `onPress` and it
 * becomes a real press target with the row-tint feedback; leave it off and it is
 * information only.
 */
export interface ListRowProps {
  /** Leading icon role name — the common case. */
  icon?: string;
  /** Any leading element instead of an icon (an Avatar, for example). */
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** Second line: the consequence of the row, not a restatement of the title. */
  subtitle?: React.ReactNode;
  /** Trailing value text, tabular. */
  value?: React.ReactNode;
  /** Trailing control — a Switch, a Button, a badge. An interactive one keeps its own tap and
   *  tab stop: the row's press target stops before this column. Do not also point `onPress`
   *  at the state this control owns. */
  trailing?: React.ReactNode;
  /** Show the disclosure chevron. Only on rows that navigate. */
  chevron?: boolean;
  onPress?: () => void;
  /** Long-press for the row's context menu, at the 500ms threshold. */
  onLongPress?: () => void;
  /** Set by ListGroup — do not pass it yourself. */
  separator?: boolean;
}

export function ListRow(props: ListRowProps): JSX.Element;
