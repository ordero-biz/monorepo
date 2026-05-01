import type { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import type { ReactNode, Ref } from 'react';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export type RadioGroupProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children: ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
  label?: ReactNode;
  name?: string;
  onValueChange?: (
    value: string,
    details: RadioGroupPrimitive.ChangeEventDetails
  ) => void;
  orientation?: RadioGroupOrientation;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
};
