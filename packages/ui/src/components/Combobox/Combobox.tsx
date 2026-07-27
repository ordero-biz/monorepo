'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import { Check, ChevronDown } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Chip } from '@/ui/components/Chip';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { dropdownSurfaceClassName } from '@/ui/classNames/dropdownSurfaceClassName';
import { cn } from '@/ui/lib/utils';
import type { ComboboxOption, ComboboxProps } from './types';

const inputGroupClassNames = {
  outlined:
    'relative flex w-full min-w-0 cursor-text items-center rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textfield-outlined-px)] transition-[box-shadow] data-[disabled]:cursor-not-allowed',
  filled:
    'relative flex w-full min-w-0 cursor-text items-center rounded-[var(--textfield-filled-radius)] px-[var(--textfield-filled-pl)] pr-[var(--textfield-filled-pr)] transition-[background-color] data-[disabled]:cursor-not-allowed',
} as const;

const inputGroupSizeClassNames = {
  outlined: {
    m: 'min-h-[var(--textfield-outlined-md-height)]',
    s: 'min-h-[var(--textfield-outlined-sm-height)]',
  },
  filled: {
    m: 'min-h-[var(--textfield-md-height)]',
    s: 'min-h-[var(--textfield-sm-height)]',
  },
} as const;

const adornmentClassName =
  'flex shrink-0 items-center justify-center leading-none text-[length:var(--input-value-size-desktop)] font-[var(--input-value-weight)]';

const startAdornmentClassName = 'mr-[var(--textfield-start-adornment-mr)]';

const inputContainerClassName =
  'flex min-w-0 flex-1 flex-wrap items-center gap-[var(--space-0-5)] py-[var(--space-0-5)]';

const inputClassName =
  'h-[var(--input-value-line-height-desktop)] min-w-[8ch] flex-1 border-0 bg-transparent p-0 text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] outline-none placeholder:text-[var(--text-disabled)] disabled:cursor-not-allowed';

const triggerClassName =
  'ml-[var(--textfield-select-arrow-mr)] flex shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] outline-none transition-[color,transform] data-[popup-open]:rotate-180 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed [&_svg]:size-[var(--textfield-select-arrow-icon)]';

const popupClassName = cn(
  'overflow-hidden rounded-[var(--radius)] border border-[var(--color-grey-16)] bg-[var(--white-main)] p-[var(--menu-list-p)] shadow-[var(--dropdown-x1)_var(--dropdown-y1)_var(--dropdown-blur1)_var(--dropdown-spread1)_var(--color-grey-16),var(--dropdown-x2)_var(--dropdown-y2)_var(--dropdown-blur2)_var(--dropdown-spread2)_var(--color-grey-20)]',
  dropdownSurfaceClassName
);

const listClassName =
  'flex max-h-[min(var(--available-height),320px)] flex-col gap-[var(--menu-list-spacing)] overflow-y-auto rounded-[calc(var(--radius)-4px)]';

const itemClassName =
  'group/combobox-item flex h-[36px] w-full cursor-pointer items-center rounded-[var(--radius)] text-left outline-none transition-[background-color,color] hover:bg-[var(--color-grey-8)] data-[highlighted]:bg-[var(--color-grey-8)] data-[selected]:bg-[var(--color-grey-16)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent';

const itemPaddingClassNames = {
  outlined: 'px-[10px]',
  filled: 'px-[8px]',
} as const;

const itemIndicatorClassName =
  'mr-[var(--menu-list-spacing)] flex size-[20px] shrink-0 items-center justify-center opacity-0 transition-opacity data-[selected]:opacity-100 [&_svg]:size-[16px]';

const itemTextClassName =
  'min-w-0 flex-1 truncate text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-primary)] group-data-[selected]/combobox-item:font-[var(--font-weight-600)]';

const statusClassName =
  'px-[8px] py-[var(--space-1)] text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-secondary)]';

