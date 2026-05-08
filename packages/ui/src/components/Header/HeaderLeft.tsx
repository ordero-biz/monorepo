import type { HeaderLeftProps } from './types';

export const HeaderLeft = ({ children }: HeaderLeftProps) => (
  <div
    className="flex min-w-0 flex-1 items-center gap-[var(--space-1)]"
    data-slot="header-left"
  >
    {children}
  </div>
);
