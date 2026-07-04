'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/ui/lib/utils';
import type { TextareaProps, TextareaResize } from './types';

const textareaFrameClassNames = {
  outlined:
    'relative flex w-full min-w-0 rounded-[var(--textfield-outlined-radius)] bg-background px-[var(--textarea-outlined-px)] py-[var(--textarea-outlined-py)] shadow-[var(--_textarea-outline-shadow)] transition-[box-shadow] hover:shadow-[var(--_textarea-hover-outline-shadow)]',
  filled:
    'relative flex w-full min-w-0 rounded-[var(--textfield-filled-radius)] bg-[var(--_textarea-background)] px-[var(--textarea-filled-px)] py-[var(--textarea-filled-py)] transition-[background-color] hover:bg-[var(--_textarea-hover-background)]',
} as const;

const textareaClassName =
  'min-h-[var(--textarea-min-height)] w-full min-w-0 border-0 bg-transparent p-0 text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] outline-none placeholder:text-[var(--text-disabled)] disabled:cursor-not-allowed';

const resizeClassNames: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
};

type TextareaStyle = CSSProperties & {
  '--_textarea-background'?: string;
  '--_textarea-hover-background'?: string;
  '--_textarea-outline-shadow'?: string;
  '--_textarea-hover-outline-shadow'?: string;
};

const getTextareaStyle = ({
  disabled,
  focused,
  invalid,
  variant,
}: {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
  variant: NonNullable<TextareaProps['variant']>;
}): TextareaStyle => {
  if (variant === 'filled') {
    if (invalid) {
      return {
        '--_textarea-background': 'var(--color-error-8)',
        '--_textarea-hover-background': 'var(--color-error-8)',
      };
    }

    if (focused) {
      return {
        '--_textarea-background': 'var(--color-grey-16)',
        '--_textarea-hover-background': 'var(--color-grey-16)',
      };
    }

    if (disabled) {
      return {
        '--_textarea-background': 'var(--color-grey-8)',
        '--_textarea-hover-background': 'var(--color-grey-8)',
      };
    }

    return {
      '--_textarea-background': 'var(--color-grey-8)',
      '--_textarea-hover-background': 'var(--color-grey-16)',
    };
  }

  if (disabled) {
    return {
      '--_textarea-outline-shadow': 'inset 0 0 0 1px var(--color-grey-20)',
      '--_textarea-hover-outline-shadow':
        'inset 0 0 0 1px var(--color-grey-20)',
    };
  }

  if (invalid && focused) {
    return {
      '--_textarea-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
      '--_textarea-hover-outline-shadow': 'inset 0 0 0 2px var(--destructive)',
    };
  }

  if (invalid) {
    return {
      '--_textarea-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
      '--_textarea-hover-outline-shadow': 'inset 0 0 0 1px var(--destructive)',
    };
  }

  if (focused) {
    return {
      '--_textarea-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
      '--_textarea-hover-outline-shadow': 'inset 0 0 0 2px var(--foreground)',
    };
  }

  return {
    '--_textarea-outline-shadow': 'inset 0 0 0 1px var(--input)',
    '--_textarea-hover-outline-shadow': 'inset 0 0 0 1px var(--foreground)',
  };
};

const getTextareaTextColorClassName = ({ disabled }: { disabled: boolean }) =>
  disabled ? 'text-[var(--text-disabled)]' : 'text-foreground';

export const Textarea = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoComplete,
  autoFocus,
  defaultValue,
  disabled = false,
  focused,
  id,
  invalid = false,
  maxLength,
  minLength,
  name,
  onBlur,
  onFocus,
  onKeyDown,
  onValueChange,
  placeholder,
  readOnly,
  ref,
  required,
  resize = 'vertical',
  rows,
  spellCheck,
  value,
  variant = 'outlined',
}: TextareaProps) => {
  const [focusedState, setFocusedState] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isFocused = focused ?? focusedState;
  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

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
    if (focused !== undefined) {
      setFocusedState(focused);
    }
  }, [focused]);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      className={cn(textareaFrameClassNames[variant])}
      data-slot="textarea"
      style={getTextareaStyle({
        disabled,
        focused: isFocused,
        invalid,
        variant,
      })}
    >
      <textarea
        ref={setTextareaRef}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        autoComplete={autoComplete}
        className={cn(
          textareaClassName,
          resizeClassNames[resize],
          getTextareaTextColorClassName({ disabled })
        )}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        onBlur={(event) => {
          setFocusedState(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          onValueChange?.(event.currentTarget.value, { event });
        }}
        onFocus={(event) => {
          setFocusedState(true);
          onFocus?.(event);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        rows={rows}
        spellCheck={spellCheck}
        value={value}
      />
    </div>
  );
};
