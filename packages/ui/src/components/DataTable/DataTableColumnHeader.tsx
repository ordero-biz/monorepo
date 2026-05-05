'use client';

import type { RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { IconButton } from '@/ui/components/IconButton';
import { cn } from '@/ui/lib/utils';
import type {
  DataTableColumnAlignment,
  DataTableColumnHeaderProps,
} from './types';

const getContentAlignmentClassName = (align?: DataTableColumnAlignment) => {
  if (align === 'center') {
    return 'justify-center';
  }

  if (align === 'right') {
    return 'justify-end';
  }

  return 'justify-start';
};

const getSortButtonLabel = ({
  nextSortingOrder,
  sortDirection,
  title,
}: {
  nextSortingOrder: ReturnType<
    DataTableColumnHeaderProps<RowData>['column']['getNextSortingOrder']
  >;
  sortDirection: ReturnType<
    DataTableColumnHeaderProps<RowData>['column']['getIsSorted']
  >;
  title: string;
}) => {
  const currentSortingLabel =
    sortDirection === 'asc'
      ? 'sorted ascending'
      : sortDirection === 'desc'
        ? 'sorted descending'
        : 'not sorted';
  const nextSortingLabel =
    nextSortingOrder === 'asc'
      ? 'ascending'
      : nextSortingOrder === 'desc'
        ? 'descending'
        : 'no sorting';

  return `${title}. ${currentSortingLabel}. Activate to sort ${nextSortingLabel}.`;
};

export const DataTableColumnHeader = <TData extends RowData>({
  column,
  title,
}: DataTableColumnHeaderProps<TData>) => {
  const align = column.columnDef.meta?.align;
  const isSortable = column.getCanSort();
  const sortDirection = column.getIsSorted();
  const nextSortingOrder = column.getNextSortingOrder();
  const Icon =
    sortDirection === 'asc'
      ? ArrowUp
      : sortDirection === 'desc'
        ? ArrowDown
        : ArrowUpDown;

  return (
    <div
      className={cn(
        'flex w-full items-center gap-[var(--spacing-0-5)] p-[var(--spacing-2)]',
        getContentAlignmentClassName(align)
      )}
      data-slot="data-table-column-header"
    >
      {isSortable ? (
        <>
          <span className={cn(sortDirection && 'text-card-foreground')}>
            {title}
          </span>
          <IconButton
            aria-label={getSortButtonLabel({
              nextSortingOrder,
              sortDirection,
              title,
            })}
            color={sortDirection ? 'inherit' : 'default'}
            onClick={column.getToggleSortingHandler()}
            size="xs"
            type="button"
          >
            <Icon />
          </IconButton>
        </>
      ) : (
        <span>{title}</span>
      )}
    </div>
  );
};
