import type {
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  UseToastManagerReturnValue,
} from '@base-ui/react/toast';
import type { ReactNode } from 'react';

export type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';
export type ToastSwipeDirection = 'up' | 'down' | 'left' | 'right';
export type ToastLayout = 'stack' | 'list';

export type ToastData = {
  icon?: ReactNode;
};

export type ToastAddOptions = ToastManagerAddOptions<ToastData>;
export type ToastManagerValue = UseToastManagerReturnValue<ToastData>;
export type ToastUpdateOptions = ToastManagerUpdateOptions<ToastData>;

export type ToastProviderProps = {
  children?: ReactNode;
  limit?: number;
  timeout?: number;
};

export type ToastViewportProps = {
  layout?: ToastLayout;
  swipeDirection?: ToastSwipeDirection | ToastSwipeDirection[];
  viewportLabel?: string;
};

export type ToastProps = ToastProviderProps & ToastViewportProps;
