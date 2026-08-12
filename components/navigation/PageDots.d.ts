/**
 * Where you are in a Pager. The active dot widens into a bar. Position only — never
 * the sole means of navigation.
 */
export interface PageDotsProps {
  count: number;
  index?: number;
  onMedia?: boolean;
  /** @default "Page" */
  label?: string;
}

export function PageDots(props: PageDotsProps): JSX.Element;
