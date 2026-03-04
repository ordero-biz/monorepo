import type { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './constants';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ButtonPrimitive.Props & ButtonVariantProps;
