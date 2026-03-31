import type { Label } from '../Label';

export type FieldProps = React.ComponentProps<'div'>;

export type FieldSetProps = React.ComponentProps<'fieldset'>;

export type FieldLegendProps = React.ComponentProps<'legend'> & {
  variant?: 'legend' | 'label';
};

export type FieldGroupProps = React.ComponentProps<'div'>;

export type FieldContentProps = React.ComponentProps<'div'>;

export type FieldLabelProps = React.ComponentProps<typeof Label>;

export type FieldTitleProps = React.ComponentProps<'div'>;

export type FieldDescriptionProps = React.ComponentProps<'p'>;

export type FieldSeparatorProps = React.ComponentProps<'div'> & {
  children?: React.ReactNode;
};

export type FieldErrorProps = React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
};
