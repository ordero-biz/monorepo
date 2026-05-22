import type { MouseEventHandler, ReactNode, Ref } from 'react';

export type CardVariant = 'filled' | 'outlined';

export type CardProps = {
  children?: ReactNode;
  id?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  ref?: Ref<HTMLDivElement>;
  variant?: CardVariant;
};

export type CardHeaderProps = {
  children?: ReactNode;
  id?: string;
  ref?: Ref<HTMLElement>;
};

export type CardTitleProps = {
  children?: ReactNode;
  id?: string;
  ref?: Ref<HTMLHeadingElement>;
};

export type CardDescriptionProps = {
  children?: ReactNode;
  id?: string;
  ref?: Ref<HTMLParagraphElement>;
};

export type CardContentProps = {
  children?: ReactNode;
  id?: string;
  ref?: Ref<HTMLDivElement>;
};

export type CardFooterProps = {
  children?: ReactNode;
  id?: string;
  ref?: Ref<HTMLElement>;
};

export type CardDividerProps = {
  id?: string;
  ref?: Ref<HTMLHRElement>;
  variant?: 'solid' | 'dashed';
};
