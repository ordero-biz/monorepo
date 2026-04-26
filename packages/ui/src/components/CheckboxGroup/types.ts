import type { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import type { ReactNode } from 'react';

export type CheckboxGroupOrientation = 'horizontal' | 'vertical';

type CheckboxGroupCommonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children: ReactNode;
  disabled?: boolean;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  invalid?: boolean;
  label?: ReactNode;
  name?: string;
  onValueChange?: (
    value: string[],
    details: CheckboxGroupPrimitive.ChangeEventDetails
  ) => void;
  orientation?: CheckboxGroupOrientation;
};

type CheckboxGroupStandardProps = CheckboxGroupCommonProps & {
  allValues?: never;
  defaultValue?: string[];
  value?: string[];
};

type CheckboxGroupParentProps = Omit<
  CheckboxGroupCommonProps,
  'onValueChange'
> & {
  allValues: string[];
  defaultValue?: never;
  onValueChange: (
    value: string[],
    details: CheckboxGroupPrimitive.ChangeEventDetails
  ) => void;
  value: string[];
};

export type CheckboxGroupProps =
  | CheckboxGroupStandardProps
  | CheckboxGroupParentProps;
