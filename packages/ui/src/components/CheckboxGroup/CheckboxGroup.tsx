'use client';

import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { Field } from '@base-ui/react/field';
import { cva } from 'class-variance-authority';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/ui/lib/utils';
import type { CheckboxGroupProps } from './types';

const checkboxGroupRootVariants = cva('flex min-w-0', {
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

const labelClassName =
  'mb-[6px] text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)]';

const helperTextClassName =
  'flex items-start gap-[var(--form-helper-text-spacing)] pl-[var(--form-helper-text-pl)] pt-[var(--form-helper-text-pt)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)]';

const helperIconClassName =
  'mt-px shrink-0 [&_svg]:size-[var(--form-helper-text-icon)]';

const getLabelColorClassName = ({
  disabled,
  invalid,
}: {
  disabled: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'text-[var(--text-disabled)]';
  }

  if (invalid) {
    return 'text-destructive';
  }

  return 'text-[var(--text-secondary)]';
};

const renderSupportText = ({
  icon,
  text,
}: {
  icon?: CheckboxGroupProps['helperIcon'];
  text: CheckboxGroupProps['helperText'];
}) => (
  <>
    {icon ? <span className={helperIconClassName}>{icon}</span> : null}
    <span className="min-w-0 flex-1">{text}</span>
  </>
);

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
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
      value,
    },
    ref
  ) => {
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
      [
        ariaDescribedBy,
        hasErrorText || hasHelperText ? supportTextId : undefined,
      ]
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
        data-slot="checkbox-group"
        disabled={disabled}
        invalid={invalid}
        name={name}
      >
        {label ? (
          <div
            className={cn(
              labelClassName,
              getLabelColorClassName({
                disabled,
                invalid,
              })
            )}
            id={labelId}
          >
            {label}
          </div>
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
          className={cn(checkboxGroupRootVariants({ orientation }))}
        >
          {children}
        </CheckboxGroupPrimitive>
        {hasErrorText ? (
          <p
            className={cn(helperTextClassName, 'text-destructive')}
            id={supportTextId}
          >
            {renderSupportText({
              icon: errorIcon,
              text: errorText,
            })}
          </p>
        ) : null}
        {hasHelperText && !hasErrorText ? (
          <p
            className={cn(helperTextClassName, 'text-text-secondary')}
            id={supportTextId}
          >
            {renderSupportText({
              icon: helperIcon,
              text: helperText,
            })}
          </p>
        ) : null}
      </Field.Root>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
