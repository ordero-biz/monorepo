'use client';

import { Field } from '@base-ui/react/field';
import { cn } from '@/ui/lib/utils';
import type { FieldLabelProps } from './types';

const labelClassName =
  'mb-[var(--space-0-75)] block text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)]';

const getLabelColorClassName = ({
  active,
  disabled,
  invalid,
}: {
  active: boolean;
  disabled: boolean;
  invalid: boolean;
}) => {
  if (disabled) {
    return 'text-[var(--text-disabled)]';
  }

  if (invalid) {
    return 'text-destructive';
  }

  if (active) {
    return 'text-foreground';
  }

  return 'text-[var(--text-secondary)]';
};

const renderLabelContent = ({
  children,
  required,
}: Pick<FieldLabelProps, 'children' | 'required'>) => (
  <>
    {children}
    {required ? (
      // Keep the asterisk visual-only so it doesn't change the field's accessible name.
      <span aria-hidden="true" className="text-destructive">
        {' *'}
      </span>
    ) : null}
  </>
);

export const FieldLabel = ({
  active = false,
  as = 'field-label',
  children,
  disabled = false,
  htmlFor,
  id,
  invalid = false,
  nativeLabel = true,
  required = false,
}: FieldLabelProps) => {
  const className = cn(
    labelClassName,
    getLabelColorClassName({ active, disabled, invalid })
  );
  const content = renderLabelContent({ children, required });

  if (as === 'field-label') {
    if (!nativeLabel) {
      return (
        <Field.Label
          className={className}
          id={id}
          nativeLabel={false}
          render={(props) => <span {...props}>{content}</span>}
        >
          {null}
        </Field.Label>
      );
    }

    return (
      <Field.Label className={className} id={id}>
        {content}
      </Field.Label>
    );
  }

  if (as === 'label') {
    return (
      <label className={className} htmlFor={htmlFor} id={id}>
        {content}
      </label>
    );
  }

  if (as === 'span') {
    return (
      <span className={className} id={id}>
        {content}
      </span>
    );
  }

  return (
    <div className={className} id={id}>
      {content}
    </div>
  );
};
