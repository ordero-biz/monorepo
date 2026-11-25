'use client';

import type { RowData } from '@tanstack/react-table';
import { Checkbox } from '@/ui/components/Checkbox';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import type { DataTableSelectionColumnHeaderProps } from './types';

export const DataTableSelectionColumnHeader = <TData extends RowData>({
  checkboxAriaLabel,
  column,
  table,
  title,
}: DataTableSelectionColumnHeaderProps<TData>) => {
  const hasSelectableRows = table
    .getRowModel()
    .rows.some((row) => row.getCanSelect());

  return (
    <div className="flex items-center">
      {hasSelectableRows ? (
        <div className="flex items-center pl-[var(--spacing-1)]">
          <Checkbox
            aria-label={checkboxAriaLabel}
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked)
            }
            size="s"
          />
        </div>
      ) : null}
      <DataTableColumnHeader column={column} title={title} />
    </div>
  );
};
