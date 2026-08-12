import * as React from "react";

/**
 * A person, at one of the density sizes. With no `src` it renders the declared
 * placeholder — media canvas plus the person glyph — rather than faking a photo.
 */
export interface AvatarProps {
  /** Pixel size. 32 in a row, 40 in chrome, 96+ as a screen subject. @default 40 */
  size?: number;
  src?: string;
  alt?: string;
  /** Show the emerald camera affordance over the bottom-trailing corner. */
  edit?: boolean;
}

export function Avatar(props: AvatarProps): JSX.Element;
