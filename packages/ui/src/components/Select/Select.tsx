'use client';

import { Field } from '@base-ui/react/field';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDown } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Checkbox } from '@/ui/components/Checkbox';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { dropdownSurfaceClassName } from '@/ui/components/Select';
import { cn } from '@/ui/lib/utils';
import type { SelectProps } from './types';

const triggerClassNames = {
  outlined:
    'relative flex w-full min-w-0 cursor-pointer items-center justify-between rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textfield-outlined-px)] transition-[box-shadow] disabled:cursor-not-allowed',
  filled:
    'relative flex w-full min-w-0 cursor-pointer items-center justify-between rounded-[var(--textfield-filled-radius)] px-[var(--textfield-filled-pl)] pr-[var(--textfield-filled-pr)] transition-[background-color] disabled:cursor-not-allowed',
} as const;

const triggerSizeClassNames = {
  outlined: {
    m: 'h-[var(--textfield-outlined-md-height)]',
    s: 'h-[var(--textfield-outlined-sm-height)]',
  },
  filled: {
    m: 'h-[var(--textfield-md-height)]',
    s: 'h-[var(--textfield-sm-height)]',
  },
} as const;

const rootWidthClassNames = {
  content: 'inline-flex w-fit min-w-[inherit] max-w-full flex-col',
  full: 'flex w-full min-w-0 flex-col',
} as const;

const triggerWidthClassNames = {
  content: 'w-fit min-w-[inherit] max-w-full',
  full: 'w-full',
} as const;

const adornmentClassName =
  'flex shrink-0 items-center justify-center leading-none text-[length:var(--input-value-size-desktop)] font-[var(--input-value-weight)]';

const startAdornmentClassName = 'mr-[var(--textfield-start-adornment-mr)]';

const valueContainerWidthClassNames = {
  content: 'flex min-w-0 items-center',
  full: 'flex min-w-0 flex-1 items-center',
} as const;

const valueTextWidthClassNames = {
  content:
    'whitespace-nowrap text-left text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)]',
  full: 'min-w-0 flex-1 truncate text-left text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)]',
} as const;

const iconClassName =
  'ml-[var(--textfield-select-arrow-mr)] flex shrink-0 items-center justify-center text-[var(--text-secondary)] transition-transform data-[popup-open]:rotate-180 [&_svg]:size-[var(--textfield-select-arrow-icon)]';

const popupClassName = cn(
  'overflow-hidden rounded-[var(--radius)] border border-[var(--color-grey-16)] bg-[var(--white-main)] p-[var(--menu-list-p)] shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)]',
  dropdownSurfaceClassName
);

const listClassName =
  'flex flex-col gap-[var(--menu-list-spacing)] rounded-[calc(var(--radius)-4px)]';

const itemClassName =
  'group/select-item flex h-[36px] w-full cursor-pointer items-center rounded-[var(--radius)] text-left outline-none transition-[background-color,color] data-[highlighted]:bg-[var(--color-grey-8)] data-[selected]:bg-[var(--color-grey-16)]';

const itemPaddingClassNames = {
  outlined: 'px-[10px]',
  filled: 'px-[8px]',
} as const;

const itemWithCheckboxPaddingClassNames = {
  outlined: 'pl-0 pr-[10px]',
  filled: 'pl-0 pr-[8px]',
} as const;

const itemIndicatorClassName =
  'mr-[var(--menu-list-spacing)] flex shrink-0 items-center';

const itemTextClassName =
  'min-w-0 flex-1 truncate text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-primary)] group-data-[selected]/select-item:font-[var(--font-weight-600)]';

const iconSizeClassNames = {
  m: 'size-[20px]',
  s: 'size-[18px]',
} as const;

const getSelectStateClassName = ({
  active,
  disabled,
  invalid,
  variant,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: NonNullable<SelectProps['variant']>;
}) => {
  if (variant === 'filled') {
    if (invalid) {
      return 'bg-[var(--color-error-8)] hover:bg-[var(--color-error-8)]';
    }

    if (active) {
      return 'bg-[var(--color-grey-16)] hover:bg-[var(--color-grey-16)]';
    }

    if (disabled) {
      return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-8)]';
    }

    return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-16)]';
  }

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

const getTextColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-foreground';

const getAdornmentColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-secondary)]';

const renderSelectedText = ({
  optionLabelMap,
  placeholder,
  selectedValue,
}: {
  optionLabelMap: Map<string, SelectProps['options'][number]['label']>;
  placeholder: SelectProps['placeholder'];
  selectedValue: string | string[] | null;
}) => {
  if (Array.isArray(selectedValue)) {
    if (selectedValue.length === 0) {
      return placeholder;
    }

    const [firstValue, ...additionalValues] = selectedValue;
    const firstLabel = optionLabelMap.get(firstValue) ?? firstValue;

    return (
      <>
        {firstLabel}
        {additionalValues.length > 0
          ? ` (+${additionalValues.length} more)`
          : null}
      </>
    );
  }

  if (selectedValue === null) {
    return placeholder;
  }

  return optionLabelMap.get(selectedValue) ?? selectedValue;
};

