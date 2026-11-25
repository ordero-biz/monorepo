'use client';

import { Field } from '@base-ui/react/field';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva } from 'class-variance-authority';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { cn } from '@/ui/lib/utils';
import type { RadioGroupProps } from './types';

const radioGroupRootVariants = cva('flex min-w-0', {
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap gap-[var(--space-2)]',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const RadioGroup = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  defaultValue,
  disabled = false,
  errorIcon,
  errorText,
  helperIcon,
  helperText,
  id,
  inputRef,
  invalid = false,
  label,
  name,
  onValueChange,
  orientation = 'vertical',
  readOnly = false,
  ref,
  required = false,
  value,
}: RadioGroupProps) => {
  const generatedLabelId = useId();
  const supportTextId = useId();
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const hasErrorText = Boolean(invalid && errorText);
  const hasHelperText = Boolean(helperText);
  const labelId = label ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
  const describedBy =
    [ariaDescribedBy, hasErrorText || hasHelperText ? supportTextId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const isUncontrolled = value === undefined;
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      groupRef.current = node;

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
    if (!isUncontrolled) {
      return;
    }

    const form = groupRef.current?.closest('form');

    if (!form) {
      return;
    }

    const handleReset = () => {
      setResetKey((currentKey) => currentKey + 1);
    };

    form.addEventListener('reset', handleReset);

    return () => {
      form.removeEventListener('reset', handleReset);
    };
  }, [isUncontrolled]);

  return (
    <Field.Root
      className="flex w-full min-w-0 flex-col"
      data-slot="radio-group-field"
      disabled={disabled}
      invalid={invalid}
      name={name}
    >
      {label ? (
        <FieldLabel
          disabled={disabled}
          id={labelId}
          invalid={invalid}
          required={required}
        >
          {label}
        </FieldLabel>
      ) : null}
      <RadioGroupPrimitive
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        defaultValue={isUncontrolled ? defaultValue : undefined}
        disabled={disabled}
        id={id}
        inputRef={inputRef}
        key={isUncontrolled ? resetKey : undefined}
        name={name}
        onValueChange={onValueChange}
        readOnly={readOnly}
        ref={setRefs}
        required={required}
        value={value}
        className={cn(radioGroupRootVariants({ orientation }))}
        data-slot="radio-group"
      >
        {children}
      </RadioGroupPrimitive>
      {hasErrorText ? (
        <FieldHelperText icon={errorIcon} id={supportTextId} invalid>
          {errorText}
        </FieldHelperText>
      ) : null}
      {hasHelperText && !hasErrorText ? (
        <FieldHelperText icon={helperIcon} id={supportTextId}>
          {helperText}
        </FieldHelperText>
      ) : null}
    </Field.Root>
  );
};
