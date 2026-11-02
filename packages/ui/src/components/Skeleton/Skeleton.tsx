import { cva } from 'class-variance-authority';
import type { SkeletonProps } from './types';

const skeletonVariants = cva('max-w-full', {
  variants: {
    hasChildren: {
      true: 'inline-grid min-w-0 align-middle',
      false: 'block shrink-0',
    },
    loading: {
      true: 'bg-secondary',
      false: '',
    },
    shape: {
      rounded: 'rounded-[var(--radius)]',
      circle: 'rounded-full',
    },
    animated: {
      true: 'motion-safe:animate-pulse',
      false: '',
    },
  },
});

export const Skeleton = ({
  children,
  loading = true,
  shape = 'rounded',
  width,
  height,
  animated = true,
}: SkeletonProps) => {
  const hasChildren = children != null && typeof children !== 'boolean';
  if (!hasChildren && !loading) return null;

  const resolvedWidth =
    width ??
    (hasChildren ? undefined : shape === 'circle' ? 'var(--space-5)' : '100%');
  const resolvedHeight =
    height ??
    (hasChildren
      ? undefined
      : shape === 'circle'
        ? resolvedWidth
        : 'var(--space-2)');

  return (
    <span
      aria-hidden={loading || undefined}
      inert={loading || undefined}
      className={skeletonVariants({
        shape,
        animated: loading && animated,
        hasChildren,
        loading,
      })}
      style={{ width: resolvedWidth, height: resolvedHeight }}
    >
      {hasChildren ? (
        <span
          className={
            loading ? 'min-w-0 pointer-events-none opacity-0' : 'min-w-0'
          }
        >
          {children}
        </span>
      ) : null}
    </span>
  );
};
