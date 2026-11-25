'use client';

import type { ContextualActionBarLeftProps } from './types';

export const ContextualActionBarLeft = ({
  children,
}: ContextualActionBarLeftProps) => (
  <div
    className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--space-1)]"
    data-slot="contextual-action-bar-left"
  >
    {children}
  </div>
);
