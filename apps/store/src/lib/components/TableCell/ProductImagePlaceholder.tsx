import { Package } from 'lucide-react';

export const ProductImagePlaceholder = () => (
  <div
    aria-label="Product image unavailable"
    className="flex size-[var(--space-5)] shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-neutral)] text-[var(--text-secondary)]"
    role="img"
  >
    <Package aria-hidden="true" className="size-[var(--space-3)]" />
  </div>
);
