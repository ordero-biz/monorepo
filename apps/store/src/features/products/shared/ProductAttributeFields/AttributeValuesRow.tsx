import { Button, FieldHelperText } from '@ordero/ui';
import type { AttributeValuesRowProps } from './types';

export const AttributeValuesRow = ({
  attributeName,
  inputId,
  hintId,
  empty,
  multiple,
  onRemove,
  children,
}: AttributeValuesRowProps) => (
  <section
    aria-labelledby={`${inputId}-heading`}
    className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-1)] rounded-[var(--radius)] border border-border p-[var(--space-1-5)] transition-colors md:grid-cols-[var(--space-18)_minmax(0,1fr)_auto] ${empty ? 'bg-[var(--color-primary-8)]' : 'bg-card'}`}
  >
    <h4
      className="col-span-2 min-w-0 break-words font-semibold md:col-span-1"
      id={`${inputId}-heading`}
    >
      <label className="cursor-pointer" htmlFor={inputId}>
        {attributeName}
      </label>
    </h4>
    {children}
    <Button
      aria-label={`Remove ${attributeName} attribute`}
      color="inherit"
      onClick={onRemove}
      size="s"
      type="button"
      variant="text"
    >
      Remove
    </Button>
    {empty ? (
      <div className="col-span-2 md:col-span-1 md:col-start-2">
        <FieldHelperText as="p" id={hintId}>
          {multiple
            ? `Choose one or more ${attributeName.toLowerCase()} values`
            : `Choose a ${attributeName.toLowerCase()} value`}
        </FieldHelperText>
      </div>
    ) : null}
  </section>
);
