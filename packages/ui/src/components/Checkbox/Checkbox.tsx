'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { cn } from '@/ui/lib/utils';
import type { CheckboxColor, CheckboxProps, CheckboxSize } from './types';

const checkboxRootVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full p-1 outline-none transition-[background-color] focus-visible:ring-3 focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed',
  {
    variants: {
      size: {
        m: '',
        s: '',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  }
);

const checkboxIconViewportVariants = cva('relative block shrink-0', {
  variants: {
    size: {
      m: 'size-[var(--checkbox-md-icon)]',
      s: 'size-[var(--checkbox-sm-icon)]',
    },
  },
  defaultVariants: {
    size: 'm',
  },
});

const checkboxBoxVariants = cva(
  'absolute inset-[8.333%] border-[1.5px] border-solid transition-[background-color,border-color,color]',
  {
    variants: {
      size: {
        m: 'rounded-[6px]',
        s: 'rounded-[5px]',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  }
);

const checkedBoxClassNames: Record<CheckboxColor, string> = {
  default:
    'border-[var(--grey-800)] bg-[var(--grey-800)] text-[var(--white-main)]',
  primary:
    'border-[var(--primary-main)] bg-[var(--primary-main)] text-[var(--white-main)]',
  secondary:
    'border-[var(--secondary-main)] bg-[var(--secondary-main)] text-[var(--white-main)]',
  info: 'border-[var(--info-main)] bg-[var(--info-main)] text-[var(--white-main)]',
  success:
    'border-[var(--success-main)] bg-[var(--success-main)] text-[var(--white-main)]',
  warning:
    'border-[var(--warning-main)] bg-[var(--warning-main)] text-[var(--white-main)]',
  error:
    'border-[var(--error-main)] bg-[var(--error-main)] text-[var(--white-main)]',
};

const checkedHoverClassNames: Record<CheckboxColor, string> = {
  default: 'hover:bg-[var(--color-grey-8)]',
  primary: 'hover:bg-[var(--color-primary-8)]',
  secondary: 'hover:bg-[var(--color-secondary-8)]',
  info: 'hover:bg-[var(--color-info-8)]',
  success: 'hover:bg-[var(--color-success-8)]',
  warning: 'hover:bg-[var(--color-warning-8)]',
  error: 'hover:bg-[var(--color-error-8)]',
};

const indicatorSizeClassNames: Record<CheckboxSize, string> = {
  m: 'size-[14px]',
  s: 'size-[12px]',
};

const labelClassName =
  'min-w-0 text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)]';

const getCheckboxRootStateClassName = ({
  color,
  disabled,
  indeterminate,
  checked,
}: {
  checked: boolean;
  color: CheckboxColor;
  disabled: boolean;
  indeterminate: boolean;
}) => {
  if (disabled) {
    return 'hover:bg-transparent';
  }

  if (checked || indeterminate) {
    return checkedHoverClassNames[color];
  }

  return 'hover:bg-[var(--color-grey-8)]';
};

const getCheckboxBoxStateClassName = ({
  checked,
  color,
  disabled,
  indeterminate,
}: {
  checked: boolean;
  color: CheckboxColor;
  disabled: boolean;
  indeterminate: boolean;
}) => {
  if (disabled) {
    if (checked || indeterminate) {
      return 'border-[var(--color-grey-80)] bg-[var(--color-grey-80)] text-[var(--white-main)]';
    }

    return 'border-[var(--text-disabled)] bg-background';
  }

  if (checked || indeterminate) {
    return checkedBoxClassNames[color];
  }

  return 'border-[var(--grey-600)] bg-background';
};

const getLabelColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-primary)]';

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      checked,
      children,
      color = 'primary',
      defaultChecked,
      disabled = false,
      id,
      indeterminate = false,
      inputRef,
      name,
      onBlur,
      onCheckedChange,
      onClick,
      onFocus,
      onKeyDown,
      readOnly = false,
      required = false,
      size = 'm',
      tabIndex,
      title,
      uncheckedValue,
      value,
    },
    ref
  ) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const generatedLabelId = useId();
    const checkboxLabelId = children ? `${generatedLabelId}-label` : undefined;
    const labelledBy =
      [ariaLabelledBy, checkboxLabelId].filter(Boolean).join(' ') || undefined;

    return (
      <label
        className={cn(
          'inline-flex max-w-fit items-center gap-0 align-top',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        htmlFor={controlId}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          id={controlId}
          indeterminate={indeterminate}
          inputRef={inputRef}
          name={name}
          onBlur={onBlur}
          onCheckedChange={onCheckedChange}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          render={(rootProps, state) => (
            <span
              {...rootProps}
              className={cn(
                rootProps.className,
                checkboxRootVariants({ size }),
                getCheckboxRootStateClassName({
                  checked: state.checked,
                  color,
                  disabled: state.disabled,
                  indeterminate: state.indeterminate,
                })
              )}
              data-slot="checkbox"
            >
              <span className={cn(checkboxIconViewportVariants({ size }))}>
                <span
                  className={cn(
                    checkboxBoxVariants({ size }),
                    getCheckboxBoxStateClassName({
                      checked: state.checked,
                      color,
                      disabled: state.disabled,
                      indeterminate: state.indeterminate,
                    })
                  )}
                >
                  {state.checked || state.indeterminate ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      {state.indeterminate ? (
                        <Minus
                          aria-hidden="true"
                          className={cn(
                            'shrink-0',
                            indicatorSizeClassNames[size]
                          )}
                          strokeWidth={3}
                        />
                      ) : (
                        <Check
                          aria-hidden="true"
                          className={cn(
                            'shrink-0',
                            indicatorSizeClassNames[size]
                          )}
                          strokeWidth={3}
                        />
                      )}
                    </span>
                  ) : null}
                </span>
              </span>
            </span>
          )}
          required={required}
          tabIndex={tabIndex}
          title={title}
          uncheckedValue={uncheckedValue}
          value={value}
        />
        {children ? (
          <span
            className={cn(labelClassName, getLabelColorClassName({ disabled }))}
            data-slot="checkbox-label"
            id={checkboxLabelId}
          >
            {children}
          </span>
        ) : null}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { checkboxRootVariants };
