import type { ToastVariant } from './types';

export const getToastVariant = (type: string | undefined): ToastVariant => {
  if (
    type === 'default' ||
    type === 'info' ||
    type === 'success' ||
    type === 'warning' ||
    type === 'error'
  ) {
    return type;
  }

  return 'default';
};

export const getToastAccessibleName = (title: unknown) =>
  typeof title === 'string' && title.trim() ? title : 'Notification';

export const isVisibleToast = (toast: {
  limited?: boolean;
  transitionStatus?: string;
}) => !toast.limited && toast.transitionStatus !== 'ending';
