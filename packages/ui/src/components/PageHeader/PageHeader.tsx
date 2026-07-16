import type { PageHeaderProps } from './types';

export const PageHeaderRoot = ({ children }: PageHeaderProps) => (
  <div
    className="flex items-center min-w-0 justify-between gap-[var(--space-2)] p-[var(--space-1-25)]"
    data-slot="page-header"
  >
    {children}
  </div>
);
