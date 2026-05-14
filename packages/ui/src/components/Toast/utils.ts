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

const getTextLabel = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : undefined;

export const getToastAccessibleName = (title: unknown, description: unknown) =>
  getTextLabel(title) ?? getTextLabel(description);

export const isVisibleToast = (toast: {
  limited?: boolean;
  transitionStatus?: string;
}) => !toast.limited && toast.transitionStatus !== 'ending';
