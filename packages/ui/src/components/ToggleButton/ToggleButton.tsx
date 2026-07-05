'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import { cn } from '@/ui/lib/utils';
import type {
  ToggleButtonColor,
  ToggleButtonGroupProps,
  ToggleButtonItemProps,
  ToggleButtonSize,
} from './types';

const toggleButtonGroupVariants = cva(
  'inline-flex w-fit shrink-0 items-start gap-[var(--toggle-button-group-spacing)] rounded-[var(--toggle-button-radius)] border border-grey-8 bg-[var(--background-paper)] p-[var(--toggle-button-group-p)]',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

const toggleButtonItemVariants = cva(
  'inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[var(--toggle-button-spacing)] whitespace-nowrap rounded-[var(--toggle-button-radius)] border outline-none transition-[background-color,border-color,color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed',
  {
    variants: {
      hasLabel: {
        false: '',
        true: '',
      },
      size: {
        l: '',
        m: '',
        s: '',
      },
    },
    compoundVariants: [
      {
        hasLabel: false,
        size: 'l',
        class:
          'size-[var(--toggle-button-standalone-lg-size)] p-[var(--toggle-button-standalone-lg-p)]',
      },
      {
        hasLabel: false,
        size: 'm',
        class:
          'size-[var(--toggle-button-standalone-md-size)] p-[var(--toggle-button-standalone-md-p)]',
      },
      {
        hasLabel: false,
        size: 's',
        class:
          'size-[var(--toggle-button-standalone-sm-size)] p-[var(--toggle-button-standalone-sm-p)]',
      },
      {
        hasLabel: true,
        size: 'l',
        class:
          'h-[var(--toggle-button-standalone-lg-size)] px-[var(--toggle-button-standalone-lg-p)]',
      },
      {
        hasLabel: true,
        size: 'm',
        class:
          'h-[var(--toggle-button-standalone-md-size)] px-[var(--toggle-button-standalone-md-p)]',
      },
      {
        hasLabel: true,
        size: 's',
        class:
          'h-[var(--toggle-button-standalone-sm-size)] px-[var(--toggle-button-standalone-sm-p)]',
      },
    ],
    defaultVariants: {
      hasLabel: false,
      size: 'm',
    },
  }
);

const iconSizeClassNames = {
  l: 'size-[var(--toggle-button-standalone-lg-icon)]',
  m: 'size-[var(--toggle-button-standalone-md-icon)]',
  s: 'size-[var(--toggle-button-standalone-sm-icon)]',
} as const;

const labelClassName =
  'text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-[var(--subtitle2-weight)]';

const colorClassNames = {
  error: {
    defaultBorder: 'border-error-main',
    pressed: 'bg-error-8 text-error-main',
    pressedBorder: 'border-error-main',
    standalone: 'text-error-main hover:bg-error-8',
  },
  info: {
    defaultBorder: 'border-info-main',
    pressed: 'bg-info-8 text-info-main',
    pressedBorder: 'border-info-main',
    standalone: 'text-info-main hover:bg-info-8',
  },
  inherit: {
    defaultBorder: 'border-button-outlined',
    pressed: 'bg-grey-8 text-text-primary',
    pressedBorder: 'border-text-primary',
    standalone:
      'text-action-active hover:border-text-primary hover:bg-action-hover hover:text-text-primary',
  },
  primary: {
    defaultBorder: 'border-primary-main',
    pressed: 'bg-primary-8 text-primary-main',
    pressedBorder: 'border-primary-main',
    standalone: 'text-primary-main hover:bg-primary-8',
  },
  secondary: {
    defaultBorder: 'border-secondary-main',
    pressed: 'bg-secondary-8 text-secondary-main',
    pressedBorder: 'border-secondary-main',
    standalone: 'text-secondary-main hover:bg-secondary-8',
  },
  success: {
    defaultBorder: 'border-success-main',
    pressed: 'bg-success-8 text-success-main',
    pressedBorder: 'border-success-main',
    standalone: 'text-success-main hover:bg-success-8',
  },
  warning: {
    defaultBorder: 'border-warning-main',
    pressed: 'bg-warning-8 text-warning-main',
    pressedBorder: 'border-warning-main',
    standalone: 'text-warning-main hover:bg-warning-8',
  },
} satisfies Record<
  ToggleButtonColor,
  {
    defaultBorder: string;
    pressed: string;
    pressedBorder: string;
    standalone: string;
  }
>;

type ToggleButtonGroupContextValue = {
  color: ToggleButtonColor;
  size: ToggleButtonSize;
};

const ToggleButtonGroupContext =
  createContext<ToggleButtonGroupContextValue | null>(null);

const getStateClassName = ({
  color,
  disabled,
  grouped,
  pressed,
}: {
  color: ToggleButtonColor;
  disabled: boolean;
  grouped: boolean;
  pressed: boolean;
}) => {
  if (disabled) {
    return cn(
      'text-text-disabled',
      pressed ? 'bg-action-disabled-background' : 'bg-transparent',
      grouped ? 'border-transparent' : 'border-action-disabled-background'
    );
  }

  if (pressed) {
    return cn(
      colorClassNames[color].pressed,
      grouped ? 'border-transparent' : colorClassNames[color].pressedBorder
    );
  }

  if (grouped) {
    return 'border-transparent text-action-active hover:bg-action-hover';
  }

  return cn(
    colorClassNames[color].defaultBorder,
    colorClassNames[color].standalone
  );
};

export const ToggleButtonGroup = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  color = 'primary',
  defaultValue,
  disabled = false,
  id,
  loopFocus,
  multiple,
  onValueChange,
  orientation = 'horizontal',
  ref,
  size = 'm',
  value,
}: ToggleButtonGroupProps) => {
  return (
    <ToggleButtonGroupContext.Provider value={{ color, size }}>
      <ToggleGroupPrimitive
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(toggleButtonGroupVariants({ orientation }))}
        data-slot="toggle-button-group"
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        loopFocus={loopFocus}
        multiple={multiple}
        onValueChange={onValueChange}
        orientation={orientation}
        value={value}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleButtonGroupContext.Provider>
  );
};

export const ToggleButtonItem = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  color,
  defaultPressed,
  disabled,
  form,
  icon,
  id,
  name,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  onPressedChange,
  pressed,
  ref,
  size,
  tabIndex,
  title,
  type = 'button',
  value,
}: ToggleButtonItemProps) => {
  const groupContext = useContext(ToggleButtonGroupContext);
  const resolvedColor = color ?? groupContext?.color ?? 'inherit';
  const resolvedSize = size ?? groupContext?.size ?? 'm';
  const hasLabel = Boolean(children);
  const iconClassName = iconSizeClassNames[resolvedSize];

  return (
    <TogglePrimitive
      ref={ref}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={(state) =>
        cn(
          toggleButtonItemVariants({
            hasLabel,
            size: resolvedSize,
          }),
          getStateClassName({
            color: resolvedColor,
            disabled: state.disabled,
            grouped: Boolean(groupContext),
            pressed: state.pressed,
          })
        )
      }
      data-slot="toggle-button-item"
      defaultPressed={defaultPressed}
      disabled={disabled}
      form={form}
      id={id}
      name={name}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPressedChange={onPressedChange}
      pressed={pressed}
      tabIndex={tabIndex}
      title={title}
      type={type}
      value={value}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center [&_svg]:size-full',
            iconClassName
          )}
        >
          {icon}
        </span>
      ) : null}
      {children ? <span className={labelClassName}>{children}</span> : null}
    </TogglePrimitive>
  );
};
