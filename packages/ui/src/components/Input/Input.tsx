'use client';

import {
  type InputChangeEventDetails,
  Input as InputPrimitive,
} from '@base-ui/react/input';
import { useEffect, useState } from 'react';
import { getInputClassName, InputFrame } from './InputFrame';
import type { InputProps } from './types';

export const Input = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoComplete,
  autoFocus,
  defaultValue,
  disabled = false,
  endAdornment,
  endIcon,
  focused,
  id,
  inputMode,
  invalid = false,
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
}: InputProps) => {
  const [focusedState, setFocusedState] = useState(false);
  const isFocused = focused ?? focusedState;

  useEffect(() => {
    if (focused !== undefined) {
      setFocusedState(focused);
    }
  }, [focused]);

  return (
    <InputFrame
      disabled={disabled}
      endAdornment={endAdornment}
      endIcon={endIcon}
      focused={isFocused}
      invalid={invalid}
      size={size}
      startAdornment={startAdornment}
      startIcon={startIcon}
      variant={variant}
    >
      <InputPrimitive
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={getInputClassName(disabled)}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        inputMode={inputMode}
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
        onValueChange={(
          nextValue: string,
          details: InputChangeEventDetails
        ) => {
          onValueChange?.(nextValue, details);
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        type={type}
        value={value}
      />
    </InputFrame>
  );
};
