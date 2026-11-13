'use client';

import { Field } from '@base-ui/react/field';
import { NumberField } from '@base-ui/react/number-field';
import {
  type ClipboardEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { getInputClassName, InputFrame } from '@/ui/components/Input';
import { localizeNumberPaste } from './localizeNumberPaste';
import type { NumericFieldProps } from './types';

const baseUiFractionLimit = 20;

const getSupportedValue = (
  value: number | undefined,
  allowNegative: boolean
) =>
  value !== undefined && Number.isFinite(value) && (allowNegative || value >= 0)
    ? value
    : undefined;

export const NumericField = (props: NumericFieldProps) => {
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
    inputMode,
    invalid = false,
    label,
    locale,
    maxFractionDigits = baseUiFractionLimit,
    name,
    onBlur,
    onFocus,
    onKeyDown,
    onValueChange,
    placeholder,
    readOnly,
    ref,
    required,
    size,
    startAdornment,
    startIcon,
    value,
    variant,
  } = props;
  const fieldRef = useRef<HTMLDivElement>(null);
  const supportTextId = useId();
  const pasteMessageId = useId();
  const [focused, setFocused] = useState(false);
  const [documentLanguage, setDocumentLanguage] = useState('en');
  const [pasteMessage, setPasteMessage] = useState('');
  const fieldLocale = locale ?? documentLanguage;
  const fractionDigits = Number.isNaN(maxFractionDigits)
    ? baseUiFractionLimit
    : Math.min(baseUiFractionLimit, Math.max(0, Math.floor(maxFractionDigits)));
  const hasErrorText = Boolean(invalid && errorText);
  const describedBy =
    [
      ariaDescribedBy,
      hasErrorText || helperText ? supportTextId : undefined,
      pasteMessage ? pasteMessageId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  useLayoutEffect(() => {
    const language = fieldRef.current?.closest('[lang]')?.getAttribute('lang');
    if (language) {
      try {
        setDocumentLanguage(Intl.getCanonicalLocales(language)[0] ?? 'en');
      } catch {
        // An invalid HTML language tag leaves the default in place.
      }
    }
  }, []);

  const setInputRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (typeof ref === 'function') {
        return ref(input);
      }
      if (ref) {
        ref.current = input;
      }
    },
    [ref]
  );

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    const text = event.clipboardData.getData('text/plain');
    const result = localizeNumberPaste(text, fieldLocale);
    if ('reason' in result) {
      event.preventDefault();
      const example = new Intl.NumberFormat(fieldLocale, {
        maximumFractionDigits: fractionDigits,
      }).format(fractionDigits === 0 ? 1234 : 1234.56);
      const reason =
        result.reason === 'ambiguous'
          ? 'The pasted number could have more than one value.'
          : 'The pasted text uses an unsupported number format.';
      setPasteMessage(`${reason} Enter a number like ${example}.`);
      return;
    }

    setPasteMessage('');
    const localizedText = result.text;
    if (localizedText === text) {
      return;
    }

    event.preventDefault();
    const input = event.currentTarget;

    // Send the translated text through Base UI's usual input handling.
    input.setRangeText(localizedText, 0, input.value.length, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <Field.Root
      className="flex w-full min-w-0 flex-col"
      disabled={disabled}
      invalid={invalid}
    >
      {label && (
        <FieldLabel
          active={focused}
          disabled={disabled}
          invalid={invalid}
          required={required}
        >
          {label}
        </FieldLabel>
      )}
      <NumberField.Root
        className="min-w-0"
        defaultValue={getSupportedValue(defaultValue, allowNegative)}
        format={{ maximumFractionDigits: fractionDigits }}
        id={id}
        locale={fieldLocale}
        min={allowNegative ? undefined : 0}
        name={name}
        onValueChange={(nextValue, details) => {
          if (
            details.reason === 'input-change' ||
            details.reason === 'keyboard' ||
            (details.reason === 'input-clear' && details.event.type === 'input')
          ) {
            setPasteMessage('');
          }
          onValueChange?.(nextValue ?? undefined, details);
        }}
        readOnly={readOnly}
        ref={fieldRef}
        required={required}
        step="any"
        value={
          'value' in props
            ? (getSupportedValue(value, allowNegative) ?? null)
            : undefined
        }
      >
        <InputFrame
          disabled={disabled}
          endAdornment={endAdornment}
          endIcon={endIcon}
          focused={focused}
          invalid={invalid}
          size={size}
          startAdornment={startAdornment}
          startIcon={startIcon}
          variant={variant}
        >
          <NumberField.Input
            aria-describedby={describedBy}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            autoComplete={autoComplete ?? 'off'}
            autoFocus={autoFocus}
            className={getInputClassName(disabled)}
            inputMode={
              inputMode ?? (fractionDigits === 0 ? 'numeric' : 'decimal')
            }
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onKeyDown={onKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            ref={setInputRef}
          />
        </InputFrame>
      </NumberField.Root>
      {hasErrorText ? (
        <FieldHelperText
          as="field-error"
          icon={errorIcon}
          id={supportTextId}
          invalid
        >
          {errorText}
        </FieldHelperText>
      ) : helperText ? (
        <FieldHelperText
          as="field-description"
          icon={helperIcon}
          id={supportTextId}
        >
          {helperText}
        </FieldHelperText>
      ) : null}
      <div aria-atomic="true" aria-live="polite">
        {pasteMessage && (
          <FieldHelperText id={pasteMessageId} invalid>
            {pasteMessage}
          </FieldHelperText>
        )}
      </div>
    </Field.Root>
  );
};
