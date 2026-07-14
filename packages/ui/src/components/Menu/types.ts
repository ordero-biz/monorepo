import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '../Button';

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuSide = 'top' | 'right' | 'bottom' | 'left';
export type MenuTriggerAppearance = 'button' | 'iconButton';

export type MenuRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export type MenuTriggerProps = {
  'aria-label'?: string;
  appearance?: MenuTriggerAppearance;
  children?: ReactNode;
  color?: ButtonColor;
  disabled?: boolean;
  endIcon?: ReactNode;
  id?: string;
  size?: ButtonSize;
  startIcon?: ReactNode;
  title?: string;
  variant?: ButtonVariant;
};

export type MenuPortalProps = {
  children?: ReactNode;
};

export type MenuPositionerProps = {
  align?: MenuAlign;
  children?: ReactNode;
  side?: MenuSide;
  sideOffset?: number;
};

export type MenuPopupProps = {
  children?: ReactNode;
  id?: string;
  maxHeight?: CSSProperties['maxHeight'];
};

export type MenuItemProps = {
  children?: ReactNode;
  closeOnClick?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};
