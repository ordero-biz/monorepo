'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { cva } from 'class-variance-authority';
import { forwardRef, type MouseEvent, useCallback, useId, useRef } from 'react';
import { cn } from '@/ui/lib/utils';
import type { RadioColor, RadioProps, RadioSize } from './types';

const radioRootVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full p-[calc(var(--radio-p)/2)] outline-none transition-[background-color] focus-visible:ring-3 focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed',
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

const radioIconViewportVariants = cva('relative block shrink-0', {
  variants: {
    size: {
      m: 'size-[var(--radio-md-icon)]',
      s: 'size-[var(--radio-sm-icon)]',
    },
  },
  defaultVariants: {
    size: 'm',
  },
});

const checkedRingClassNames: Record<RadioColor, string> = {
  default: 'border-[var(--grey-800)] text-[var(--grey-800)]',
  primary: 'border-[var(--primary-main)] text-[var(--primary-main)]',
  secondary: 'border-[var(--secondary-main)] text-[var(--secondary-main)]',
  info: 'border-[var(--info-main)] text-[var(--info-main)]',
  success: 'border-[var(--success-main)] text-[var(--success-main)]',
  warning: 'border-[var(--warning-main)] text-[var(--warning-main)]',
  error: 'border-[var(--destructive)] text-[var(--destructive)]',
};

const checkedHoverClassNames: Record<RadioColor, string> = {
  default: 'hover:bg-[var(--color-grey-8)]',
  primary: 'hover:bg-[var(--color-primary-8)]',
  secondary: 'hover:bg-[var(--color-secondary-8)]',
  info: 'hover:bg-[var(--color-info-8)]',
  success: 'hover:bg-[var(--color-success-8)]',
  warning: 'hover:bg-[var(--color-warning-8)]',
  error: 'hover:bg-[var(--color-error-8)]',
};

const radioRingClassName =
  'absolute inset-[8.333%] rounded-full border-[1.5px] border-solid transition-[border-color,color]';

const labelClassName =
  'min-w-0 text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)]';

const indicatorSizeClassNames: Record<RadioSize, string> = {
  m: 'size-[10px]',
  s: 'size-[8px]',
};

const getRadioRootStateClassName = ({
  checked,
  color,
  disabled,
}: {
  checked: boolean;
  color: RadioColor;
  disabled: boolean;
}) => {
  if (disabled) {
    return 'hover:bg-transparent';
  }

  if (checked) {
    return checkedHoverClassNames[color];
  }

  return 'hover:bg-[var(--color-grey-8)]';
};

const getRadioRingStateClassName = ({
  checked,
  color,
  disabled,
}: {
  checked: boolean;
  color: RadioColor;
  disabled: boolean;
}) => {
  if (disabled) {
    if (checked) {
      return 'border-[var(--color-grey-80)] text-[var(--color-grey-80)]';
    }

    return 'border-[var(--text-disabled)] text-transparent';
  }

  if (checked) {
    return checkedRingClassNames[color];
  }

  return 'border-[var(--grey-600)] text-transparent';
};

const getLabelColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-primary)]';

export const Radio = forwardRef<HTMLElement, RadioProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      color = 'primary',
      disabled = false,
      id,
      inputRef,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      readOnly = false,
      required = false,
      size = 'm',
      tabIndex,
      title,
      value,
    },
    ref
  ) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const generatedLabelId = useId();
    const controlElementRef = useRef<HTMLElement | null>(null);
    const radioLabelId = children ? `${generatedLabelId}-label` : undefined;
    const labelledBy =
      [ariaLabelledBy, radioLabelId].filter(Boolean).join(' ') || undefined;
    const setControlRefs = useCallback(
      (node: HTMLElement | null) => {
        controlElementRef.current = node;

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
    const handleLabelMouseDown = useCallback(
      (event: MouseEvent<HTMLLabelElement>) => {
        if (disabled || readOnly) {
          return;
        }

        const target = event.target;

        if (!(target instanceof HTMLElement)) {
          return;
        }

        if (target.closest('[data-slot="radio"]')) {
          return;
        }

        event.preventDefault();
        controlElementRef.current?.click();
      },
      [disabled, readOnly]
    );

    return (
      <label
        className={cn(
          'inline-flex max-w-fit items-center gap-0 align-top',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        htmlFor={controlId}
        onMouseDown={handleLabelMouseDown}
      >
        <RadioPrimitive.Root
          ref={setControlRefs}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          disabled={disabled}
          id={controlId}
          inputRef={inputRef}
          onBlur={onBlur}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          render={(rootProps, state) => (
            <span
              {...rootProps}
              className={cn(
                rootProps.className,
                radioRootVariants({ size }),
                getRadioRootStateClassName({
                  checked: state.checked,
                  color,
                  disabled: state.disabled,
                })
              )}
              data-slot="radio"
            >
              <span className={cn(radioIconViewportVariants({ size }))}>
                <span
                  className={cn(
                    radioRingClassName,
                    getRadioRingStateClassName({
                      checked: state.checked,
                      color,
                      disabled: state.disabled,
                    })
                  )}
                >
                  {state.checked ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'shrink-0 rounded-full bg-current',
                          indicatorSizeClassNames[size]
                        )}
                      />
                    </span>
                  ) : null}
                </span>
              </span>
            </span>
          )}
          required={required}
          tabIndex={tabIndex}
          title={title}
          value={value}
        />
        {children ? (
          <span
            className={cn(labelClassName, getLabelColorClassName({ disabled }))}
            data-slot="radio-label"
            id={radioLabelId}
          >
            {children}
          </span>
        ) : null}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export { radioRootVariants };
