import type { ReactNode } from 'react';
import type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from '../Button';
import type {
  MenuItemProps,
  MenuPopupProps,
  MenuPositionerProps,
} from '../Menu';

export type SplitButtonRootProps = {
  'aria-label': string;
  children: ReactNode;
  color?: ButtonColor;
  defaultOpen?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export type SplitButtonActionProps = Pick<
  ButtonProps,
  | 'aria-describedby'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'disabled'
  | 'endIcon'
  | 'form'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onClick'
  | 'onFocus'
  | 'onKeyDown'
  | 'ref'
  | 'startIcon'
  | 'title'
  | 'type'
>;

export type SplitButtonTriggerProps = {
  'aria-label': string;
  disabled?: boolean;
  id?: string;
  title?: string;
};

export type SplitButtonContentProps = {
  align?: MenuPositionerProps['align'];
  children: ReactNode;
  id?: string;
  maxHeight?: MenuPopupProps['maxHeight'];
  side?: MenuPositionerProps['side'];
  sideOffset?: number;
};

export type SplitButtonItemProps = MenuItemProps;

export type SplitButtonContextValue = Required<
  Pick<
    SplitButtonRootProps,
    'color' | 'disabled' | 'fullWidth' | 'size' | 'variant'
  >
>;
