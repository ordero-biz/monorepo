import {
  createFormEntriesRenderer,
  FormEntriesComparison,
  FormEntriesTable,
} from '@/lib/components/FormConflictResolver';
import { isBlankTransferEntry } from '../../../shared/TransferEditorForm/utils/entries';
import { normalizeTransferEntry } from '../utils/normalizeTransferEntry';
import { columns } from './columns';
import type {
  TransferProductsComparisonProps,
  TransferProductsTableProps,
} from './types';

export const TransferProductsTable = (props: TransferProductsTableProps) => (
  <FormEntriesTable
    {...props}
    columns={columns}
    isBlankEntry={isBlankTransferEntry}
    normalizeEntry={normalizeTransferEntry}
  />
);

export const TransferProductsComparison = (
  props: TransferProductsComparisonProps
) => (
  <FormEntriesComparison
    {...props}
    columns={columns}
    isBlankEntry={isBlankTransferEntry}
    normalizeEntry={normalizeTransferEntry}
  />
);

export const transferProductsRenderer = createFormEntriesRenderer({
  columns,
  isBlankEntry: isBlankTransferEntry,
  normalizeEntry: normalizeTransferEntry,
});
