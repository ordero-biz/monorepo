import type { InputChangeEventDetails } from '@base-ui/react/input';
import type { TextFieldProps } from '@/ui/components/TextField';

export type NumericFieldProps = Omit<
  TextFieldProps,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  allowNegative?: boolean;
  defaultValue?: number;
  maxFractionDigits?: number;
  onValueChange?: (
    value: number | undefined,
    details: InputChangeEventDetails
  ) => void;
  value?: number;
};
