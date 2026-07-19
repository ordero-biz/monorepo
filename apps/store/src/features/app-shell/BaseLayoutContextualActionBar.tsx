'use client';

import type { BaseLayoutContextualActionBarProps } from './types';

export const BaseLayoutContextualActionBar = ({
  children,
}: BaseLayoutContextualActionBarProps) => (
  <div
    className="fixed right-[var(--space-4)] bottom-[var(--space-4)] left-[calc(var(--base-layout-main-offset)_+_var(--space-4))] z-40 flex justify-center"
    data-slot="base-layout-contextual-action-bar"
  >
    <div className="w-full max-w-[var(--base-layout-content-max-width)]">
      {children}
    </div>
  </div>
);
