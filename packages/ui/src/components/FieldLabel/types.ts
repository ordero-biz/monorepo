import type { ReactNode } from 'react';

export type FieldLabelElement = 'div' | 'field-label' | 'label' | 'span';

export type FieldLabelProps = {
  active?: boolean;
  as?: FieldLabelElement;
  children: ReactNode;
  disabled?: boolean;
  htmlFor?: string;
  id?: string;
  invalid?: boolean;
  nativeLabel?: boolean;
  required?: boolean;
};
