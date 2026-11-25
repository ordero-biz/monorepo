import type { PageHeaderRightProps } from './types';

export const PageHeaderRight = ({ children }: PageHeaderRightProps) => (
  <div
    className="ml-auto flex shrink-0 items-center justify-end gap-[var(--space-1)]"
    data-slot="page-header-right"
  >
    {children}
  </div>
);
