import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '../Button';
import type { IconButtonSize } from '../IconButton';

export type MenuAlign = 'start' | 'center' | 'end';
export type MenuSide = 'top' | 'right' | 'bottom' | 'left';
export type MenuTriggerAppearance = 'button' | 'iconButton';
export type MenuItemColor = ButtonColor;

export type MenuRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type MenuTriggerCommonProps = {
  'aria-label'?: string;
  children?: ReactNode;
  color?: ButtonColor;
  disabled?: boolean;
  endIcon?: ReactNode;
  id?: string;
  startIcon?: ReactNode;
  title?: string;
  variant?: ButtonVariant;
};

export type MenuTriggerProps =
  | (MenuTriggerCommonProps & {
      appearance?: 'button';
      size?: ButtonSize;
    })
  | (MenuTriggerCommonProps & {
      appearance: 'iconButton';
      size?: IconButtonSize;
    });

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
  color?: MenuItemColor;
  disabled?: boolean;
  id?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};
