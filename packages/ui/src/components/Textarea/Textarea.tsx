'use client';

import { Field } from '@base-ui/react/field';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { cn } from '@/ui/lib/utils';
import type { TextareaProps, TextareaResize } from './types';

const textareaRootClassName = 'flex w-full min-w-0 flex-col';

const textareaFrameClassNames = {
  outlined:
    'relative flex w-full min-w-0 rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textarea-outlined-px)] py-[var(--textarea-outlined-py)] transition-[box-shadow]',
  filled:
    'relative flex w-full min-w-0 rounded-[var(--textfield-filled-radius)] px-[var(--textarea-filled-px)] py-[var(--textarea-filled-py)] transition-[background-color]',
} as const;

const textareaClassName =
  'min-h-[var(--textarea-min-height)] w-full min-w-0 border-0 bg-transparent p-0 text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] outline-none placeholder:text-[var(--text-disabled)] disabled:cursor-not-allowed';

const resizeClassNames: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
};

const getFilledFrameStateClassName = ({
  disabled,
  focused,
  invalid,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
}) => {
  if (invalid) {
    return 'bg-[var(--color-error-8)] hover:bg-[var(--color-error-8)]';
  }

  if (focused) {
    return 'bg-[var(--color-grey-16)] hover:bg-[var(--color-grey-16)]';
  }

  if (disabled) {
    return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-8)]';
  }

  return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-16)]';
};

const getOutlinedFrameStateClassName = ({
  disabled,
  focused,
  invalid,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'shadow-[inset_0_0_0_1px_var(--color-grey-20)] hover:shadow-[inset_0_0_0_1px_var(--color-grey-20)]';
  }

  if (invalid && focused) {
    return 'shadow-[inset_0_0_0_2px_var(--destructive)] hover:shadow-[inset_0_0_0_2px_var(--destructive)]';
  }

  if (invalid) {
    return 'shadow-[inset_0_0_0_1px_var(--destructive)] hover:shadow-[inset_0_0_0_1px_var(--destructive)]';
  }

  if (focused) {
    return 'shadow-[inset_0_0_0_2px_var(--foreground)] hover:shadow-[inset_0_0_0_2px_var(--foreground)]';
  }

  return 'shadow-[inset_0_0_0_1px_var(--input)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]';
};

const getTextareaFrameStateClassName = ({
  disabled,
  focused,
  invalid,
  variant,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
  variant: NonNullable<TextareaProps['variant']>;
}) => {
  if (variant === 'filled') {
    return getFilledFrameStateClassName({ disabled, focused, invalid });
  }

  return getOutlinedFrameStateClassName({ disabled, focused, invalid });
};

const getTextareaTextColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-foreground';

export const Textarea = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoComplete,
  autoFocus,
  defaultValue,
  disabled = false,
  errorIcon,
  errorText,
  focused,
  helperIcon,
  helperText,
  id,
  invalid = false,
  label,
  maxLength,
  minLength,
  name,
  onBlur,
  onFocus,
  onKeyDown,
  onValueChange,
  placeholder,
  readOnly,
  ref,
  required,
  resize = 'vertical',
  rows,
  spellCheck,
  value,
  variant = 'outlined',
}: TextareaProps) => {
  const supportTextId = useId();
  const generatedTextareaId = useId();
  const [focusedState, setFocusedState] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isFocused = focused ?? focusedState;
  const textareaId = id ?? (label ? generatedTextareaId : undefined);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  useEffect(() => {
    if (focused !== undefined) {
      setFocusedState(focused);
    }
  }, [focused]);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <Field.Root
      className={textareaRootClassName}
      data-slot="textarea-field"
      disabled={disabled}
      invalid={invalid}
    >
      {label ? (
        <FieldLabel
          active={isFocused}
          as="label"
          disabled={disabled}
          htmlFor={textareaId}
          invalid={invalid}
          required={required}
        >
          {label}
        </FieldLabel>
      ) : null}
      <div
        className={cn(
          textareaFrameClassNames[variant],
          getTextareaFrameStateClassName({
            disabled,
            focused: isFocused,
            invalid,
            variant,
          })
        )}
        data-slot="textarea"
      >
        <textarea
          ref={setTextareaRef}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          autoComplete={autoComplete}
          className={cn(
            textareaClassName,
            resizeClassNames[resize],
            getTextareaTextColorClassName({ disabled })
          )}
          defaultValue={defaultValue}
          disabled={disabled}
          id={textareaId}
          maxLength={maxLength}
          minLength={minLength}
          name={name}
          onBlur={(event) => {
            setFocusedState(false);
            onBlur?.(event);
          }}
          onChange={(event) => {
            onValueChange?.(event.currentTarget.value, { event });
          }}
          onFocus={(event) => {
            setFocusedState(true);
            onFocus?.(event);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          rows={rows}
          spellCheck={spellCheck}
          value={value}
        />
      </div>
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
