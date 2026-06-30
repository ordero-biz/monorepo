import type { PageHeaderLeftProps } from './types';

export const PageHeaderLeft = ({ children }: PageHeaderLeftProps) => (
  <div
    className="flex min-w-0 flex-1 items-center gap-[var(--space-1)]"
    data-slot="page-header-left"
  >
    {children}
  </div>
);
