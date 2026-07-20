'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  DataTableRowSelectionState,
  UseDataTableSelectionArgs,
} from './types';

export const useDataTableSelection = <TData,>({
  data,
  getRowCanSelect,
  getRowCheckboxAriaLabel,
  getRowId,
  selectAllCheckboxAriaLabel,
}: UseDataTableSelectionArgs<TData>) => {
  const [rowSelection, setRowSelection] =
    useState<DataTableRowSelectionState>({});
  const clearSelection = useCallback(() => setRowSelection({}), []);
  const selectedRows = useMemo(
    () =>
      data?.filter((row, index) => rowSelection[getRowId(row, index)]) ?? [],
    [data, getRowId, rowSelection]
  );
  const selection = useMemo(
    () => ({
      getRowCanSelect,
      getRowCheckboxAriaLabel,
      onRowSelectionChange: setRowSelection,
      rowSelection,
      selectAllCheckboxAriaLabel,
    }),
    [
      getRowCanSelect,
      getRowCheckboxAriaLabel,
      rowSelection,
      selectAllCheckboxAriaLabel,
    ]
  );

  return {
    clearSelection,
    rowSelection,
    selectedRows,
    selection,
  };
};
