'use client';

import { ToastProvider, ToastViewport } from '@ordero/ui';
import type { ReactNode } from 'react';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
};
