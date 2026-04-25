'use client';

import {
  type InputChangeEventDetails,
  Input as InputPrimitive,
} from '@base-ui/react/input';
import type { CSSProperties } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { cn } from '@/ui/lib/utils';
import type { InputProps } from './types';

const inputFrameClassNames = {
  outlined:
    'relative flex w-full min-w-0 rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textfield-outlined-px)] shadow-[var(--_input-outline-shadow)] transition-[box-shadow] hover:shadow-[var(--_input-hover-outline-shadow)]',
  filled:
    'relative flex w-full min-w-0 rounded-[var(--textfield-filled-radius)] bg-[var(--_input-background)] px-[var(--textfield-filled-pl)] pr-[var(--textfield-filled-pr)] transition-[background-color] hover:bg-[var(--_input-hover-background)]',
} as const;

const inputFrameSizeClassNames = {
  outlined: {
    m: 'h-[var(--textfield-outlined-md-height)]',
    s: 'h-[var(--textfield-outlined-sm-height)]',
  },
  filled: {
    m: 'h-[var(--textfield-md-height)]',
    s: 'h-[var(--textfield-sm-height)]',
  },
} as const;

const inputContentRowClassNames = {
  outlined: {
    m: 'flex min-w-0 flex-1 items-center',
    s: 'flex min-w-0 flex-1 items-center',
  },
  filled: {
    m: 'flex min-w-0 flex-1 items-center',
    s: 'flex min-w-0 flex-1 items-center',
  },
} as const;

const inputClassName =
  'min-w-0 flex-1 border-0 bg-transparent p-0 text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] outline-none placeholder:text-[var(--text-disabled)] disabled:cursor-not-allowed';

const adornmentClassName =
  'flex shrink-0 items-center justify-center leading-none text-[length:var(--input-value-size-desktop)] font-[var(--input-value-weight)]';

const startAdornmentClassName = 'mr-[var(--textfield-start-adornment-mr)]';

const endAdornmentClassName = 'ml-[8px] min-w-[24px]';

const iconSizeClassNames = {
  m: 'size-[20px]',
  s: 'size-[18px]',
} as const;

type InputStyle = CSSProperties & {
  '--_input-background'?: string;
  '--_input-hover-background'?: string;
  '--_input-outline-shadow'?: string;
  '--_input-hover-outline-shadow'?: string;
};

const getInputStyle = ({
  disabled,
  focused,
  invalid,
  variant,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
  variant: NonNullable<InputProps['variant']>;
}): InputStyle => {
  if (variant === 'filled') {
    if (invalid) {
      return {
        '--_input-background': 'var(--color-error-8)',
        '--_input-hover-background': 'var(--color-error-8)',
      };
    }

    if (focused) {
      return {
        '--_input-background': 'var(--color-grey-16)',
        '--_input-hover-background': 'var(--color-grey-16)',
      };
    }

    if (disabled) {
      return {
        '--_input-background': 'var(--color-grey-8)',
        '--_input-hover-background': 'var(--color-grey-8)',
      };
    }

    return {
      '--_input-background': 'var(--color-grey-8)',
      '--_input-hover-background': 'var(--color-grey-16)',
    };
  }

  if (disabled) {
    return {
      '--_input-outline-shadow': 'inset 0 0 0 1px var(--figma-grey-20)',
      '--_input-hover-outline-shadow': 'inset 0 0 0 1px var(--figma-grey-20)',
    };
  }

  if (invalid && focused) {
    return {
      '--_input-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
      '--_input-hover-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
    };
  }

  if (invalid) {
    return {
      '--_input-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
      '--_input-hover-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
    };
  }

  if (focused) {
    return {
      '--_input-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
      '--_input-hover-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
    };
  }

  return {
    '--_input-outline-shadow': 'inset 0 0 0 1px var(--input)',
    '--_input-hover-outline-shadow': 'inset 0 0 0 1px var(--foreground)',
  };
};

const getAdornmentColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-[var(--text-secondary)]';

const getInputTextColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-foreground';

export const Input = forwardRef<HTMLElement, InputProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      autoComplete,
      autoFocus,
      defaultValue,
      disabled = false,
      endAdornment,
      endIcon: EndIcon,
      focused,
      id,
      invalid = false,
      name,
      onBlur,
      onFocus,
      onKeyDown,
      onValueChange,
      placeholder,
      readOnly,
      required,
      size = 'm',
      startAdornment,
      startIcon: StartIcon,
      type = 'text',
      value,
      variant = 'outlined',
    },
    ref
  ) => {
    const [focusedState, setFocusedState] = useState(false);
    const isFocused = focused ?? focusedState;

    useEffect(() => {
      if (focused !== undefined) {
        setFocusedState(focused);
      }
    }, [focused]);

    return (
      <div
        className={cn(
          inputFrameClassNames[variant],
          inputFrameSizeClassNames[variant][size]
        )}
        data-slot="input"
        style={getInputStyle({
          disabled,
          focused: isFocused,
          invalid,
          variant,
        })}
      >
        <div className={cn(inputContentRowClassNames[variant][size])}>
          {startAdornment || StartIcon ? (
            <span
              className={cn(
                adornmentClassName,
                startAdornmentClassName,
                getAdornmentColorClassName({ disabled })
              )}
            >
              {startAdornment}
              {StartIcon ? (
                <StartIcon
                  className={cn('shrink-0', iconSizeClassNames[size])}
                />
              ) : null}
            </span>
          ) : null}
          <InputPrimitive
            ref={ref}
            aria-describedby={ariaDescribedBy}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={cn(
              inputClassName,
              getInputTextColorClassName({ disabled })
            )}
            defaultValue={defaultValue}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={(event) => {
              setFocusedState(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocusedState(true);
              onFocus?.(event);
            }}
            onKeyDown={onKeyDown}
            onValueChange={(
              nextValue: string,
              details: InputChangeEventDetails
            ) => {
              onValueChange?.(nextValue, details);
            }}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
            value={value}
          />
          {endAdornment || EndIcon ? (
            <span
              className={cn(
                adornmentClassName,
                endAdornmentClassName,
                getAdornmentColorClassName({ disabled })
              )}
            >
              {endAdornment}
              {EndIcon ? (
                <EndIcon className={cn('shrink-0', iconSizeClassNames[size])} />
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
