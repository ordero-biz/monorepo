'use client';

import type { InputChangeEventDetails } from '@base-ui/react/input';
import { useEffect, useState } from 'react';
import { TextField } from '@/ui/components/TextField';
import type { NumericFieldProps } from './types';

type SanitizeNumericValueArgs = {
  allowNegative: boolean;
  maxFractionDigits?: number;
  value: string;
};

const getClampedFractionDigits = (maxFractionDigits?: number) => {
  if (maxFractionDigits === undefined) {
    return undefined;
  }

  return Math.max(0, Math.floor(maxFractionDigits));
};

const sanitizeNumericValue = ({
  allowNegative,
  maxFractionDigits,
  value,
}: SanitizeNumericValueArgs) => {
  const clampedFractionDigits = getClampedFractionDigits(maxFractionDigits);
  let sanitizedValue = '';
  let hasDecimalSeparator = false;
  let fractionDigitsCount = 0;

  for (const character of value) {
    if (character >= '0' && character <= '9') {
      if (hasDecimalSeparator) {
        if (
          clampedFractionDigits === undefined ||
          fractionDigitsCount < clampedFractionDigits
        ) {
          sanitizedValue += character;
          fractionDigitsCount += 1;
        }

        continue;
      }

      sanitizedValue += character;
      continue;
    }

    if (
      character === '-' &&
      allowNegative &&
      sanitizedValue.length === 0
    ) {
      sanitizedValue = '-';
      continue;
    }

    if (
      (character === '.' || character === ',') &&
      !hasDecimalSeparator &&
      clampedFractionDigits !== 0
    ) {
      hasDecimalSeparator = true;
      sanitizedValue += '.';
    }
  }

  return sanitizedValue;
};

const getParsedNumericValue = (value: string) => {
  if (value === '' || value === '-' || value === '.' || value === '-.') {
    return undefined;
  }

  if (value.endsWith('.')) {
    return getParsedNumericValue(value.slice(0, -1));
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const normalizeNumericValue = (value: string) => {
  if (value === '' || value === '-' || value === '.' || value === '-.') {
    return '';
  }

  if (value.endsWith('.')) {
    return value.slice(0, -1);
  }

  if (value.startsWith('-.')) {
    return `-0${value.slice(1)}`;
  }

  if (value.startsWith('.')) {
    return `0${value}`;
  }

  return value;
};

const getDisplayValueFromNumber = ({
  allowNegative,
  maxFractionDigits,
  value,
}: {
  allowNegative: boolean;
  maxFractionDigits?: number;
  value?: number;
}) => {
  if (value === undefined) {
    return '';
  }

  return sanitizeNumericValue({
    allowNegative,
    maxFractionDigits,
    value: String(value),
  });
};

export const NumericField = (props: NumericFieldProps) => {
  const isControlled = 'value' in props;
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    allowNegative = false,
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
    maxFractionDigits,
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
    value,
    variant = 'outlined',
  } = props;
  const [inputValue, setInputValue] = useState(() =>
    getDisplayValueFromNumber({
      allowNegative,
      maxFractionDigits,
      value: isControlled ? value : defaultValue,
    })
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    setInputValue(
      getDisplayValueFromNumber({
        allowNegative,
        maxFractionDigits,
        value,
      })
    );
  }, [allowNegative, isControlled, maxFractionDigits, value]);

  const handleValueChange = (
    nextValue: string,
    details: InputChangeEventDetails
  ) => {
    const sanitizedValue = sanitizeNumericValue({
      allowNegative,
      maxFractionDigits,
      value: nextValue,
    });

    if (sanitizedValue === inputValue) {
      return;
    }

    setInputValue(sanitizedValue);
    onValueChange?.(getParsedNumericValue(sanitizedValue), details);
  };

  return (
    <TextField
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={disabled}
      endAdornment={endAdornment}
      endIcon={endIcon}
      errorIcon={errorIcon}
      errorText={errorText}
      helperIcon={helperIcon}
      helperText={helperText}
      id={id}
      inputMode={
        getClampedFractionDigits(maxFractionDigits) === 0 ? 'numeric' : 'decimal'
      }
      invalid={invalid}
      label={label}
      name={name}
      onBlur={(event) => {
        const normalizedValue = normalizeNumericValue(inputValue);

        if (normalizedValue !== inputValue) {
          setInputValue(normalizedValue);
        }

        onBlur?.(event);
      }}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onValueChange={handleValueChange}
      placeholder={placeholder}
      readOnly={readOnly}
      ref={ref}
      required={required}
      size={size}
      startAdornment={startAdornment}
      startIcon={startIcon}
      type="text"
      value={inputValue}
      variant={variant}
    />
  );
};
