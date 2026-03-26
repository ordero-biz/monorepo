import type { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './constants';
import type { ButtonAppearance, ButtonColor } from './resolve-button-style';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** Public `variant`: Minimal appearances or legacy shadcn names (see `resolveButtonStyle`). */
export type ButtonVariantProp =
  | ButtonAppearance
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'dark';

type ButtonCvaProps = Omit<ButtonVariantProps, 'appearance' | 'color'>;

export type ButtonProps = ButtonPrimitive.Props &
  ButtonCvaProps & {
    variant?: ButtonVariantProp;
    color?: ButtonColor;
  };
