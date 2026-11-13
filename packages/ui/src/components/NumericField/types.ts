import type { NumberField } from '@base-ui/react/number-field';
import type { TextFieldProps } from '@/ui/components/TextField';

export type NumericFieldProps = Omit<
  TextFieldProps,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  allowNegative?: boolean;
  defaultValue?: number;
  /** BCP 47 locale for numeric display and editing. Defaults to the surrounding language. */
  locale?: string;
  /** Maximum fractional digits used by Base UI for formatting and rounding. Defaults to 20. */
  maxFractionDigits?: number;
  onValueChange?: (
    value: number | undefined,
    details: NumberField.Root.ChangeEventDetails
  ) => void;
  value?: number;
};
