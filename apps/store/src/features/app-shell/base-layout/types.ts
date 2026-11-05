import type { ReactNode } from 'react';

export type BaseLayoutProps = {
  children: ReactNode;
  defaultSidebarCollapsed?: boolean;
};

export type BaseLayoutContextualActionBarProps = {
  children: ReactNode;
};
