'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/ui/lib/utils';
import type { CheckboxChipProps } from './types';

const checkboxChipVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center border border-transparent outline-none transition-[background-color,border-color,color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50',
  {
    variants: {
      checked: {
        false: 'bg-transparent',
        true: 'border-transparent',
      },
      color: {
        error: '',
        info: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      },
      disabled: {
        false: 'cursor-pointer',
        true: 'cursor-not-allowed shadow-none',
      },
      size: {
        m: 'h-[var(--chip-md-height)] rounded-[var(--chip-md-radius)] pl-[var(--chip-md-px)] pr-[var(--chip-md-px)]',
        s: 'h-[var(--chip-sm-height)] rounded-[var(--chip-sm-radius)] pl-[var(--chip-sm-px)] pr-[var(--chip-sm-px)]',
      },
    },
    compoundVariants: [
      {
        checked: false,
        disabled: false,
        class:
          'bg-[var(--color-grey-8)] text-foreground hover:bg-[var(--color-grey-16)]',
      },
      {
        checked: true,
        color: 'primary',
        disabled: false,
        class:
          'bg-[var(--color-primary-8)] text-[var(--primary-dark)] hover:bg-[var(--color-primary-16)]',
      },
      {
        checked: true,
        color: 'secondary',
        disabled: false,
        class:
          'bg-[var(--color-secondary-8)] text-[var(--secondary-dark)] hover:bg-[var(--color-secondary-16)]',
      },
      {
        checked: true,
        color: 'info',
        disabled: false,
        class:
          'bg-[var(--color-info-8)] text-[var(--info-dark)] hover:bg-[var(--color-info-16)]',
      },
      {
        checked: true,
        color: 'success',
        disabled: false,
        class:
          'bg-[var(--color-success-8)] text-[var(--success-darker)] hover:bg-[var(--color-success-16)]',
      },
      {
        checked: true,
        color: 'warning',
        disabled: false,
        class:
          'bg-[var(--color-warning-8)] text-[var(--warning-darker)] hover:bg-[var(--color-warning-16)]',
      },
      {
        checked: true,
        color: 'error',
        disabled: false,
        class:
          'bg-[var(--color-error-8)] text-[var(--error-dark)] hover:bg-[var(--color-error-16)]',
      },
      {
        checked: false,
        disabled: true,
        class: 'bg-[var(--color-grey-20)] text-[var(--text-disabled)]',
      },
      {
        checked: true,
        disabled: true,
        class: 'bg-[var(--color-grey-20)] text-[var(--text-disabled)]',
      },
    ],
    defaultVariants: {
      checked: false,
      color: 'primary',
      disabled: false,
      size: 'm',
    },
  }
);

const labelContainerVariants = cva(
  'mr-[-2px] inline-flex shrink-0 items-center',
  {
    variants: {
      size: {
        m: 'px-[var(--chip-md-spacing)]',
        s: 'px-[var(--chip-sm-spacing)]',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  }
);

const checkboxBoxClassName =
  'inline-flex size-[var(--label-icon-token)] shrink-0 items-center justify-center rounded-full border border-current';

const stateIconClassName = 'size-[var(--space-1-5)] shrink-0';

const textClassName =
  'text-[length:var(--chip-size-desktop)] leading-[var(--chip-line-height-desktop)] font-[var(--chip-weight)] whitespace-nowrap';

export const CheckboxChip = ({
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
  parent = false,
  readOnly = false,
  ref,
  required = false,
  size = 'm',
  tabIndex,
  title,
  uncheckedValue,
  value,
}: CheckboxChipProps) => {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const generatedLabelId = useId();
  const labelId = children ? `${generatedLabelId}-label` : undefined;
  const labelledBy =
    [ariaLabel ? undefined : ariaLabelledBy, labelId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
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
      parent={parent}
      readOnly={readOnly}
      render={(rootProps, state) => (
        <span
          {...rootProps}
          className={cn(
            rootProps.className,
            checkboxChipVariants({
              checked: state.checked || state.indeterminate,
              color,
              disabled: state.disabled,
              size,
            })
          )}
          data-slot="checkbox-chip"
          tabIndex={state.disabled ? -1 : (tabIndex ?? 0)}
        >
          <span aria-hidden="true" className={checkboxBoxClassName}>
            {state.checked || state.indeterminate ? (
              state.indeterminate ? (
                <Minus className={stateIconClassName} strokeWidth={3} />
              ) : (
                <Check className={stateIconClassName} strokeWidth={3} />
              )
            ) : null}
          </span>
          {children ? (
            <span className={cn(labelContainerVariants({ size }))} id={labelId}>
              <span className={textClassName}>{children}</span>
            </span>
          ) : null}
        </span>
      )}
      required={required}
      tabIndex={tabIndex}
      title={title}
      uncheckedValue={uncheckedValue}
      value={value}
    />
  );
};

export { checkboxChipVariants };
