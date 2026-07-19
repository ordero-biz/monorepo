'use client';

import type { ContextualActionBarRightProps } from './types';

export const ContextualActionBarRight = ({
  children,
}: ContextualActionBarRightProps) => (
  <div
    className="flex shrink-0 flex-wrap items-center gap-[var(--space-1)]"
    data-slot="contextual-action-bar-right"
  >
    {children}
  </div>
);
