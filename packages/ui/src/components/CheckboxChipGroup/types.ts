import type { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import type { ReactNode, Ref } from 'react';

export type CheckboxChipGroupOrientation = 'horizontal' | 'vertical';

type CheckboxChipGroupCommonProps = {
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
  orientation?: CheckboxChipGroupOrientation;
  ref?: Ref<HTMLDivElement>;
};

type CheckboxChipGroupStandardProps = CheckboxChipGroupCommonProps & {
  allValues?: never;
  defaultValue?: string[];
  value?: string[];
};

type CheckboxChipGroupParentProps = Omit<
  CheckboxChipGroupCommonProps,
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

export type CheckboxChipGroupProps =
  | CheckboxChipGroupStandardProps
  | CheckboxChipGroupParentProps;
