'use client';

import { Field } from '@base-ui/react/field';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDown } from 'lucide-react';
import type { CSSProperties } from 'react';
import { forwardRef, useId, useMemo, useState } from 'react';
import { cn } from '@/ui/lib/utils';
import type { SelectProps } from './types';

const triggerClassNames = {
  outlined:
    'relative flex w-full min-w-0 cursor-pointer items-center rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textfield-outlined-px)] shadow-[var(--_select-outline-shadow)] transition-[box-shadow] hover:shadow-[var(--_select-hover-outline-shadow)] disabled:cursor-not-allowed',
  filled:
    'relative flex w-full min-w-0 cursor-pointer items-center rounded-[var(--textfield-filled-radius)] bg-[var(--_select-background)] px-[var(--textfield-filled-pl)] pr-[var(--textfield-filled-pr)] transition-[background-color] hover:bg-[var(--_select-hover-background)] disabled:cursor-not-allowed',
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

const labelClassName =
  'mb-[6px] text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)]';

const helperTextClassName =
  'flex items-start gap-[var(--form-helper-text-spacing)] pl-[var(--form-helper-text-pl)] pt-[var(--form-helper-text-pt)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)]';

const helperIconClassName =
  'mt-px shrink-0 [&_svg]:size-[var(--form-helper-text-icon)]';

const adornmentClassName =
  'flex shrink-0 items-center justify-center leading-none text-[length:var(--input-value-size-desktop)] font-[var(--input-value-weight)]';

const startAdornmentClassName = 'mr-[var(--textfield-start-adornment-mr)]';

const valueContainerClassName = 'flex min-w-0 flex-1 items-center';

const valueTextClassName =
  'min-w-0 flex-1 truncate text-left text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)]';

const iconClassName =
  'ml-[var(--textfield-select-arrow-mr)] flex shrink-0 items-center justify-center text-[var(--text-secondary)] transition-transform data-[popup-open]:rotate-180 [&_svg]:size-[var(--textfield-select-arrow-icon)]';

const popupClassName =
  'overflow-hidden rounded-[var(--radius)] border border-[var(--figma-grey-16)] bg-[var(--figma-white-main)] p-[var(--menu-list-p)] shadow-[0_0_2px_0_var(--figma-grey-16),0_20px_40px_-12px_var(--figma-grey-20)]';

const listClassName =
  'flex flex-col gap-[var(--menu-list-spacing)] rounded-[calc(var(--radius)-4px)]';

const itemClassName =
  'flex h-[36px] w-full cursor-pointer items-center rounded-[var(--radius)] text-left outline-none transition-[background-color,color] data-[highlighted]:bg-[var(--figma-grey-8)] data-[selected]:bg-[var(--figma-grey-16)]';

const itemPaddingClassNames = {
  outlined: 'px-[10px]',
  filled: 'px-[8px]',
} as const;

const itemTextClassName =
  'min-w-0 flex-1 truncate text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-secondary)] data-[selected]:font-[var(--font-weight-600)] data-[selected]:text-foreground';

const iconSizeClassNames = {
  m: 'size-[20px]',
  s: 'size-[18px]',
} as const;

type SelectStyle = CSSProperties & {
  '--_select-background'?: string;
  '--_select-hover-background'?: string;
  '--_select-outline-shadow'?: string;
  '--_select-hover-outline-shadow'?: string;
};

const getLabelColorClassName = ({
  active,
  disabled,
  invalid,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'text-[var(--text-disabled)]';
  }

  if (invalid) {
    return 'text-destructive';
  }

  if (active) {
    return 'text-foreground';
  }

  return 'text-[var(--text-secondary)]';
};

const getSelectStyle = ({
  active,
  disabled,
  invalid,
  variant,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: NonNullable<SelectProps['variant']>;
}): SelectStyle => {
  if (variant === 'filled') {
    if (invalid) {
      return {
        '--_select-background': 'var(--color-error-8)',
        '--_select-hover-background': 'var(--color-error-8)',
      };
    }

    if (active) {
      return {
        '--_select-background': 'var(--color-grey-16)',
        '--_select-hover-background': 'var(--color-grey-16)',
      };
    }

    if (disabled) {
      return {
        '--_select-background': 'var(--color-grey-8)',
        '--_select-hover-background': 'var(--color-grey-8)',
      };
    }

    return {
      '--_select-background': 'var(--color-grey-8)',
      '--_select-hover-background': 'var(--color-grey-16)',
    };
  }

  if (disabled) {
    return {
      '--_select-outline-shadow': 'inset 0 0 0 1px var(--figma-grey-20)',
      '--_select-hover-outline-shadow': 'inset 0 0 0 1px var(--figma-grey-20)',
    };
  }

  if (invalid && active) {
    return {
      '--_select-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
      '--_select-hover-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
    };
  }

  if (invalid) {
    return {
      '--_select-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
      '--_select-hover-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
    };
  }

  if (active) {
    return {
      '--_select-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
      '--_select-hover-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
    };
  }

  return {
    '--_select-outline-shadow': 'inset 0 0 0 1px var(--input)',
    '--_select-hover-outline-shadow': 'inset 0 0 0 1px var(--foreground)',
  };
};

const getTextColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-foreground';

const getAdornmentColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-secondary)]';

