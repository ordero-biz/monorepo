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

export type ToastAddOptions = Omit<
  ToastManagerAddOptions<ToastData>,
  'type'
> & {
  type?: ToastVariant;
};

export type ToastUpdateOptions = Omit<
  ToastManagerUpdateOptions<ToastData>,
  'type'
> & {
  type?: ToastVariant;
};

export type ToastPromiseOptions<Value> = {
  loading: string | ToastUpdateOptions;
  success:
    | string
    | ToastUpdateOptions
    | ((result: Value) => string | ToastUpdateOptions);
  error:
    | string
    | ToastUpdateOptions
    | ((error: unknown) => string | ToastUpdateOptions);
};

export type ToastManagerValue = Omit<
  UseToastManagerReturnValue<ToastData>,
  'add' | 'promise' | 'update'
> & {
  add: (options: ToastAddOptions) => string;
  update: (toastId: string, options: ToastUpdateOptions) => void;
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>
  ) => Promise<Value>;
};

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
