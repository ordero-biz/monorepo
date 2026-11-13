export const fieldSurfaceClassNames = {
  outlined:
    'rounded-[var(--textfield-outlined-radius)] bg-background transition-[box-shadow]',
  filled:
    'rounded-[var(--textfield-filled-radius)] transition-[background-color]',
} as const;

export const fieldValueTypographyClassName =
  'text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)]';

export const getFieldSurfaceStateClassName = ({
  active,
  disabled,
  invalid,
  variant,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: keyof typeof fieldSurfaceClassNames;
}) => {
  if (variant === 'filled') {
    if (invalid) {
      return 'bg-[var(--color-error-8)] hover:bg-[var(--color-error-8)]';
    }

    if (active) {
      return 'bg-[var(--color-grey-16)] hover:bg-[var(--color-grey-16)]';
    }

    if (disabled) {
      return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-8)]';
    }

    return 'bg-[var(--color-grey-8)] hover:bg-[var(--color-grey-16)]';
  }

  if (disabled) {
    return 'shadow-[inset_0_0_0_1px_var(--color-grey-20)] hover:shadow-[inset_0_0_0_1px_var(--color-grey-20)]';
  }

  if (invalid && active) {
    return 'shadow-[inset_0_0_0_2px_var(--destructive)] hover:shadow-[inset_0_0_0_2px_var(--destructive)]';
  }

  if (invalid) {
    return 'shadow-[inset_0_0_0_1px_var(--destructive)] hover:shadow-[inset_0_0_0_1px_var(--destructive)]';
  }

  if (active) {
    return 'shadow-[inset_0_0_0_2px_var(--foreground)] hover:shadow-[inset_0_0_0_2px_var(--foreground)]';
  }

  return 'shadow-[inset_0_0_0_1px_var(--input)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]';
};
