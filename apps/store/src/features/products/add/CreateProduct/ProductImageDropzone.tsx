import { IconButton, Typography } from '@ordero/ui';
import { Plus } from 'lucide-react';
import type { ProductImageDropzoneProps } from './types';

export const ProductImageDropzone = ({
  className = '',
  titleId,
}: ProductImageDropzoneProps) => (
  <section
    aria-labelledby={titleId}
    className={`flex min-h-[var(--space-20)] flex-col items-center justify-center gap-[var(--space-1)] rounded-[var(--radius)] border border-dashed border-input bg-muted p-[var(--space-3)] text-muted-foreground ${className}`}
  >
    <IconButton
      aria-label="Add product image"
      color="primary"
      size="l"
      type="button"
    >
      <Plus aria-hidden="true" />
    </IconButton>
    <Typography color="text-secondary" id={titleId} variant="caption">
      Add product image
    </Typography>
  </section>
);
