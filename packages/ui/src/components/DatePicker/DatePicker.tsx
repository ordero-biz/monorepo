'use client';

import { Field } from '@base-ui/react/field';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { format, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { DayPicker, type Matcher } from 'react-day-picker';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { cn } from '@/ui/lib/utils';
import type {
  DatePickerProps,
  DatePickerRange,
  DatePickerRangeProps,
  DatePickerSingleProps,
} from './types';

const rootWidthClassNames = {
  content: 'inline-flex w-fit min-w-[inherit] max-w-full flex-col',
  full: 'flex w-full min-w-0 flex-col',
} as const;

const triggerClassName =
  'relative flex w-full min-w-0 cursor-pointer items-center justify-between rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textfield-outlined-px)] text-left transition-[box-shadow] disabled:cursor-not-allowed';

const triggerSizeClassNames = {
  m: 'h-[var(--textfield-outlined-md-height)]',
  s: 'h-[var(--textfield-outlined-sm-height)]',
} as const;

const valueClassName =
  'min-w-0 flex-1 truncate text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)]';

const iconClassName =
  'ml-[var(--textfield-select-arrow-mr)] flex shrink-0 items-center justify-center text-[var(--text-secondary)] transition-transform data-[popup-open]:rotate-180 [&_svg]:size-[var(--textfield-select-arrow-icon)]';

const popupClassName =
  'z-50 overflow-hidden rounded-[var(--radius)] border border-[var(--color-grey-16)] bg-[var(--white-main)] p-[var(--menu-list-p)] text-foreground shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)] outline-none';

const calendarClassNames = {
  root: 'p-[var(--space-2)] text-foreground',
  months: 'flex flex-col gap-[var(--space-3)] sm:flex-row',
  month: 'space-y-[var(--space-2)]',
  month_caption:
    'relative flex h-[var(--space-5)] items-center justify-center px-[var(--space-5)]',
  caption_label:
    'relative z-[1] inline-flex items-center gap-[var(--space-0-5)] whitespace-nowrap border-0 text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-[var(--subtitle2-weight)] text-foreground pointer-events-none',
  nav: 'absolute inset-x-[var(--space-2)] top-[var(--space-2)] flex items-center justify-between',
  button_previous:
    'flex size-[var(--space-5)] cursor-pointer items-center justify-center rounded-[var(--radius)] text-[var(--text-secondary)] outline-none transition-[background-color,color] hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40',
  button_next:
    'flex size-[var(--space-5)] cursor-pointer items-center justify-center rounded-[var(--radius)] text-[var(--text-secondary)] outline-none transition-[background-color,color] hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40',
  chevron: 'size-[18px]',
  month_grid: 'w-full border-collapse',
  weekdays: 'grid grid-cols-7',
  weekday:
    'flex size-[36px] items-center justify-center text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-secondary)]',
  week: 'grid grid-cols-7',
  day: 'relative flex size-[36px] items-center justify-center p-0 text-center',
  day_button:
    'flex size-[32px] cursor-pointer items-center justify-center rounded-[var(--radius)] border-0 bg-transparent p-0 text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-foreground outline-none transition-[background-color,color,box-shadow] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40',
  selected:
    '[&>button]:bg-[var(--primary-dark)] [&>button]:text-primary-foreground [&>button]:hover:bg-[var(--primary-darker)]',
  today: '[&>button]:shadow-[inset_0_0_0_1px_var(--primary-dark)]',
  outside: '[&>button]:text-[var(--text-disabled)]',
  disabled: '[&>button]:cursor-not-allowed [&>button]:opacity-40',
  range_start:
    'rounded-l-[var(--radius)] bg-primary-8 [&>button]:bg-[var(--primary-dark)] [&>button]:text-primary-foreground',
  range_middle:
    'bg-primary-8 [&>button]:rounded-none [&>button]:!bg-transparent [&>button]:!text-foreground [&>button]:hover:!bg-[var(--primary-dark)] [&>button]:hover:!text-primary-foreground',
  range_end:
    'rounded-r-[var(--radius)] bg-primary-8 [&>button]:bg-[var(--primary-dark)] [&>button]:text-primary-foreground',
  dropdowns: 'flex w-full items-center justify-between gap-[var(--space-1)]',
  dropdown_root: 'relative inline-flex items-center',
  dropdown:
    'absolute inset-0 z-[2] m-0 w-full cursor-pointer appearance-none border-0 p-0 opacity-0 outline-none',
};

const getDatePickerStateClassName = ({
  active,
  disabled,
  invalid,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'shadow-[inset_0_0_0_1px_var(--color-grey-20)] hover:shadow-[inset_0_0_0_1px_var(--color-grey-20)]';
  }

  if (invalid && active) {
    return 'shadow-[inset_0_0_0_2px_var(--destructive)] hover:shadow-[inset_0_0_0_2px_var(--destructive)]';
  }

  if (invalid) {
    return 'shadow-[inset_0_0_0_1px_var(--destructive)] hover:shadow-[inset_0_0_0_1px_var(--destructive)]';
  }

  if (active) {
    return 'shadow-[inset_0_0_0_2px_var(--foreground)] hover:shadow-[inset_0_0_0_2px_var(--foreground)]';
  }

  return 'shadow-[inset_0_0_0_1px_var(--input)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]';
};

const getValueColorClassName = ({
  disabled,
  hasValue,
}: {
  disabled: boolean;
  hasValue: boolean;
}) => {
  if (disabled) {
    return 'text-[var(--text-disabled)]';
  }

  return hasValue ? 'text-foreground' : 'text-[var(--text-disabled)]';
};

const formatDateInputValue = (date: Date | undefined) =>
  date ? format(date, 'yyyy-MM-dd') : '';

const getDisabledDates = ({
  disabledDates,
  disablePastDates,
}: {
  disabledDates?: Matcher | Matcher[];
  disablePastDates: boolean;
}) => {
  if (!disablePastDates) {
    return disabledDates;
  }

  const pastDatesMatcher = { before: startOfDay(new Date()) };

  if (!disabledDates) {
    return pastDatesMatcher;
  }

  return Array.isArray(disabledDates)
    ? [pastDatesMatcher, ...disabledDates]
    : [pastDatesMatcher, disabledDates];
};

const getDefaultRangeLabel = ({
  displayFormat,
  range,
}: {
  displayFormat: string;
  range: DatePickerRange;
}) => {
  if (range.from && range.to) {
    return `${format(range.from, displayFormat)} - ${format(
      range.to,
      displayFormat
    )}`;
  }

  if (range.from) {
    return format(range.from, displayFormat);
  }

  if (range.to) {
    return format(range.to, displayFormat);
  }

  return undefined;
};

const useOpenState = ({
  defaultOpen,
  onOpenChange,
  open,
}: {
  defaultOpen?: boolean;
  onOpenChange?: DatePickerProps['onOpenChange'];
  open?: boolean;
}) => {
  const [openState, setOpenState] = useState(defaultOpen ?? false);
  const isOpen = open ?? openState;

  const setOpen = (
    nextOpen: boolean,
    details?: Parameters<NonNullable<DatePickerProps['onOpenChange']>>[1]
  ) => {
    setOpenState(nextOpen);

    if (details) {
      onOpenChange?.(nextOpen, details);
    }
  };

  return {
    isOpen,
    setOpen,
  };
};

const DatePickerSingle = (props: DatePickerSingleProps) => {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    captionLayout,
    closeOnSelect = true,
    defaultMonth,
    defaultOpen,
    defaultValue,
    dir,
    disabled = false,
    disabledDates,
    disablePastDates = false,
    disableNavigation,
    displayFormat = 'PPP',
    endMonth,
    errorIcon,
    errorText,
    fixedWeeks = true,
    formatDate,
    helperIcon,
    helperText,
    hideNavigation,
    id,
    invalid = false,
    label,
    locale,
    month,
    name,
    numberOfMonths = 1,
    onBlur,
    onFocus,
    onKeyDown,
    onMonthChange,
    onOpenChange,
    onValueChange,
    open,
    placeholder = 'Pick a date',
    readOnly = false,
    ref,
    required,
    size = 'm',
    startMonth,
    value,
    width = 'full',
  } = props;
  const generatedLabelId = useId();
  const supportTextId = useId();
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const selectedValue = isControlled ? value : uncontrolledValue;
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const labelId = label && !ariaLabel ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const { isOpen, setOpen } = useOpenState({
    defaultOpen,
    onOpenChange,
    open,
  });
  const isActive = focused || isOpen;
  const displayValue = selectedValue
    ? (formatDate?.(selectedValue) ?? format(selectedValue, displayFormat))
    : placeholder;
  const disabledCalendarDates = getDisabledDates({
    disabledDates,
    disablePastDates,
  });

  return (
    <Field.Root
      className={rootWidthClassNames[width]}
      data-slot="date-picker"
      disabled={disabled}
      invalid={invalid}
    >
      {label ? (
        <FieldLabel
          active={isActive}
          disabled={disabled}
          id={labelId}
          invalid={invalid}
          nativeLabel={false}
          required={required}
        >
          {label}
        </FieldLabel>
      ) : null}
      <PopoverPrimitive.Root
        onOpenChange={(nextOpen, details) => {
          setOpen(nextOpen, details);
        }}
        open={isOpen}
      >
        <PopoverPrimitive.Trigger
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-required={required}
          className={cn(
            triggerClassName,
            triggerSizeClassNames[size],
            getDatePickerStateClassName({
              active: isActive,
              disabled,
              invalid,
            })
          )}
          disabled={disabled || readOnly}
          id={id}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onKeyDown={onKeyDown}
          type="button"
        >
          <span
            className={cn(
              valueClassName,
              getValueColorClassName({
                disabled,
                hasValue: Boolean(selectedValue),
              })
            )}
          >
            {displayValue}
          </span>
          <span className={iconClassName}>
            <CalendarIcon aria-hidden="true" />
          </span>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            align="start"
            className="z-50"
            sideOffset={4}
          >
            <PopoverPrimitive.Popup className={popupClassName}>
              <DayPicker
                captionLayout={captionLayout}
                classNames={calendarClassNames}
                defaultMonth={defaultMonth ?? selectedValue}
                dir={dir}
                disabled={disabledCalendarDates}
                disableNavigation={disableNavigation}
                endMonth={endMonth}
                fixedWeeks={fixedWeeks}
                hideNavigation={hideNavigation}
                locale={locale}
                mode="single"
                month={month}
                navLayout="after"
                numberOfMonths={numberOfMonths}
                onMonthChange={onMonthChange}
                onSelect={(nextValue) => {
                  if (!isControlled) {
                    setUncontrolledValue(nextValue);
                  }

                  onValueChange?.(nextValue);

                  if (nextValue && closeOnSelect) {
                    setOpen(false);
                  }
                }}
                selected={selectedValue}
                startMonth={startMonth}
              />
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {name ? (
        <input
          disabled={disabled}
          name={name}
          type="hidden"
          value={formatDateInputValue(selectedValue)}
        />
      ) : null}
      {hasErrorText ? (
        <FieldHelperText
          as="field-error"
          icon={errorIcon}
          id={supportTextId}
          invalid
          match={true}
        >
          {errorText}
        </FieldHelperText>
      ) : null}
      {hasHelperText && !hasErrorText ? (
        <FieldHelperText
          as="field-description"
          icon={helperIcon}
          id={supportTextId}
        >
          {helperText}
        </FieldHelperText>
      ) : null}
    </Field.Root>
  );
};

