'use client';

import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { Field } from '@base-ui/react/field';
import { cva } from 'class-variance-authority';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FieldHelperText } from '@/ui/components/FieldHelperText';
import { FieldLabel } from '@/ui/components/FieldLabel';
import { cn } from '@/ui/lib/utils';
import type { CheckboxChipGroupProps } from './types';

const checkboxChipGroupRootVariants = cva('flex min-w-0', {
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap gap-[var(--space-1)]',
      vertical: 'flex-col items-start gap-[var(--space-1)]',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const CheckboxChipGroup = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  allValues,
  children,
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
  onValueChange,
  orientation = 'vertical',
  ref,
  value,
}: CheckboxChipGroupProps) => {
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
  const isParentMode = allValues !== undefined;
  const isUncontrolledStandardGroup = !isParentMode && value === undefined;
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
    if (!isUncontrolledStandardGroup) {
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
  }, [isUncontrolledStandardGroup]);

  return (
    <Field.Root
      className="flex w-full min-w-0 flex-col"
      data-slot="checkbox-chip-group"
      disabled={disabled}
      invalid={invalid}
      name={name}
    >
      {label ? (
        <FieldLabel as="div" disabled={disabled} id={labelId} invalid={invalid}>
          {label}
        </FieldLabel>
      ) : null}
      <CheckboxGroupPrimitive
        allValues={allValues}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        defaultValue={
          isUncontrolledStandardGroup ? (defaultValue ?? []) : undefined
        }
        disabled={disabled}
        id={id}
        onValueChange={onValueChange}
        key={isUncontrolledStandardGroup ? resetKey : undefined}
        ref={setRefs}
        value={value}
        className={cn(checkboxChipGroupRootVariants({ orientation }))}
      >
        {children}
      </CheckboxGroupPrimitive>
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
