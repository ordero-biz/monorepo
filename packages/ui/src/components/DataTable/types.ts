import type {
  Column,
  ColumnDef,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  Table,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type { TablePaginationProps } from '@/ui/components/TablePagination';

export type DataTableColumnAlignment = 'left' | 'center' | 'right';

export type DataTableColumnWrap = 'wrap' | 'nowrap';

export type DataTableCellVariant = 'actions' | 'default';

export type DataTableColumnMeta = {
  align?: DataTableColumnAlignment;
  minWidth?: number | string;
  width?: number | string;
  wrap?: DataTableColumnWrap;
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue>
    extends DataTableColumnMeta {}

  interface TableMeta<TData extends RowData> {
    dataTableSelection?: DataTableSelectionProps<TData>;
  }
}

export type DataTableColumnDef<TData> = ColumnDef<TData, unknown>;

export type DataTableColumnHeaderProps<TData extends RowData> = {
  column: Column<TData, unknown>;
  title: string;
};

export type DataTableSelectionColumnHeaderProps<TData extends RowData> = {
  checkboxAriaLabel: string;
  column: Column<TData, unknown>;
  table: Table<TData>;
  title: string;
};

export type DataTableSelectionCellProps<TData extends RowData> = {
  checkboxAriaLabel: string;
  children: ReactNode;
  row: Row<TData>;
};

export type DataTableCellProps = {
  children: ReactNode;
  variant?: DataTableCellVariant;
};

export type DataTableRowSelectionState = RowSelectionState;

export type DataTableSelectionProps<TData> = {
  getRowCanSelect?: (row: TData, index: number) => boolean;
  getRowCheckboxAriaLabel?: (row: TData, index: number) => string;
  onRowSelectionChange?: (rowSelection: DataTableRowSelectionState) => void;
  rowSelection?: DataTableRowSelectionState;
  selectAllCheckboxAriaLabel?: string;
};

export type UseDataTableSelectionArgs<TData> = {
  data?: TData[];
  getRowId: (row: TData, index: number) => string;
  getRowCanSelect?: DataTableSelectionProps<TData>['getRowCanSelect'];
  getRowCheckboxAriaLabel?: DataTableSelectionProps<TData>['getRowCheckboxAriaLabel'];
  selectAllCheckboxAriaLabel?: string;
};

export type DataTablePaginationState = PaginationState;

export type DataTablePaginationProps = Omit<TablePaginationProps, 'count'> & {
  count?: number;
};

export type DataTableSortingState = SortingState;

export type DataTableProps<TData> = {
  ariaLabel: string;
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  getRowCanSelect?: (row: TData, index: number) => boolean;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  manualPagination?: boolean;
  manualSorting?: boolean;
  onRowSelectionChange?: (rowSelection: DataTableRowSelectionState) => void;
  onSortingChange?: (sorting: DataTableSortingState) => void;
  pagination?: DataTablePaginationProps;
  rowSelection?: DataTableRowSelectionState;
  selection?: DataTableSelectionProps<TData>;
  sorting?: DataTableSortingState;
  selectable?: boolean;
};