export const Select = (props: SelectProps) => {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    autoComplete,
    defaultOpen,
    disabled = false,
    errorIcon,
    errorText,
    helperIcon,
    helperText,
    id,
    invalid = false,
    label,
    name,
    onBlur,
    onFocus,
    onKeyDown,
    onOpenChange,
    options,
    placeholder = 'Label',
    readOnly,
    ref,
    required,
    size = 'm',
    startAdornment,
    startIcon: StartIcon,
    variant = 'outlined',
    width = 'full',
  } = props;
  const multiple = props.multiple ?? false;
  const generatedLabelId = useId();
  const supportTextId = useId();
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(defaultOpen ?? false);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const labelId = label && !ariaLabel ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const items = useMemo(
    () =>
      options.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [options]
  );
  const optionLabelMap = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options]
  );
  const isActive = focused || open;
  const selectContent = (
    <>
      <SelectPrimitive.Trigger
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={cn(
          triggerClassNames[variant],
          triggerSizeClassNames[variant][size],
          triggerWidthClassNames[width],
          getSelectStateClassName({
            active: isActive,
            disabled,
            invalid,
            variant,
          })
        )}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onKeyDown={onKeyDown}
        ref={ref}
      >
        <SelectPrimitive.Value
          className={valueContainerWidthClassNames[width]}
          placeholder={placeholder}
        >
          {(selectedValue: string | string[] | null) => (
            <>
              {startAdornment || StartIcon ? (
                <span
                  className={cn(
                    adornmentClassName,
                    startAdornmentClassName,
                    getAdornmentColorClassName({ disabled })
                  )}
                >
                  {startAdornment}
                  {StartIcon ? (
                    <StartIcon
                      className={cn('shrink-0', iconSizeClassNames[size])}
                    />
                  ) : null}
                </span>
              ) : null}
              <span
                className={cn(
                  valueTextWidthClassNames[width],
                  getTextColorClassName({ disabled })
                )}
              >
                {renderSelectedText({
                  optionLabelMap,
                  placeholder,
                  selectedValue,
                })}
              </span>
            </>
          )}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          className={cn(
            iconClassName,
            getAdornmentColorClassName({ disabled })
          )}
        >
          <ChevronDown aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          align="start"
          alignItemWithTrigger={false}
          className="z-50 min-w-[var(--anchor-width)]"
          sideOffset={4}
        >
          <SelectPrimitive.Popup className={popupClassName}>
            <SelectPrimitive.List className={listClassName}>
              {options.map((option) => (
                <SelectPrimitive.Item
                  className={cn(
                    itemClassName,
                    multiple
                      ? itemWithCheckboxPaddingClassNames[variant]
                      : itemPaddingClassNames[variant],
                    option.disabled ? 'cursor-not-allowed opacity-50' : ''
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  value={option.value}
                >
                  {multiple ? (
                    <SelectPrimitive.ItemIndicator
                      className={itemIndicatorClassName}
                      keepMounted={true}
                      render={(indicatorProps, state) => (
                        <span {...indicatorProps}>
                          <Checkbox
                            aria-label={`${option.value} selected`}
                            checked={state.selected}
                            disabled={option.disabled}
                            readOnly={true}
                            size={size}
                            tabIndex={-1}
                          />
                        </span>
                      )}
                    />
                  ) : null}
                  <SelectPrimitive.ItemText className={itemTextClassName}>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </>
  );
  const selectRoot = props.multiple ? (
    <SelectPrimitive.Root<string, true>
      autoComplete={autoComplete}
      defaultOpen={defaultOpen}
      defaultValue={props.defaultValue}
      disabled={disabled}
      id={id}
      items={items}
      multiple={true}
      name={name}
      onOpenChange={(nextOpen, details) => {
        setOpen(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
      onValueChange={props.onValueChange}
      readOnly={readOnly}
      required={required}
      value={props.value}
    >
      {selectContent}
    </SelectPrimitive.Root>
  ) : (
    <SelectPrimitive.Root<string, false>
      autoComplete={autoComplete}
      defaultOpen={defaultOpen}
      defaultValue={props.defaultValue}
      disabled={disabled}
      id={id}
      items={items}
      name={name}
      onOpenChange={(nextOpen, details) => {
        setOpen(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
      onValueChange={props.onValueChange}
      readOnly={readOnly}
      required={required}
      value={props.value}
    >
      {selectContent}
    </SelectPrimitive.Root>
  );

  return (
    <Field.Root
      className={rootWidthClassNames[width]}
      data-slot="select"
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
      {selectRoot}
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
