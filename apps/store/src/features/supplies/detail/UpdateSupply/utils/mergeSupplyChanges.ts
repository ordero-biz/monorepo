import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { areFormValuesEqual } from '@/lib/utils/form/comparison/areFormValuesEqual';
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

export type SupplyMergeChoices = FormMergeChoices<keyof SupplyFormValues>;

type MergeSupplyChangesArgs = {
  baseline: SupplyDetails;
  current: SupplyFormValues;
  latest: SupplyDetails;
  choices?: SupplyMergeChoices;
};

const normalizeNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed !== '' && Number.isFinite(Number(trimmed))
    ? Number(trimmed)
    : trimmed;
};

// Compare product lists without UI ids or option display metadata. Keep blank
// rows in this comparison so unfinished rows are preserved during refresh.
const normalizeEntries = (entries: SupplyFormValues['supplyEntries']) =>
  entries.map((entry) => ({
    productVariantId: entry.productVariant?.id ?? null,
    unitOfMeasurementId: entry.unitOfMeasurement?.id ?? null,
    quantity: normalizeNumber(entry.quantity),
    unitPrice: normalizeNumber(entry.unitPrice),
    comment: entry.comment.trim(),
  }));

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

const mergeAddedEntries = ({
  baseline,
  current,
  latest,
}: FormMergeValues<SupplyFormValues['supplyEntries']>) => {
  // Compare local ids only with the editing baseline: saved ids may change.
  // The default empty row is a placeholder, not a persisted product.
  const initialEntries = baseline.filter(
    (entry) => entry.clientId !== 'initial-placeholder'
  );
  const initialIds = new Set(initialEntries.map((entry) => entry.clientId));
  const existingEntries = current.filter((entry) =>
    initialIds.has(entry.clientId)
  );
  const addedEntries = current.filter(
    (entry) => !initialIds.has(entry.clientId)
  );
  const existingEntriesUnchanged =
    areFormValuesEqual(
      existingEntries.map((entry) => entry.clientId),
      initialEntries.map((entry) => entry.clientId)
    ) &&
    areFormValuesEqual(
      normalizeEntries(existingEntries),
      normalizeEntries(initialEntries)
    );

  if (
    addedEntries.length > 0 &&
    existingEntriesUnchanged &&
    !areFormValuesEqual(current, baseline)
  ) {
    const savedEntries = latest.filter(
      (entry) => entry.clientId !== 'initial-placeholder'
    );
    return { value: [...savedEntries, ...addedEntries] };
  }
  return undefined;
};

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
    helperText: 'Choose the complete product list to keep.',
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
