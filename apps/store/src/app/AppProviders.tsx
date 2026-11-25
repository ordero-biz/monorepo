'use client';

import { ToastProvider, ToastViewport } from '@ordero/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getQueryClient } from '@/lib/query/queryClient';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ToastProvider>
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
    <ToastViewport />
  </ToastProvider>
);
