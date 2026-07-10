'use client';

import { Field } from '@base-ui/react/field';
import { cva } from 'class-variance-authority';
import { useId, useState } from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
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

export const TextField = ({
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
  ref,
  required,
  size = 'm',
  startAdornment,
  startIcon,
  type = 'text',
  value,
  variant = 'outlined',
}: TextFieldProps) => {
  const supportTextId = useId();
  const [focusedState, setFocusedState] = useState(false);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
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
        <FieldLabel
          active={focusedState}
          disabled={disabled}
          invalid={invalid}
          required={required}
        >
          {label}
        </FieldLabel>
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
