import type { CSSProperties, ReactNode } from 'react';

export type SkeletonShape = 'rounded' | 'circle';

/** Decorative placeholder. Its owning region provides the loading announcement. */
export type SkeletonProps = {
  /** Inline content determines the size and stays mounted while loading. Do not wrap portals. */
  children?: ReactNode;
  /** Hide and prevent interaction with children while loading. Defaults to true. */
  loading?: boolean;
  /** Optional overrides. Without children, prefer semantic tokens or percentages. */
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  shape?: SkeletonShape;
  /** Pulse is automatically disabled when reduced motion is requested. */
  animated?: boolean;
};
