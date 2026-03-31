import type { ComponentProps, ReactNode } from 'react';
import type { Label } from '../Label';

export type FieldProps = ComponentProps<'div'>;

export type FieldSetProps = ComponentProps<'fieldset'>;

export type FieldLegendProps = ComponentProps<'legend'> & {
  variant?: 'legend' | 'label';
};

export type FieldGroupProps = ComponentProps<'div'>;

export type FieldContentProps = ComponentProps<'div'>;

export type FieldLabelProps = ComponentProps<typeof Label>;

export type FieldTitleProps = ComponentProps<'div'>;

export type FieldDescriptionProps = ComponentProps<'p'>;

export type FieldSeparatorProps = ComponentProps<'div'> & {
  children?: ReactNode;
};

export type FieldErrorProps = ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
};
