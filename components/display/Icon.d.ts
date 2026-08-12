import * as React from "react";

/**
 * A stroke glyph on the 24 grid, addressed by SEMANTIC ROLE.
 *
 * Ask for what the user means — `back`, `like`, `cartAdd` — never for a vendor glyph.
 * The catalog is contract/icon.json (89 roles); the role-to-glyph binding is the system's
 * private concern, which is what lets a vendor change in one place.
 */
export interface IconProps {
  /** Semantic role, e.g. "back" | "like" | "camera" | "cartAdd". A raw vendor id still
   *  renders but warns: it bypasses the indirection the catalog exists to provide. */
  name: string;
  /** Omit to resolve from density — 16 at pointer, 20 at touch. Set explicitly only when
   *  the size is part of the design (28 on an action rail, 32 in an empty state). */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Selected state: stroke 2.0 plus colour. There is no filled tier, reactions included. */
  active?: boolean;
  /** Icons inherit the colour of the text they accompany; set this only for a status hue. */
  color?: string;
  /** Overrides the role's default accessible name. */
  label?: string;
  /** Excludes the icon from semantics entirely — for when an adjacent label already names it. */
  decorative?: boolean;
}

export function Icon(props: IconProps): JSX.Element;
