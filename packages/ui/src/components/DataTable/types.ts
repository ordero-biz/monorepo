import type {
  Column,
  ColumnDef,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';

export type DataTableColumnAlignment = 'left' | 'center' | 'right';

export type DataTableColumnWrap = 'wrap' | 'nowrap';

export type DataTableColumnMeta = {
  align?: DataTableColumnAlignment;
  minWidth?: number | string;
  width?: number | string;
  wrap?: DataTableColumnWrap;
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue>
    extends DataTableColumnMeta {}
}

export type DataTableColumnDef<TData> = ColumnDef<TData, unknown>;

export type DataTableColumnHeaderProps<TData extends RowData> = {
  column: Column<TData, unknown>;
  title: string;
};

export type DataTableRowSelectionState = RowSelectionState;
export type DataTableSortingState = SortingState;

export type DataTableProps<TData> = {
  ariaLabel: string;
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  getRowCanSelect?: (row: TData, index: number) => boolean;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  manualSorting?: boolean;
  onRowSelectionChange?: (rowSelection: DataTableRowSelectionState) => void;
  onSortingChange?: (sorting: DataTableSortingState) => void;
  rowSelection?: DataTableRowSelectionState;
  sorting?: DataTableSortingState;
  selectable?: boolean;
};
