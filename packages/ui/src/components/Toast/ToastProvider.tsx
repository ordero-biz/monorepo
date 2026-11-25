'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { ToastProviderProps } from './types';

export const ToastProvider = ({
  children,
  limit = 3,
  timeout = 5000,
}: ToastProviderProps) => (
  <ToastPrimitive.Provider limit={limit} timeout={timeout}>
    {children}
  </ToastPrimitive.Provider>
);

ToastProvider.displayName = 'ToastProvider';
