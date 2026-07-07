'use client';

import { Field } from '@base-ui/react/field';
import { cn } from '@/ui/lib/utils';
import type { FieldHelperTextProps } from './types';

const helperTextClassName =
  'flex items-start gap-[var(--form-helper-text-spacing)] pl-[var(--form-helper-text-pl)] pt-[var(--form-helper-text-pt)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)]';

const helperIconClassName =
  'mt-px shrink-0 [&_svg]:size-[var(--form-helper-text-icon)]';

const getAlignClassName = ({
  align,
}: {
  align: NonNullable<FieldHelperTextProps['align']>;
}) => {
  if (align === 'end') {
    return 'justify-end text-right';
  }

  return '';
};

const renderHelperTextContent = ({
  align,
  children,
  icon,
}: Pick<FieldHelperTextProps, 'align' | 'children' | 'icon'>) => (
  <>
    {icon ? <span className={helperIconClassName}>{icon}</span> : null}
    <span className={cn('min-w-0 flex-1', align === 'end' && 'text-right')}>
      {children}
    </span>
  </>
);

export const FieldHelperText = ({
  align = 'start',
  as = 'p',
  children,
  icon,
  id,
  invalid = false,
  match = true,
}: FieldHelperTextProps) => {
  const className = cn(
    helperTextClassName,
    invalid ? 'text-destructive' : 'text-text-secondary',
    getAlignClassName({ align })
  );
  const content = renderHelperTextContent({ align, children, icon });

  if (as === 'field-error') {
    return (
      <Field.Error className={className} id={id} match={match}>
        {content}
      </Field.Error>
    );
  }

  if (as === 'field-description') {
    return (
      <Field.Description className={className} id={id}>
        {content}
      </Field.Description>
    );
  }

  return (
    <p className={className} id={id}>
      {content}
    </p>
  );
};
