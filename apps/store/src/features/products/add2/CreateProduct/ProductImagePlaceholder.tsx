import { Typography } from '@ordero/ui';
import { ImageIcon } from 'lucide-react';

export const ProductImagePlaceholder = () => (
  <div className="flex size-[var(--space-12)] shrink-0 flex-col items-center justify-center gap-[var(--space-0-5)] rounded-[var(--radius)] bg-muted text-muted-foreground">
    <ImageIcon aria-hidden="true" className="size-[var(--space-3)]" />
    <Typography color="text-secondary" variant="caption">
      No image
    </Typography>
  </div>
);