const emptyStatusClassName = cn(
  statusClassName,
  'empty:h-0 empty:overflow-hidden empty:p-0'
);

const iconSizeClassNames = {
  m: 'size-[20px]',
  s: 'size-[18px]',
} as const;

const getComboboxStateClassName = ({
  active,
  disabled,
  invalid,
  variant,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: NonNullable<ComboboxProps['variant']>;
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

const getOptionText = (option: ComboboxOption | undefined, value: string) => {
  if (!option) {
    return value;
  }

  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return String(option.label);
  }

  return option.value;
};

export const Combobox = (props: ComboboxProps) => {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    autoComplete,
    autoFocus,
    defaultInputValue,
    defaultOpen,
    disabled = false,
    emptyText = 'No options found',
    endAdornment,
    endIcon: EndIcon,
    errorIcon,
    errorText,
    helperIcon,
    helperText,
    id,
    inputValue,
    invalid = false,
    label,
    listErrorText,
    loading = false,
    loadingMore = false,
    loadingText = 'Loading...',
    name,
    onBlur,
    onFocus,
    onInputValueChange,
    onKeyDown,
    onListScroll,
    onOpenChange,
    open,
    options,
    placeholder,
    readOnly,
    ref,
    required,
    size = 'm',
    startAdornment,
    startIcon: StartIcon,
    variant = 'outlined',
  } = props;
  const multiple = props.multiple ?? false;
  const generatedLabelId = useId();
  const supportTextId = useId();
  const [focused, setFocused] = useState(false);
  const [openState, setOpenState] = useState(defaultOpen ?? false);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const labelId = label && !ariaLabel ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const optionLabelMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  );
  const isOpen = open ?? openState;
  const isActive = focused || isOpen;

  const input = (inputPlaceholder?: string) => (
    <ComboboxPrimitive.Input
      ref={ref}
      aria-describedby={describedBy}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      autoFocus={autoFocus}
      className={cn(inputClassName, getTextColorClassName({ disabled }))}
      disabled={disabled}
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
      placeholder={inputPlaceholder}
    />
  );

  const inputGroupContent = multiple ? (
    <ComboboxPrimitive.Chips className={inputContainerClassName}>
      <ComboboxPrimitive.Value>
        {(selectedValue: string[]) => (
          <>
            {selectedValue.map((selectedItem) => {
              const selectedOption = optionLabelMap.get(selectedItem);
              const selectedLabel = getOptionText(selectedOption, selectedItem);

              return (
                <ComboboxPrimitive.Chip
                  aria-label={selectedLabel}
                  className="contents"
                  key={selectedItem}
                >
                  <ComboboxPrimitive.ChipRemove
                    aria-label={`Remove ${selectedLabel}`}
                    render={(removeProps) => (
                      <Chip
                        aria-label={selectedLabel}
                        disabled={disabled}
                        onDelete={removeProps.onClick}
                        size="s"
                        variant="soft"
                      >
                        {selectedOption?.label ?? selectedItem}
                      </Chip>
                    )}
                  />
                </ComboboxPrimitive.Chip>
              );
            })}
            {input(selectedValue.length > 0 ? '' : placeholder)}
          </>
        )}
      </ComboboxPrimitive.Value>
    </ComboboxPrimitive.Chips>
  ) : (
    <div className={inputContainerClassName}>{input(placeholder)}</div>
  );

  const popupContent = listErrorText ? (
    <div className={cn(statusClassName, 'text-destructive')}>
      {listErrorText}
    </div>
  ) : (
    <>
      <ComboboxPrimitive.Empty className={emptyStatusClassName}>
        {loading ? loadingText : emptyText}
      </ComboboxPrimitive.Empty>
      <ComboboxPrimitive.List className={listClassName} onScroll={onListScroll}>
        {(option: ComboboxOption, index: number) => (
          <ComboboxPrimitive.Item
            className={cn(itemClassName, itemPaddingClassNames[variant])}
            disabled={option.disabled}
            index={index}
            key={option.value}
            value={option.value}
          >
            {multiple ? (
              <ComboboxPrimitive.ItemIndicator
                className={itemIndicatorClassName}
                keepMounted={true}
              >
                <Check aria-hidden="true" />
              </ComboboxPrimitive.ItemIndicator>
            ) : null}
            <span className={itemTextClassName}>{option.label}</span>
          </ComboboxPrimitive.Item>
        )}
      </ComboboxPrimitive.List>
      {loadingMore ? (
        <output className={statusClassName}>{loadingText}</output>
      ) : null}
    </>
  );

  const content = (
    <>
      <ComboboxPrimitive.InputGroup
        className={cn(
          inputGroupClassNames[variant],
          inputGroupSizeClassNames[variant][size],
          getComboboxStateClassName({
            active: isActive,
            disabled,
            invalid,
            variant,
          })
        )}
      >
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
              <StartIcon className={cn('shrink-0', iconSizeClassNames[size])} />
            ) : null}
          </span>
        ) : null}
        {inputGroupContent}
        {endAdornment || EndIcon ? (
          <span
            className={cn(
              adornmentClassName,
              'ml-[8px]',
              getAdornmentColorClassName({ disabled })
            )}
          >
            {endAdornment}
            {EndIcon ? (
              <EndIcon className={cn('shrink-0', iconSizeClassNames[size])} />
            ) : null}
          </span>
        ) : null}
        <ComboboxPrimitive.Trigger
          aria-label="Toggle options"
          className={cn(
            triggerClassName,
            getAdornmentColorClassName({ disabled })
          )}
          disabled={disabled}
        >
          <ChevronDown aria-hidden="true" />
        </ComboboxPrimitive.Trigger>
      </ComboboxPrimitive.InputGroup>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          align="start"
          className="z-50 min-w-[var(--anchor-width)]"
          sideOffset={4}
        >
          <ComboboxPrimitive.Popup className={popupClassName}>
            {popupContent}
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </>
  );

  const root = props.multiple ? (
    <ComboboxPrimitive.Root<string, true>
      autoComplete={autoComplete}
      defaultInputValue={defaultInputValue}
      defaultOpen={defaultOpen}
      defaultValue={props.defaultValue}
      disabled={disabled}
      inputValue={inputValue}
      itemToStringLabel={(itemValue) =>
        getOptionText(optionLabelMap.get(itemValue), itemValue)
      }
      items={options}
      multiple={true}
      name={name}
      onInputValueChange={onInputValueChange}
      onOpenChange={(nextOpen, details) => {
        setOpenState(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
      onValueChange={props.onValueChange}
      open={open}
      readOnly={readOnly}
      required={required}
      value={props.value}
    >
      {content}
    </ComboboxPrimitive.Root>
  ) : (
    <ComboboxPrimitive.Root<string, false>
      autoComplete={autoComplete}
      defaultInputValue={defaultInputValue}
      defaultOpen={defaultOpen}
      defaultValue={props.defaultValue}
      disabled={disabled}
      inputValue={inputValue}
      itemToStringLabel={(itemValue) =>
        getOptionText(optionLabelMap.get(itemValue), itemValue)
      }
      items={options}
      name={name}
      onInputValueChange={onInputValueChange}
      onOpenChange={(nextOpen, details) => {
        setOpenState(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
      onValueChange={props.onValueChange}
      open={open}
      readOnly={readOnly}
      required={required}
      value={props.value}
    >
      {content}
    </ComboboxPrimitive.Root>
  );

  return (
    <Field.Root
      className="flex w-full min-w-0 flex-col"
      data-slot="combobox"
      disabled={disabled}
      invalid={invalid}
    >
      {label ? (
        <FieldLabel
          active={isActive}
          disabled={disabled}
          id={labelId}
          invalid={invalid}
          required={required}
        >
          {label}
        </FieldLabel>
      ) : null}
      {root}
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
