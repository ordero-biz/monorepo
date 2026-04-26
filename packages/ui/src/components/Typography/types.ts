import type { ReactNode } from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export type TypographyColor =
  | 'text-primary'
  | 'text-secondary'
  | 'text-disabled'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type TypographyProps = {
  children: ReactNode;
  color?: TypographyColor;
  id?: string;
  variant?: TypographyVariant;
};