const renderSupportText = ({
  icon,
  text,
}: {
  icon?: SelectProps['helperIcon'];
  text: SelectProps['helperText'];
}) => (
  <>
    {icon ? <span className={helperIconClassName}>{icon}</span> : null}
    <span className="min-w-0 flex-1">{text}</span>
  </>
);

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      alignItemWithTrigger = true,
      autoComplete,
      defaultOpen,
      defaultValue,
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
      onValueChange,
      options,
      placeholder = 'Label',
      readOnly,
      required,
      size = 'm',
      startAdornment,
      startIcon: StartIcon,
      value,
      variant = 'outlined',
    },
    ref
  ) => {
    const supportTextId = useId();
    const [focused, setFocused] = useState(false);
    const [open, setOpen] = useState(defaultOpen ?? false);
    const describedBy =
      [
        ariaDescribedBy,
        helperText || (invalid && errorText) ? supportTextId : undefined,
      ]
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

    return (
      <Field.Root
        className="flex w-full min-w-0 flex-col"
        data-slot="select"
        disabled={disabled}
        invalid={invalid}
      >
        {label ? (
          <Field.Label
            className={cn(
              labelClassName,
              getLabelColorClassName({
                active: isActive,
                disabled,
                invalid,
              })
            )}
          >
            {label}
          </Field.Label>
        ) : null}
        <SelectPrimitive.Root
          autoComplete={autoComplete}
          defaultOpen={defaultOpen}
          defaultValue={defaultValue}
          disabled={disabled}
          id={id}
          items={items}
          name={name}
          onOpenChange={(nextOpen, details) => {
            setOpen(nextOpen);
            onOpenChange?.(nextOpen, details);
          }}
          onValueChange={onValueChange}
          readOnly={readOnly}
          required={required}
          value={value}
        >
          <SelectPrimitive.Trigger
            aria-describedby={describedBy}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              triggerClassNames[variant],
              triggerSizeClassNames[variant][size]
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
            style={getSelectStyle({
              active: isActive,
              disabled,
              invalid,
              variant,
            })}
          >
            <SelectPrimitive.Value
              className={valueContainerClassName}
              placeholder={placeholder}
            >
              {(selectedValue: string | null) => (
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
                      valueTextClassName,
                      getTextColorClassName({ disabled })
                    )}
                  >
                    {selectedValue === null
                      ? placeholder
                      : (optionLabelMap.get(selectedValue) ?? selectedValue)}
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
              alignItemWithTrigger={alignItemWithTrigger}
              className="z-50 min-w-[var(--anchor-width)]"
            >
              <SelectPrimitive.Popup className={popupClassName}>
                <SelectPrimitive.List className={listClassName}>
                  {options.map((option) => (
                    <SelectPrimitive.Item
                      className={cn(
                        itemClassName,
                        itemPaddingClassNames[variant],
                        option.disabled ? 'cursor-not-allowed opacity-50' : ''
                      )}
                      disabled={option.disabled}
                      key={option.value}
                      value={option.value}
                    >
                      <SelectPrimitive.ItemText className={itemTextClassName}>
                        {option.label}
                      </SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {invalid && errorText ? (
          <Field.Error
            className={cn(helperTextClassName, 'text-destructive')}
            id={supportTextId}
            match={true}
          >
            {renderSupportText({
              icon: errorIcon,
              text: errorText,
            })}
          </Field.Error>
        ) : null}
        {!invalid && helperText ? (
          <Field.Description
            className={cn(helperTextClassName, 'text-text-secondary')}
            id={supportTextId}
          >
            {renderSupportText({
              icon: helperIcon,
              text: helperText,
            })}
          </Field.Description>
        ) : null}
      </Field.Root>
    );
  }
);

Select.displayName = 'Select';
