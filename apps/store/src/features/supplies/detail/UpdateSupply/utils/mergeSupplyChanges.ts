import {
  getAddedFormEntries,
  mergeAddedFormEntries,
} from '@/lib/components/FormConflictResolver';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import {
  type FormMergeChoices,
  type FormMergeFields,
  type FormMergeValues,
  mergeFormValues,
} from '@/lib/utils/form/comparison/mergeFormValues';
import {
  getSupplyFormDefaults,
  type SupplyFormValues,
} from '../../../shared/SupplyEditorForm';
import { normalizeSupplyEntry } from './normalizeSupplyEntry';

export type SupplyMergeChoices = FormMergeChoices<keyof SupplyFormValues>;

type MergeSupplyChangesArgs = {
  baseline: SupplyDetails;
  current: SupplyFormValues;
  latest: SupplyDetails;
  choices?: SupplyMergeChoices;
};

// Compare product lists without UI ids or option display metadata. Keep blank
// rows in this comparison so unfinished rows are preserved during refresh.
const normalizeEntries = (entries: SupplyFormValues['supplyEntries']) =>
  entries.map(normalizeSupplyEntry);

const describeValue = (value: SupplyFormValues[keyof SupplyFormValues]) => {
  if (Array.isArray(value)) {
    return value.length
      ? value
          .map(
            (entry, index) =>
              `${index + 1}. ${entry.productVariant?.name || 'No product selected'}; ` +
              `quantity: ${entry.quantity || '(empty)'}; ` +
              `unit: ${entry.unitOfMeasurement?.name || '(none)'}; ` +
              `unit price: ${entry.unitPrice || '(empty)'}; ` +
              `comment: ${entry.comment || '(empty)'}`
          )
          .join('\n')
      : 'No products';
  }

  if (typeof value === 'string') {
    return value || '(empty)';
  }

  return value?.name || '(none)';
};

export const getAddedSupplyEntries = ({
  baseline,
  current,
}: Pick<
  FormMergeValues<SupplyFormValues['supplyEntries']>,
  'baseline' | 'current'
>) =>
  getAddedFormEntries({
    baseline,
    current,
    normalizeEntry: normalizeSupplyEntry,
  });

const mergeAddedEntries = (
  values: FormMergeValues<SupplyFormValues['supplyEntries']>
) =>
  mergeAddedFormEntries({
    ...values,
    normalizeEntry: normalizeSupplyEntry,
  });

const fields: FormMergeFields<SupplyFormValues> = {
  supplier: {
    label: 'Supplier',
    normalize: (value) => value?.id ?? null,
    describe: describeValue,
  },
  warehouse: {
    label: 'Warehouse',
    normalize: (value) => value?.id ?? null,
    describe: describeValue,
  },
  supplyNumber: {
    label: 'Supply number',
    normalize: (value) => value.trim(),
    describe: describeValue,
  },
  supplierInvoiceNumber: {
    label: 'Supplier invoice number',
    normalize: (value) => value.trim(),
    describe: describeValue,
  },
  comment: {
    label: 'Comment',
    normalize: (value) => value.trim(),
    describe: describeValue,
  },
  supplyEntries: {
    label: 'Supply products',
    normalize: normalizeEntries,
    describe: describeValue,
    merge: mergeAddedEntries,
    helperText:
      'Choose one complete product list. Products from the other list will not be included.',
  },
};

export const mergeSupplyChanges = ({
  baseline,
  current,
  latest,
  choices,
}: MergeSupplyChangesArgs) =>
  mergeFormValues({
    baseline: getSupplyFormDefaults(baseline),
    current,
    latest: getSupplyFormDefaults(latest),
    fields,
    choices,
  });
