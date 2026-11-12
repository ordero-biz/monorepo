import type { ReactNode } from 'react';

export type BaseLayoutProps = {
  children: ReactNode;
  isInitialSidebarCollapsed?: boolean;
};

export type BaseLayoutContextualActionBarProps = {
  children: ReactNode;
};
