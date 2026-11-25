import {
  createFormEntriesRenderer,
  FormEntriesComparison,
  FormEntriesTable,
} from '@/lib/components/FormConflictResolver';
import { isBlankSupplyEntry } from '../../../shared/SupplyEditorForm/utils/entries';
import { normalizeSupplyEntry } from '../utils/normalizeSupplyEntry';
import { columns } from './columns';
import type {
  SupplyProductsComparisonProps,
  SupplyProductsTableProps,
} from './types';

export const SupplyProductsTable = (props: SupplyProductsTableProps) => (
  <FormEntriesTable
    {...props}
    columns={columns}
    isBlankEntry={isBlankSupplyEntry}
    normalizeEntry={normalizeSupplyEntry}
  />
);

export const SupplyProductsComparison = (
  props: SupplyProductsComparisonProps
) => (
  <FormEntriesComparison
    {...props}
    columns={columns}
    isBlankEntry={isBlankSupplyEntry}
    normalizeEntry={normalizeSupplyEntry}
  />
);

export const supplyProductsRenderer = createFormEntriesRenderer({
  columns,
  isBlankEntry: isBlankSupplyEntry,
  normalizeEntry: normalizeSupplyEntry,
});
