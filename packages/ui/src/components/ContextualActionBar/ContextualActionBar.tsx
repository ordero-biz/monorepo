'use client';

import type { ContextualActionBarRootProps } from './types';

export const ContextualActionBarRoot = ({
  ariaLabel,
  children,
}: ContextualActionBarRootProps) => (
  <aside
    aria-label={ariaLabel}
    className="relative isolate flex min-w-0 flex-wrap items-center justify-between gap-[var(--space-2)] overflow-hidden rounded-[var(--card-radius)] border border-border bg-transparent p-[var(--card-content-p)] text-card-foreground shadow-[var(--card-x1)_var(--card-y1)_var(--card-blur1)_var(--card-spread1)_var(--color-shadow-20),var(--card-x2)_var(--card-y2)_var(--card-blur2)_var(--card-spread2)_var(--color-shadow-12)] before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:content-[''] before:bg-[color:rgb(from_var(--background)_r_g_b_/_0.8)] before:backdrop-blur-[6px]"
    data-slot="contextual-action-bar"
  >
    {children}
  </aside>
);
