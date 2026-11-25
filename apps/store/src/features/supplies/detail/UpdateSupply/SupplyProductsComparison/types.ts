import type {
  FormEntriesComparisonProps,
  FormEntriesTableProps,
  FormEntryPreviewRow,
} from '@/lib/components/FormConflictResolver';
import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';

export type SupplyProductPreviewRow =
  FormEntryPreviewRow<SupplyEntryFormValues>;

export type SupplyProductsTableProps = Omit<
  FormEntriesTableProps<SupplyEntryFormValues>,
  'columns' | 'isBlankEntry' | 'normalizeEntry'
>;

export type SupplyProductsComparisonProps = Omit<
  FormEntriesComparisonProps<SupplyEntryFormValues>,
  'columns' | 'isBlankEntry' | 'normalizeEntry'
>;
