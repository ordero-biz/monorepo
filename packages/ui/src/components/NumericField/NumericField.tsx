'use client';

import { Field } from '@base-ui/react/field';
import { NumberField } from '@base-ui/react/number-field';
import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { getInputClassName, InputFrame } from '@/ui/components/Input';
import type { NumericFieldProps } from './types';

const format = { maximumFractionDigits: 20, maximumSignificantDigits: 21 };
const precisionError = 'Enter a number with fewer decimal places.';
const numberError = 'Enter a valid number.';
const rejectedEditError = 'The number was not accepted.';

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
    invalid,
    label,
    locale,
    maxFractionDigits = Infinity,
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
  const isControlled = 'value' in props;
  const fieldRef = useRef<HTMLDivElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const supportTextId = useId();
  const [focused, setFocused] = useState(false);
  const [documentLanguage, setDocumentLanguage] = useState('en');
  const [draftError, setDraftError] = useState('');
  const [proposedValue, setProposedValue] = useState<number | null>();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const number = getSupportedValue(
    isControlled ? value : uncontrolledValue,
    allowNegative
  );
  const fractionLimit = Number.isNaN(maxFractionDigits)
    ? Infinity
    : Math.max(0, Math.floor(maxFractionDigits));
  const numberFormat = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale ?? documentLanguage, format);
    } catch {
      return new Intl.NumberFormat(documentLanguage, format);
    }
  }, [locale, documentLanguage]);
  const localeName = numberFormat.resolvedOptions().locale;
  const parts = numberFormat.formatToParts(-1234567890123.7);
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const group = parts.find((part) => part.type === 'group')?.value;
  const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-';
  const integerParts = parts.filter((part) => part.type === 'integer');
  const groupSize = Array.from(integerParts.at(-1)?.value ?? '').length;
  const repeatGroupSize = Array.from(integerParts.at(-2)?.value ?? '').length;
  const fraction =
    number === undefined
      ? undefined
      : numberFormat
          .formatToParts(number)
          .find((part) => part.type === 'fraction');
  const error =
    draftError ||
    (Array.from(fraction?.value ?? '').length > fractionLimit
      ? precisionError
      : '') ||
    (proposedValue !== undefined && !Object.is(proposedValue, number ?? null)
      ? rejectedEditError
      : '');
  const isInvalid = Boolean(invalid || error);
  const message = (isInvalid ? (errorText ?? error) : undefined) || undefined;
  const describedBy =
    [ariaDescribedBy, message || helperText ? supportTextId : undefined]
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

  useLayoutEffect(() => {
    nativeInputRef.current?.setCustomValidity(error);
  }, [error]);

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      if (typeof ref === 'function') {
        return ref(element);
      }
      if (ref) {
        ref.current = element;
      }
    },
    [ref]
  );

  const getDraftError = (text: string) => {
    const cleaned = text.trim().replace(/\p{Bidi_Control}/gu, '');
    const unsigned = cleaned.startsWith(minus)
      ? cleaned.slice(minus.length)
      : cleaned.replace(/^[+\-−]/u, '');
    const normalized =
      group && /^\p{Zs}$/u.test(group)
        ? unsigned.replace(/\p{Zs}/gu, group)
        : unsigned;
    const [integer, fraction, repeatedDecimal] = normalized.split(decimal);
    const groups = group ? integer.split(group) : [integer];
    if (
      (cleaned !== '' && !/\p{Decimal_Number}/u.test(cleaned)) ||
      repeatedDecimal !== undefined ||
      groups.some((part) => !/^\p{Decimal_Number}*$/u.test(part)) ||
      (fraction !== undefined && !/^\p{Decimal_Number}*$/u.test(fraction))
    ) {
      return numberError;
    }

    if (
      groups.length > 1 &&
      (groups[0].length === 0 ||
        Array.from(groups[0]).length > repeatGroupSize ||
        Array.from(groups.at(-1) ?? '').length !== groupSize ||
        groups
          .slice(1, -1)
          .some((part) => Array.from(part).length !== repeatGroupSize))
    ) {
      return numberError;
    }

    const digits = fraction?.match(/\p{Decimal_Number}/gu);
    return (digits?.length ?? 0) > fractionLimit ? precisionError : '';
  };

  return (
    <Field.Root
      className="flex w-full min-w-0 flex-col"
      disabled={disabled}
      invalid={isInvalid}
    >
      {label && (
        <FieldLabel
          active={focused}
          disabled={disabled}
          invalid={isInvalid}
          required={required}
        >
          {label}
        </FieldLabel>
      )}
      <NumberField.Root
        allowOutOfRange
        className="min-w-0"
        disabled={disabled}
        format={format}
        id={id}
        inputRef={nativeInputRef}
        locale={localeName}
        min={allowNegative ? undefined : 0}
        name={name}
        onValueChange={(nextValue, details) => {
          if (details.reason === 'keyboard') {
            setDraftError('');
          }
          const target = details.event.target;
          if (
            details.reason === 'input-change' &&
            target instanceof HTMLInputElement &&
            getDraftError(target.value)
          ) {
            details.cancel();
            return;
          }
          if (
            nextValue !== null &&
            (!Number.isFinite(nextValue) || (!allowNegative && nextValue < 0))
          ) {
            details.cancel();
            setDraftError(numberError);
            return;
          }
          onValueChange?.(nextValue ?? undefined, details);
          if (details.isCanceled || isControlled) {
            setProposedValue(nextValue);
          } else {
            setUncontrolledValue(nextValue ?? undefined);
            setProposedValue(undefined);
          }
        }}
        readOnly={readOnly}
        ref={fieldRef}
        required={required}
        step="any"
        value={number ?? null}
      >
        <InputFrame
          disabled={disabled}
          endAdornment={endAdornment}
          endIcon={endIcon}
          focused={focused}
          invalid={isInvalid}
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
              inputMode ?? (fractionLimit === 0 ? 'numeric' : 'decimal')
            }
            onBlur={(event) => {
              if (error) {
                event.preventDefault();
              } else {
                setProposedValue(undefined);
              }
              setFocused(false);
              onBlur?.(event);
            }}
            onChange={(event) =>
              setDraftError(getDraftError(event.currentTarget.value))
            }
            onKeyDown={onKeyDown}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onPaste={(event) => {
              const error = getDraftError(
                event.clipboardData.getData('text/plain')
              );
              setDraftError(error);
              if (error) {
                event.preventDefault();
              }
            }}
            placeholder={placeholder}
            ref={setInputRef}
          />
        </InputFrame>
      </NumberField.Root>
      {message ? (
        <FieldHelperText
          as="field-error"
          icon={errorIcon}
          id={supportTextId}
          invalid
        >
          {message}
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
    </Field.Root>
  );
};
