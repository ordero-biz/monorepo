import { cn } from '@ordero/ui/lib/utils';
import { TEXTAREA_DEFAULTS, textareaVariants } from './constants';
import type { TextareaProps } from './types';

function Textarea({
  className,
  state,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) {
  const resolvedState = state ?? TEXTAREA_DEFAULTS.state;
  const resolvedAriaInvalid =
    ariaInvalid ?? (resolvedState === 'error' || undefined);

  return (
    <textarea
      data-slot="textarea"
      data-state={resolvedState}
      aria-invalid={resolvedAriaInvalid}
      className={cn(textareaVariants({ state: resolvedState }), className)}
      {...props}
    />
  );
}

export { Textarea };
