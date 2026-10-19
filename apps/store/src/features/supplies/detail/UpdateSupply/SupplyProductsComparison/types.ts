import type { FormMergeValues } from '@/lib/utils/form/comparison/mergeFormValues';
import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';

export type SupplyProductPreviewRow = SupplyEntryFormValues & {
  source?: 'Saved version' | 'Your added row · kept';
};

export type SupplyProductsTableProps = {
  label: string;
  entries: SupplyEntryFormValues[];
  addedEntries?: SupplyEntryFormValues[];
};

export type SupplyProductsComparisonProps = FormMergeValues<
  SupplyEntryFormValues[]
> & {
  merged: SupplyEntryFormValues[];
};
