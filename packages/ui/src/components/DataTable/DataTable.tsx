'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { cn } from '@/ui/lib/utils';
import type {
  DataTableColumnAlignment,
  DataTableProps,
  DataTableRowSelectionState,
  DataTableSortingState,
} from './types';

const tableShellStyle = {
  boxShadow:
    'var(--card-x1) var(--card-y1) var(--card-blur1) var(--card-spread1) var(--color-grey-20), var(--card-x2) var(--card-y2) var(--card-blur2) var(--card-spread2) var(--color-grey-12)',
} satisfies CSSProperties;

const resolveRowSelectionState = (
  updater:
    | DataTableRowSelectionState
    | ((
        previousState: DataTableRowSelectionState
      ) => DataTableRowSelectionState),
  previousState: DataTableRowSelectionState
) => (typeof updater === 'function' ? updater(previousState) : updater);

const resolveSortingState = (
  updater:
    | DataTableSortingState
    | ((previousState: DataTableSortingState) => DataTableSortingState),
  previousState: DataTableSortingState
) => (typeof updater === 'function' ? updater(previousState) : updater);

const getAlignmentClassName = (align?: DataTableColumnAlignment) => {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'right') {
    return 'text-right';
  }

  return 'text-left';
};

const getAriaSort = (sortDirection: false | 'asc' | 'desc') => {
  if (sortDirection === 'asc') {
    return 'ascending';
  }

  if (sortDirection === 'desc') {
    return 'descending';
  }

  return undefined;
};

const getColumnStyle = ({
  minWidth,
  width,
}: {
  minWidth?: number | string;
  width?: number | string;
}) => {
  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedMinWidth =
    typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

  if (!resolvedWidth && !resolvedMinWidth) {
    return undefined;
  }

  return {
    minWidth: resolvedMinWidth,
    width: resolvedWidth,
  } satisfies CSSProperties;
};

export const DataTable = <TData,>({
  ariaLabel,
  columns,
  data,
  emptyMessage = 'No results.',
  getRowCanSelect,
  getRowId,
  onRowSelectionChange,
  onSortingChange,
  rowSelection,
  sorting,
  selectable = false,
}: DataTableProps<TData>) => {
  const [uncontrolledRowSelection, setUncontrolledRowSelection] =
    useState<DataTableRowSelectionState>({});
  const [uncontrolledSorting, setUncontrolledSorting] =
    useState<DataTableSortingState>([]);
  const resolvedRowSelection = rowSelection ?? uncontrolledRowSelection;
  const resolvedSorting = sorting ?? uncontrolledSorting;

  const table = useReactTable({
    columns,
    data,
    enableRowSelection: selectable
      ? (row) => getRowCanSelect?.(row.original, row.index) ?? true
      : false,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: (updater) => {
      const nextRowSelection = resolveRowSelectionState(
        updater,
        resolvedRowSelection
      );

      if (rowSelection === undefined) {
        setUncontrolledRowSelection(nextRowSelection);
      }

      onRowSelectionChange?.(nextRowSelection);
    },
    onSortingChange: (updater) => {
      const nextSorting = resolveSortingState(updater, resolvedSorting);

      if (sorting === undefined) {
        setUncontrolledSorting(nextSorting);
      }

      onSortingChange?.(nextSorting);
    },
    state: {
      rowSelection: resolvedRowSelection,
      sorting: resolvedSorting,
    },
  });

  return (
    <div
      className="overflow-hidden rounded-[var(--card-radius)] bg-card text-card-foreground"
      data-slot="data-table"
      style={tableShellStyle}
    >
      <div className="overflow-x-auto">
        <table
          aria-label={ariaLabel}
          className="min-w-full w-max border-collapse border-spacing-0"
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[var(--background-neutral)]"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <th
                      aria-sort={getAriaSort(sortDirection)}
                      key={header.id}
                      className={cn(
                        'bg-[var(--background-neutral)] p-0 align-middle text-[length:var(--table-head-size-desktop)] leading-[var(--table-head-line-height-desktop)] font-[var(--table-head-weight)] [font-family:var(--font-family-primary)] text-[var(--color-text-secondary)]',
                        getAlignmentClassName(meta?.align),
                        meta?.wrap === 'nowrap' && 'whitespace-nowrap'
                      )}
                      colSpan={header.colSpan}
                      scope="col"
                      style={getColumnStyle(meta ?? {})}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-card last:[&_td]:border-b-0 data-[state=selected]:bg-[var(--color-primary-8)]"
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'border-b border-dashed border-[var(--color-divider)] p-0 align-middle text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] [font-family:var(--body2-family)] text-card-foreground',
                          getAlignmentClassName(meta?.align),
                          meta?.wrap === 'nowrap' && 'whitespace-nowrap'
                        )}
                        style={getColumnStyle(meta ?? {})}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className="bg-card">
                <td
                  className="px-[var(--spacing-2)] py-[var(--spacing-2-5)] text-center text-muted-foreground"
                  colSpan={table.getAllLeafColumns().length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
