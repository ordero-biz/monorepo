import type { SelectRoot } from '@base-ui/react/select';
import type { SwitchRoot } from '@base-ui/react/switch';
import type { ReactNode } from 'react';

export type TablePaginationRangeLabelArgs = {
  count: number;
  from: number;
  page: number;
  rowsPerPage: number;
  to: number;
};

export type TablePaginationProps = {
  'aria-label'?: string;
  count: number;
  defaultDense?: boolean;
  dense?: boolean;
  denseLabel?: ReactNode;
  disabled?: boolean;
  getRangeLabel?: (args: TablePaginationRangeLabelArgs) => ReactNode;
  nextPageLabel?: string;
  onDenseChange?: (
    dense: boolean,
    details: SwitchRoot.ChangeEventDetails
  ) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (
    rowsPerPage: number,
    details: SelectRoot.ChangeEventDetails
  ) => void;
  page: number;
  previousPageLabel?: string;
  rowsPerPage: number;
  rowsPerPageLabel?: ReactNode;
  rowsPerPageOptions?: readonly number[];
  showDenseToggle?: boolean;
};
