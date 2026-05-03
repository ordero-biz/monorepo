'use client';

import { Field } from '@base-ui/react/field';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva } from 'class-variance-authority';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { renderFieldLabelContent } from '@/ui/components/shared/renderFieldLabelContent';
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
  icon?: RadioGroupProps['helperIcon'];
  text: RadioGroupProps['helperText'];
}) => (
  <>
    {icon ? <span className={helperIconClassName}>{icon}</span> : null}
    <span className="min-w-0 flex-1">{text}</span>
  </>
);

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
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
      required = false,
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
          <Field.Label
            className={cn(
              labelClassName,
              getLabelColorClassName({
                disabled,
                invalid,
              })
            )}
            id={labelId}
          >
            {renderFieldLabelContent({ label, required })}
          </Field.Label>
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

RadioGroup.displayName = 'RadioGroup';
