import type { MouseEventHandler, ReactNode } from 'react';

export type CardVariant = 'filled' | 'outlined';

export type CardProps = {
  children?: ReactNode;
  id?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  variant?: CardVariant;
};

export type CardHeaderProps = {
  children?: ReactNode;
  id?: string;
};

export type CardTitleProps = {
  children?: ReactNode;
  id?: string;
};

export type CardDescriptionProps = {
  children?: ReactNode;
  id?: string;
};

export type CardContentProps = {
  children?: ReactNode;
  id?: string;
};

export type CardFooterProps = {
  children?: ReactNode;
  id?: string;
};

export type CardDividerProps = {
  id?: string;
  variant?: 'solid' | 'dashed';
};
