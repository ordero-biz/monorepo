'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { viewportListClassName, viewportStackClassName } from './classNames';
import { ToastList } from './ToastList';
import type { ToastViewportProps } from './types';

export const ToastViewport = ({
  layout = 'stack',
  swipeDirection = ['down', 'right'],
  viewportLabel = 'Notifications',
}: ToastViewportProps) => (
  <ToastPrimitive.Portal>
    <ToastPrimitive.Viewport
      aria-label={viewportLabel}
      className={
        layout === 'list' ? viewportListClassName : viewportStackClassName
      }
    >
      <ToastList layout={layout} swipeDirection={swipeDirection} />
    </ToastPrimitive.Viewport>
  </ToastPrimitive.Portal>
);

ToastViewport.displayName = 'ToastViewport';
