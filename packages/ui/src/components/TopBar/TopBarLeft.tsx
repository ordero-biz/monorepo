import type { TopBarLeftProps } from './types';

export const TopBarLeft = ({ children }: TopBarLeftProps) => (
  <div
    className="flex min-w-0 flex-1 items-center gap-[var(--space-1)]"
    data-slot="top-bar-left"
  >
    {children}
  </div>
);
