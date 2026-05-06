'use client';

import type { RowData } from '@tanstack/react-table';
import { Checkbox } from '@/ui/components/Checkbox';
import type { DataTableSelectionCellProps } from './types';

export const DataTableSelectionCell = <TData extends RowData>({
  checkboxAriaLabel,
  children,
  row,
}: DataTableSelectionCellProps<TData>) => (
  <div className="flex min-w-0 items-center">
    {row.getCanSelect() ? (
      <div className="flex items-center pl-[var(--spacing-1)]">
        <Checkbox
          aria-label={checkboxAriaLabel}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
          size="s"
        />
      </div>
    ) : null}
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
