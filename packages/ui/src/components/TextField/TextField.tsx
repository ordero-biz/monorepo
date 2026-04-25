'use client';

import { Field } from '@base-ui/react/field';
import { cva } from 'class-variance-authority';
import { forwardRef, useId, useState } from 'react';
import { Input } from '@/ui/components/Input';
import { cn } from '@/ui/lib/utils';
import type { TextFieldProps } from './types';

const textFieldRootVariants = cva('flex w-full min-w-0 flex-col', {
  variants: {
    size: {
      m: '',
      s: '',
    },
    variant: {
      outlined: '',
      filled: '',
    },
  },
  defaultVariants: {
    size: 'm',
    variant: 'outlined',
  },
});

const labelClassName =
  'mb-[6px] text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)]';

const helperTextClassName =
  'flex items-start gap-[var(--form-helper-text-spacing)] pl-[var(--form-helper-text-pl)] pt-[var(--form-helper-text-pt)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)]';

const helperIconClassName =
  'mt-px shrink-0 [&_svg]:size-[var(--form-helper-text-icon)]';

const getLabelColorClassName = ({
  disabled,
  focused,
  invalid,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'text-[var(--text-disabled)]';
  }

  if (invalid) {
    return 'text-destructive';
  }

  if (focused) {
    return 'text-foreground';
  }

  return 'text-[var(--text-secondary)]';
};

const renderSupportText = ({
  icon,
  text,
}: {
  icon?: TextFieldProps['helperIcon'];
  text: TextFieldProps['helperText'];
}) => (
  <>
    {icon ? <span className={helperIconClassName}>{icon}</span> : null}
    <span className="min-w-0 flex-1">{text}</span>
  </>
);

export const TextField = forwardRef<HTMLElement, TextFieldProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      autoComplete,
      autoFocus,
      defaultValue,
      disabled = false,
      endAdornment,
      endIcon,
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
      onValueChange,
      placeholder,
      readOnly,
      required,
      size = 'm',
      startAdornment,
      startIcon,
      type = 'text',
      value,
      variant = 'outlined',
    },
    ref
  ) => {
    const supportTextId = useId();
    const [focusedState, setFocusedState] = useState(false);
    const describedBy =
      [
        ariaDescribedBy,
        helperText || (invalid && errorText) ? supportTextId : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <Field.Root
        className={cn(textFieldRootVariants({ size, variant }))}
        data-slot="text-field"
        disabled={disabled}
        invalid={invalid}
      >
        {label ? (
          <Field.Label
            className={cn(
              labelClassName,
              getLabelColorClassName({
                disabled,
                focused: focusedState,
                invalid,
              })
            )}
          >
            {label}
          </Field.Label>
        ) : null}
        <Input
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          disabled={disabled}
          endAdornment={endAdornment}
          endIcon={endIcon}
          focused={focusedState}
          id={id}
          invalid={invalid}
          name={name}
          onBlur={(event) => {
            setFocusedState(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocusedState(true);
            onFocus?.(event);
          }}
          onKeyDown={onKeyDown}
          onValueChange={onValueChange}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={ref}
          required={required}
          size={size}
          startAdornment={startAdornment}
          startIcon={startIcon}
          type={type}
          value={value}
          variant={variant}
        />
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

TextField.displayName = 'TextField';
