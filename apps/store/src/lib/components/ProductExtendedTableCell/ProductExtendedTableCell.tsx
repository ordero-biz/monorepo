import { DataTableCell, Typography } from '@ordero/ui';
import { Package } from 'lucide-react';
import type { ProductExtendedTableCellProps } from './types';

export const ProductExtendedTableCell = ({
  name,
  sku,
}: ProductExtendedTableCellProps) => (
  <DataTableCell>
    <div className="flex items-center gap-[var(--space-2)]">
      <div
        aria-label="Product image unavailable"
        className="flex size-[var(--space-5)] shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-neutral)] text-[var(--text-secondary)]"
        role="img"
      >
        <Package aria-hidden="true" className="size-[var(--space-3)]" />
      </div>
      <div className="flex flex-col gap-[var(--space-0-5)]">
        <Typography variant="body2">{name}</Typography>
        {sku ? (
          <Typography color="text-secondary" variant="body2">
            {sku}
          </Typography>
        ) : null}
      </div>
    </div>
  </DataTableCell>
);
