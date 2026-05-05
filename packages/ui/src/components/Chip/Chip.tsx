'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { cn } from '@/ui/lib/utils';
import type { ChipProps } from './types';

const chipVariants = cva(
  'inline-flex shrink-0 items-center gap-[var(--chip-spacing)] border border-transparent',
  {
    variants: {
      color: {
        error: '',
        info: '',
        inherit: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
      },
      disabled: {
        false: '',
        true: '',
      },
      size: {
        m: 'h-[var(--chip-md-height)] rounded-[var(--chip-md-radius)] pl-[var(--chip-md-px)] pr-[var(--chip-md-px)]',
        s: 'h-[var(--chip-sm-height)] rounded-[var(--chip-sm-radius)] pl-[var(--chip-sm-px)] pr-[var(--chip-sm-px)]',
      },
      variant: {
        filled: '',
        outlined: '',
        soft: '',
      },
    },
    compoundVariants: [
      {
        color: 'inherit',
        variant: 'filled',
        class: 'bg-foreground text-background',
      },
      {
        color: 'primary',
        variant: 'filled',
        class:
          'bg-[var(--primary-main)] text-[var(--figma-primary-contrast-text)]',
      },
      {
        color: 'secondary',
        variant: 'filled',
        class:
          'bg-[var(--secondary-main)] text-[var(--figma-secondary-contrast-text)]',
      },
      {
        color: 'info',
        variant: 'filled',
        class: 'bg-[var(--info-main)] text-[var(--figma-info-contrast-text)]',
      },
      {
        color: 'success',
        variant: 'filled',
        class:
          'bg-[var(--success-main)] text-[var(--figma-success-contrast-text)]',
      },
      {
        color: 'warning',
        variant: 'filled',
        class:
          'bg-[var(--warning-main)] text-[var(--figma-warning-contrast-text)]',
      },
      {
        color: 'error',
        variant: 'filled',
        class: 'bg-[var(--error-main)] text-[var(--figma-error-contrast-text)]',
      },
      {
        color: 'inherit',
        variant: 'outlined',
        class: 'border-[var(--figma-button-outlined)] text-foreground',
      },
      {
        color: 'primary',
        variant: 'outlined',
        class: 'border-[var(--primary-main)] text-[var(--primary-main)]',
      },
      {
        color: 'secondary',
        variant: 'outlined',
        class: 'border-[var(--secondary-main)] text-[var(--secondary-main)]',
      },
      {
        color: 'info',
        variant: 'outlined',
        class: 'border-[var(--info-main)] text-[var(--info-main)]',
      },
      {
        color: 'success',
        variant: 'outlined',
        class: 'border-[var(--success-main)] text-[var(--success-main)]',
      },
      {
        color: 'warning',
        variant: 'outlined',
        class: 'border-[var(--warning-main)] text-[var(--warning-main)]',
      },
      {
        color: 'error',
        variant: 'outlined',
        class: 'border-[var(--error-main)] text-[var(--error-main)]',
      },
      {
        color: 'inherit',
        variant: 'soft',
        class: 'bg-[var(--figma-grey-12)] text-foreground',
      },
      {
        color: 'primary',
        variant: 'soft',
        class: 'bg-[var(--figma-primary-16)] text-[var(--primary-dark)]',
      },
      {
        color: 'secondary',
        variant: 'soft',
        class: 'bg-[var(--figma-secondary-16)] text-[var(--secondary-dark)]',
      },
      {
        color: 'info',
        variant: 'soft',
        class: 'bg-[var(--figma-info-16)] text-[var(--info-dark)]',
      },
      {
        color: 'success',
        variant: 'soft',
        class: 'bg-[var(--figma-success-16)] text-[var(--success-dark)]',
      },
      {
        color: 'warning',
        variant: 'soft',
        class: 'bg-[var(--figma-warning-16)] text-[var(--warning-dark)]',
      },
      {
        color: 'error',
        variant: 'soft',
        class: 'bg-[var(--figma-error-16)] text-[var(--error-dark)]',
      },
      {
        disabled: true,
        variant: 'filled',
        class:
          'bg-[var(--figma-grey-20)] text-[var(--text-disabled)] [&_svg]:text-[var(--text-disabled)]',
      },
      {
        disabled: true,
        variant: 'outlined',
        class:
          'border-[var(--figma-grey-20)] text-[var(--text-disabled)] [&_svg]:text-[var(--text-disabled)]',
      },
      {
        disabled: true,
        variant: 'soft',
        class:
          'bg-[var(--figma-grey-20)] text-[var(--text-disabled)] [&_svg]:text-[var(--text-disabled)]',
      },
    ],
    defaultVariants: {
      color: 'inherit',
      disabled: false,
      size: 'm',
      variant: 'filled',
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

const labelSizeClassNames = {
  m: 'size-[var(--chip-md-icon)]',
  s: 'size-[var(--chip-sm-icon)]',
} as const;

const closeIconSizeClassNames = {
  m: 'size-2',
  s: 'size-2',
} as const;

const textClassName =
  'text-[length:var(--chip-size-desktop)] leading-[var(--chip-line-height-desktop)] font-[var(--chip-weight)] whitespace-nowrap';

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    className="size-full opacity-48 hover:opacity-90 transition-opacity"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 17"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.6667 8.33333C16.6667 12.9358 12.9358 16.6667 8.33333 16.6667C3.73083 16.6667 0 12.9358 0 8.33333C0 3.73083 3.73083 0 8.33333 0C12.9358 0 16.6667 3.73083 16.6667 8.33333ZM5.80833 5.80833C5.92552 5.69129 6.08437 5.62555 6.25 5.62555C6.41563 5.62555 6.57448 5.69129 6.69167 5.80833L8.33333 7.45L9.975 5.80833C10.0935 5.69793 10.2502 5.63783 10.4121 5.64069C10.574 5.64354 10.7285 5.70914 10.843 5.82365C10.9575 5.93816 11.0231 6.09265 11.026 6.25457C11.0288 6.41648 10.9687 6.57319 10.8583 6.69167L9.21667 8.33333L10.8583 9.975C10.9687 10.0935 11.0288 10.2502 11.026 10.4121C11.0231 10.574 10.9575 10.7285 10.843 10.843C10.7285 10.9575 10.574 11.0231 10.4121 11.026C10.2502 11.0288 10.0935 10.9687 9.975 10.8583L8.33333 9.21667L6.69167 10.8583C6.57319 10.9687 6.41648 11.0288 6.25457 11.026C6.09265 11.0231 5.93816 10.9575 5.82365 10.843C5.70914 10.7285 5.64354 10.574 5.64069 10.4121C5.63783 10.2502 5.69793 10.0935 5.80833 9.975L7.45 8.33333L5.80833 6.69167C5.69129 6.57448 5.62555 6.41563 5.62555 6.25C5.62555 6.08437 5.69129 5.92552 5.80833 5.80833Z"
      fill="currentColor"
    />
  </svg>
);

export const Chip = ({
  'aria-label': ariaLabel,
  children,
  color,
  disabled = false,
  id,
  onDelete,
  size = 'm',
  startIcon,
  title,
  variant,
}: ChipProps) => {
  const rootClassName = cn(chipVariants({ color, disabled, size, variant }));
  const labelClassName = cn(labelContainerVariants({ size }));
  const labelClassNames =
    startIcon || onDelete ? labelSizeClassNames.s : labelSizeClassNames[size];
  const closeIconClassName = closeIconSizeClassNames[size];

  const deleteAriaLabel = ariaLabel ? `Remove ${ariaLabel}` : 'Remove chip';

  const content = (
    <>
      {startIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            labelClassNames
          )}
        >
          {startIcon}
        </span>
      ) : null}
      <span className={labelClassName}>
        <span className={textClassName}>{children}</span>
      </span>
      {onDelete ? (
        <ButtonPrimitive
          type="button"
          aria-label={deleteAriaLabel}
          className={cn(
            'inline-flex cursor-pointer shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-100',
            closeIconClassName
          )}
          onClick={onDelete}
          disabled={disabled}
        >
          <CloseIcon />
        </ButtonPrimitive>
      ) : null}
    </>
  );

  return (
    <div className={rootClassName} data-slot="chip" id={id} title={title}>
      {content}
    </div>
  );
};

export { chipVariants };
