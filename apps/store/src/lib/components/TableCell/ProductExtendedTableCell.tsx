import { DataTableCell, Typography } from '@ordero/ui';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import type { ProductExtendedTableCellProps } from './types';

export const ProductExtendedTableCell = ({
  name,
  sku,
}: ProductExtendedTableCellProps) => (
  <DataTableCell>
    <div className="flex items-center gap-[var(--space-2)]">
      <ProductImagePlaceholder />
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
