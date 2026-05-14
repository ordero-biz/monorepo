'use client';

import { ToastProvider } from './ToastProvider';
import { ToastViewport } from './ToastViewport';
import type { ToastProps } from './types';

export const Toast = ({
  children,
  layout = 'stack',
  limit = 3,
  swipeDirection = ['down', 'right'],
  timeout = 5000,
  viewportLabel = 'Notifications',
}: ToastProps) => (
  <ToastProvider limit={limit} timeout={timeout}>
    {children}
    <ToastViewport
      layout={layout}
      swipeDirection={swipeDirection}
      viewportLabel={viewportLabel}
    />
  </ToastProvider>
);

Toast.displayName = 'Toast';
