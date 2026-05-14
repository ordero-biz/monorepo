import type { ReactNode } from 'react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '../Button';

export type DialogPopupSize = 'xs' | 'sm' | 'md';

export type DialogRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  modal?: boolean | 'trap-focus';
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export type DialogTriggerProps = {
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  title?: string;
};

export type DialogPortalProps = {
  children?: ReactNode;
};

export type DialogBackdropProps = {
  id?: string;
};

export type DialogViewportProps = {
  children?: ReactNode;
};

export type DialogPopupProps = {
  children?: ReactNode;
  fullscreen?: boolean;
  id?: string;
  size?: DialogPopupSize;
};

export type DialogContentProps = {
  children?: ReactNode;
  id?: string;
  scrollable?: boolean;
};

export type DialogTitleProps = {
  children?: ReactNode;
  id?: string;
};

export type DialogDescriptionProps = {
  children?: ReactNode;
  id?: string;
};

export type DialogHeaderProps = {
  children?: ReactNode;
};

export type DialogFooterProps = {
  children?: ReactNode;
  closeButtonColor?: ButtonColor;
  closeButtonLabel?: string;
  closeButtonSize?: ButtonSize;
  closeButtonVariant?: ButtonVariant;
  closeDisabled?: boolean;
  hideCloseButton?: boolean;
};

export type DialogCloseProps = {
  children?: ReactNode;
  color?: ButtonColor;
  disabled?: boolean;
  id?: string;
  size?: ButtonSize;
  title?: string;
  variant?: ButtonVariant;
};
