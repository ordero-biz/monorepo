import type {
  FormEntriesComparisonProps,
  FormEntriesTableProps,
  FormEntryPreviewRow,
} from '@/lib/components/FormConflictResolver';
import type { TransferEntryFormValues } from '../../../shared/TransferEditorForm/types';

export type TransferProductPreviewRow =
  FormEntryPreviewRow<TransferEntryFormValues>;

export type TransferProductsTableProps = Omit<
  FormEntriesTableProps<TransferEntryFormValues>,
  'columns' | 'isBlankEntry' | 'normalizeEntry'
>;

export type TransferProductsComparisonProps = Omit<
  FormEntriesComparisonProps<TransferEntryFormValues>,
  'columns' | 'isBlankEntry' | 'normalizeEntry'
>;
