import type { PopoverRoot } from '@base-ui/react/popover';
import type {
  DayPickerProps,
  DateRange,
  Matcher,
  MonthChangeEventHandler,
} from 'react-day-picker';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  Ref,
} from 'react';
import type { InputSize } from '@/ui/components/Input';

export type DatePickerSize = InputSize;
export type DatePickerWidth = 'content' | 'full';
export type DatePickerMode = 'single' | 'range';
export type DatePickerRange = DateRange;

type DatePickerCommonProps = {
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  captionLayout?: DayPickerProps['captionLayout'];
  closeOnSelect?: boolean;
  defaultMonth?: Date;
  defaultOpen?: boolean;
  dir?: DayPickerProps['dir'];
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  disablePastDates?: boolean;
  disableNavigation?: boolean;
  endMonth?: Date;
  errorIcon?: ReactNode;
  errorText?: ReactNode;
  fixedWeeks?: boolean;
  helperIcon?: ReactNode;
  helperText?: ReactNode;
  hideNavigation?: boolean;
  id?: string;
  invalid?: boolean;
  label?: ReactNode;
  locale?: DayPickerProps['locale'];
  month?: Date;
  numberOfMonths?: number;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onMonthChange?: MonthChangeEventHandler;
  onOpenChange?: (
    open: boolean,
    details: PopoverRoot.ChangeEventDetails
  ) => void;
  open?: boolean;
  placeholder?: ReactNode;
  readOnly?: boolean;
  ref?: Ref<HTMLButtonElement>;
  required?: boolean;
  size?: DatePickerSize;
  startMonth?: Date;
  width?: DatePickerWidth;
};

export type DatePickerSingleProps = DatePickerCommonProps & {
  defaultValue?: Date;
  displayFormat?: string;
  formatDate?: (date: Date) => ReactNode;
  mode?: 'single';
  name?: string;
  onValueChange?: (value: Date | undefined) => void;
  value?: Date;
};

export type DatePickerRangeProps = DatePickerCommonProps & {
  defaultValue?: DateRange;
  displayFormat?: string;
  excludeDisabled?: boolean;
  formatRange?: (range: DateRange) => ReactNode;
  fromName?: string;
  max?: number;
  min?: number;
  mode: 'range';
  onValueChange?: (value: DateRange | undefined) => void;
  resetOnSelect?: boolean;
  toName?: string;
  value?: DateRange;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
