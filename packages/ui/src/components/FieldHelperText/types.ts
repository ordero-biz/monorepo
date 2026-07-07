import type { ReactNode } from 'react';

export type FieldHelperTextAlign = 'end' | 'start';
export type FieldHelperTextElement = 'field-description' | 'field-error' | 'p';

export type FieldHelperTextProps = {
  align?: FieldHelperTextAlign;
  as?: FieldHelperTextElement;
  children: ReactNode;
  icon?: ReactNode;
  id?: string;
  invalid?: boolean;
  match?: boolean;
};
