import { cn } from '@ordero/ui/lib/utils';
import type * as React from 'react';

import { textareaVariants } from './constants';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants(), className)}
      {...props}
    />
  );
}

export { Textarea };
