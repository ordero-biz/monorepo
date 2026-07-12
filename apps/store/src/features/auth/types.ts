import type { ReactNode } from 'react';

export type AuthFormLayoutProps = {
  children: ReactNode;
  footerHref?: string;
  footerLabel?: string;
  footerPrompt?: string;
  subtitle: string;
  title: string;
};

export type AuthPageShellProps = {
  children: ReactNode;
};
