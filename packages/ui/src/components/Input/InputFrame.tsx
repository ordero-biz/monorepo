import type { CSSProperties } from 'react';
import { cn } from '@/ui/lib/utils';
import type { InputFrameProps, InputVariant } from './types';

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
  variant: InputVariant;
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
      '--_input-outline-shadow': 'inset 0 0 0 1px var(--color-grey-20)',
      '--_input-hover-outline-shadow': 'inset 0 0 0 1px var(--color-grey-20)',
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

const getAdornmentColorClassName = () => 'text-[var(--text-secondary)]';

export const getInputClassName = (disabled: boolean) =>
  cn(
    inputClassName,
    disabled ? 'text-[var(--text-disabled)]' : 'text-foreground'
  );

export const InputFrame = ({
  children,
  disabled = false,
  endAdornment,
  endIcon: EndIcon,
  focused = false,
  invalid = false,
  size = 'm',
  startAdornment,
  startIcon: StartIcon,
  variant = 'outlined',
}: InputFrameProps) => (
  <div
    className={cn(
      inputFrameClassNames[variant],
      inputFrameSizeClassNames[variant][size]
    )}
    data-slot="input"
    style={getInputStyle({
      disabled,
      focused,
      invalid,
      variant,
    })}
  >
    <div className="flex min-w-0 flex-1 items-center">
      {startAdornment || StartIcon ? (
        <span
          className={cn(
            adornmentClassName,
            startAdornmentClassName,
            getAdornmentColorClassName()
          )}
        >
          {startAdornment}
          {StartIcon ? (
            <StartIcon className={cn('shrink-0', iconSizeClassNames[size])} />
          ) : null}
        </span>
      ) : null}
      {children}
      {endAdornment || EndIcon ? (
        <span
          className={cn(
            adornmentClassName,
            endAdornmentClassName,
            getAdornmentColorClassName()
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
