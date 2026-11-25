import type { TopBarRightProps } from './types';

export const TopBarRight = ({ children }: TopBarRightProps) => (
  <div
    className="ml-auto flex shrink-0 items-center justify-end gap-[var(--space-1)]"
    data-slot="top-bar-right"
  >
    {children}
  </div>
);
