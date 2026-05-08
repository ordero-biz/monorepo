import type { HeaderRightProps } from './types';

export const HeaderRight = ({ children }: HeaderRightProps) => (
  <div
    className="flex min-w-0 flex-1 items-center justify-end gap-[var(--space-1)]"
    data-slot="header-right"
  >
    {children}
  </div>
);
