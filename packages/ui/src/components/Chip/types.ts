import type {
  MouseEventHandler,
  ReactNode,
} from 'react';

export type ChipVariant = 'filled' | 'outlined' | 'soft';

export type ChipColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type ChipSize = 's' | 'm';

export type ChipProps = {
  'aria-label'?: string;
  children?: ReactNode;
  color?: ChipColor;
  disabled?: boolean;
  id?: string;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  size?: ChipSize;
  startIcon?: ReactNode;
  title?: string;
  variant?: ChipVariant;
};