const DatePickerRangeField = (props: DatePickerRangeProps) => {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    captionLayout,
    closeOnSelect = false,
    defaultMonth,
    defaultOpen,
    defaultValue,
    dir,
    disabled = false,
    disabledDates,
    disablePastDates = false,
    disableNavigation,
    displayFormat = 'LLL dd, y',
    endMonth,
    errorIcon,
    errorText,
    excludeDisabled,
    fixedWeeks = true,
    formatRange,
    fromName,
    helperIcon,
    helperText,
    hideNavigation,
    id,
    invalid = false,
    label,
    locale,
    max,
    min,
    month,
    numberOfMonths = 2,
    onBlur,
    onFocus,
    onKeyDown,
    onMonthChange,
    onOpenChange,
    onValueChange,
    open,
    placeholder = 'Pick a date',
    readOnly = false,
    ref,
    required,
    resetOnSelect,
    size = 'm',
    startMonth,
    toName,
    value,
    width = 'full',
  } = props;
  const generatedLabelId = useId();
  const supportTextId = useId();
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const selectedValue = isControlled ? value : uncontrolledValue;
  const hasSelection = Boolean(selectedValue?.from || selectedValue?.to);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const labelId = label && !ariaLabel ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const { isOpen, setOpen } = useOpenState({
    defaultOpen,
    onOpenChange,
    open,
  });
  const isActive = focused || isOpen;
  const displayValue = selectedValue
    ? (formatRange?.(selectedValue) ??
      getDefaultRangeLabel({ displayFormat, range: selectedValue }) ??
      placeholder)
    : placeholder;
  const disabledCalendarDates = getDisabledDates({
    disabledDates,
    disablePastDates,
  });

  return (
    <Field.Root
      className={rootWidthClassNames[width]}
      data-slot="date-range-picker"
      disabled={disabled}
      invalid={invalid}
    >
      {label ? (
        <FieldLabel
          active={isActive}
          disabled={disabled}
          id={labelId}
          invalid={invalid}
          nativeLabel={false}
          required={required}
        >
          {label}
        </FieldLabel>
      ) : null}
      <PopoverPrimitive.Root
        onOpenChange={(nextOpen, details) => {
          setOpen(nextOpen, details);
        }}
        open={isOpen}
      >
        <PopoverPrimitive.Trigger
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-required={required}
          className={cn(
            triggerClassName,
            triggerSizeClassNames[size],
            getDatePickerStateClassName({
              active: isActive,
              disabled,
              invalid,
            })
          )}
          disabled={disabled || readOnly}
          id={id}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onKeyDown={onKeyDown}
          type="button"
        >
          <span
            className={cn(
              valueClassName,
              getValueColorClassName({
                disabled,
                hasValue: hasSelection,
              })
            )}
          >
            {displayValue}
          </span>
          <span className={iconClassName}>
            <ChevronDown aria-hidden="true" />
          </span>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            align="start"
            className="z-50"
            sideOffset={4}
          >
            <PopoverPrimitive.Popup className={popupClassName}>
              <DayPicker
                captionLayout={captionLayout}
                classNames={calendarClassNames}
                defaultMonth={defaultMonth ?? selectedValue?.from}
                dir={dir}
                disabled={disabledCalendarDates}
                disableNavigation={disableNavigation}
                endMonth={endMonth}
                excludeDisabled={excludeDisabled}
                fixedWeeks={fixedWeeks}
                hideNavigation={hideNavigation}
                locale={locale}
                max={max}
                min={min}
                mode="range"
                month={month}
                navLayout="after"
                numberOfMonths={numberOfMonths}
                onMonthChange={onMonthChange}
                onSelect={(nextValue) => {
                  if (!isControlled) {
                    setUncontrolledValue(nextValue);
                  }

                  onValueChange?.(nextValue);

                  if (nextValue?.from && nextValue.to && closeOnSelect) {
                    setOpen(false);
                  }
                }}
                resetOnSelect={resetOnSelect}
                selected={selectedValue}
                startMonth={startMonth}
              />
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {fromName ? (
        <input
          disabled={disabled}
          name={fromName}
          type="hidden"
          value={formatDateInputValue(selectedValue?.from)}
        />
      ) : null}
      {toName ? (
        <input
          disabled={disabled}
          name={toName}
          type="hidden"
          value={formatDateInputValue(selectedValue?.to)}
        />
      ) : null}
      {hasErrorText ? (
        <FieldHelperText
          as="field-error"
          icon={errorIcon}
          id={supportTextId}
          invalid
          match={true}
        >
          {errorText}
        </FieldHelperText>
      ) : null}
      {hasHelperText && !hasErrorText ? (
        <FieldHelperText
          as="field-description"
          icon={helperIcon}
          id={supportTextId}
        >
          {helperText}
        </FieldHelperText>
      ) : null}
    </Field.Root>
  );
};

export const DatePicker = (props: DatePickerProps) =>
  props.mode === 'range' ? (
    <DatePickerRangeField {...props} />
  ) : (
    <DatePickerSingle {...props} />
  );
